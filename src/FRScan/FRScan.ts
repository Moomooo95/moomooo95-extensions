import {
  Source,
  Manga,
  Chapter,
  ChapterDetails,
  HomeSection,
  SearchRequest,
  TagSection,
  PagedResults,
  SourceInfo,
  MangaUpdates,
  TagType,
  RequestManager,
  ContentRating,
  MangaTile
} from "paperback-extensions-common"

import {
  isLastPage,
  parseDate,
  parseHomeSections,
  parseFRScanChapterDetails,
  parseFRScanChapters,
  parseFRScanMangaDetails,
  parseSearch,
  parseTags
} from "./FRScanParser";

const FRSCAN_DOMAIN = "https://www.frscan.cc/";
const method = 'GET'
const headers = {
  'Host': 'www.frscan.cc',
}

export const FRScanInfo: SourceInfo = {
    version: '1.1',
    name: 'FRScan',
    icon: 'logo.png',
    author: 'Moomooo95',
    authorWebsite: 'https://github.com/Moomooo95',
    description: 'Source française FRScan (anciennement appelée LelScanVF)',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: FRSCAN_DOMAIN,
    sourceTags: [
      {
        text: "Francais",
        type: TagType.GREY
      },
      {
          text: 'Notifications',
          type: TagType.GREEN
      }
    ]
}

export class FRScan extends Source {

  requestManager: RequestManager = createRequestManager({
      requestsPerSecond: 3
  });


  /////////////////////////////////
  /////    MANGA SHARE URL    /////
  /////////////////////////////////

  getMangaShareUrl(mangaId: string): string {
    return `${FRSCAN_DOMAIN}/manga/${mangaId}`
  }


  ///////////////////////////////
  /////    MANGA DETAILS    /////
  ///////////////////////////////

  async getMangaDetails(mangaId: string): Promise<Manga> {
    const request = createRequestObject({
      url: `${FRSCAN_DOMAIN}/manga/${mangaId}`,
      method,
        headers
    })

    const response = await this.requestManager.schedule(request, 1);
    const $ = this.cheerio.load(response.data);
    
    return await parseFRScanMangaDetails($, mangaId);
  }


  //////////////////////////
  /////    CHAPTERS    /////
  //////////////////////////

  async getChapters(mangaId: string): Promise<Chapter[]> {
    const request = createRequestObject({
      url: `${FRSCAN_DOMAIN}/manga/${mangaId}`,
      method,
      headers
    })

    const response = await this.requestManager.schedule(request, 1);
    const $ = this.cheerio.load(response.data);
    
    return await parseFRScanChapters($, mangaId);
  }
  

  //////////////////////////////////
  /////    CHAPTERS DETAILS    /////
  //////////////////////////////////

  async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
    const request = createRequestObject({
      url: `${chapterId}`,
      method,
      headers 
    })

    const response = await this.requestManager.schedule(request, 1);
    const $ = this.cheerio.load(response.data);
    
    return await parseFRScanChapterDetails($, mangaId, chapterId);
  }


  ////////////////////////////////
  /////    SEARCH REQUEST    /////
  ////////////////////////////////

  async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
    const page: number = metadata?.page ?? 1
    const search = query.title?.replace(/ /g, '+').replace(/[’'´]/g, '%27') ?? ""
    let manga: MangaTile[] = []

    if (query.includedTags && query.includedTags?.length != 0) {

      const request = createRequestObject({
        url: `${FRSCAN_DOMAIN}/filterList?page=${page}&tag=${query.includedTags[0].id}&alpha=${search}&sortBy=name&asc=true`,
        method,
        headers
      })
  
      const response = await this.requestManager.schedule(request, 1)
      const $ = this.cheerio.load(response.data)

      manga = parseSearch($)
      metadata = !isLastPage($) ? { page: page + 1 } : undefined
    }
    else {
      const request = createRequestObject({
        url: `${FRSCAN_DOMAIN}/filterList?page=${page}&alpha=${search}&sortBy=name&asc=true`,
        method,
        headers
      })
  
      const response = await this.requestManager.schedule(request, 1)
      const $ = this.cheerio.load(response.data)
      
      manga = parseSearch($)
      metadata = !isLastPage($) ? { page: page + 1 } : undefined
    }

    return createPagedResults({
      results: manga,
      metadata
    })    
  }


  //////////////////////////////
  /////    HOME SECTION    /////
  //////////////////////////////

  async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
    const section1 = createHomeSection({ id: 'latest_popular_manga', title: 'Dernier Manga Populaire Sorti' })
    const section2 = createHomeSection({ id: 'latest_updates', title: 'Dernier Manga Sorti' })
    const section3 = createHomeSection({ id: 'top_manga', title: 'Top MANGA' })

    const request1 = createRequestObject({
      url: `${FRSCAN_DOMAIN}`,
      method: 'GET'
    })

    const response1 = await this.requestManager.schedule(request1, 1)
    const $1 = this.cheerio.load(response1.data)
    
    parseHomeSections($1, [section1, section2, section3], sectionCallback)
  }


  //////////////////////
  /////    TAGS    /////
  //////////////////////

  async getTags(): Promise<TagSection[]> {
    const request = createRequestObject({
      url: `${FRSCAN_DOMAIN}/manga-list`,
      method,
      headers
    })

    const response = await this.requestManager.schedule(request, 1)
    const $ = this.cheerio.load(response.data)
    
    return parseTags($)
  }


  //////////////////////////////////////
  /////    FILTER UPDATED MANGA    /////
  //////////////////////////////////////

  async filterUpdatedManga(mangaUpdatesFoundCallback: (updates: MangaUpdates) => void, time: Date, ids: string[]): Promise<void> {
    const request = createRequestObject({
        url: `${FRSCAN_DOMAIN}`,
        method,
        headers
    })

    const response = await this.requestManager.schedule(request, 1)
    const $ = this.cheerio.load(response.data)

    const updatedManga: string[] = []
    for (const manga of $('.mangalist .manga-item').toArray()) {
      let id = $('a', manga).first().attr('href')
      let mangaDate = parseDate($('.pull-right', manga).text().trim() ?? '')

      if (!id) continue
      if (mangaDate > time) {
          if (ids.includes(id)) {
              updatedManga.push(id)
          }
      }
    }

    mangaUpdatesFoundCallback(createMangaUpdates({ids: updatedManga}))
  }
}