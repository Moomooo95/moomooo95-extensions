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
  parseLelscanVFChapterDetails,
  parseLelscanVFChapters,
  parseLelscanVFMangaDetails,
  parseMangaSectionOthers,
  parseSearch,
  parseSearchTags,
  parseTags,
  parseViewMore
} from "./LelscanVFParser";

const LELSCANVF_DOMAIN = "https://www.lelscan-vf.co";
const method = 'GET'
const headers = {
  'Host': 'www.lelscan-vf.co',
}

export const LelscanVFInfo: SourceInfo = {
    version: '1.0.0',
    name: 'LelscanVF',
    icon: 'logo.png',
    author: 'Moomooo95',
    authorWebsite: 'https://github.com/Moomooo95',
    description: 'Source française LELSCANVF',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: LELSCANVF_DOMAIN,
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

export class LelscanVF extends Source {

  requestManager: RequestManager = createRequestManager({
      requestsPerSecond: 3
  });


  /////////////////////////////////
  /////    MANGA SHARE URL    /////
  /////////////////////////////////

  getMangaShareUrl(mangaId: string): string {
    return `${LELSCANVF_DOMAIN}/manga/${mangaId}`
  }


  ///////////////////////////////
  /////    MANGA DETAILS    /////
  ///////////////////////////////

  async getMangaDetails(mangaId: string): Promise<Manga> {
    const request = createRequestObject({
      url: `${LELSCANVF_DOMAIN}/manga/${mangaId}`,
      method,
        headers
    })

    const response = await this.requestManager.schedule(request, 1);
    const $ = this.cheerio.load(response.data);
    
    return await parseLelscanVFMangaDetails($, mangaId);
  }


  //////////////////////////
  /////    CHAPTERS    /////
  //////////////////////////

  async getChapters(mangaId: string): Promise<Chapter[]> {
    const request = createRequestObject({
      url: `${LELSCANVF_DOMAIN}/manga/${mangaId}`,
      method,
      headers
    })

    const response = await this.requestManager.schedule(request, 1);
    const $ = this.cheerio.load(response.data);
    
    return await parseLelscanVFChapters($, mangaId);
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
    
    return await parseLelscanVFChapterDetails($, mangaId, chapterId);
  }


  ////////////////////////////////
  /////    SEARCH REQUEST    /////
  ////////////////////////////////

  async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
    const search = query.title?.replace(/ /g, '+').replace(/[’'´]/g, '%27') ?? ""
    let manga: MangaTile[] = []

    if (query.includedTags && query.includedTags?.length != 0) {
      const page: number = metadata?.page ?? 1

      const request = createRequestObject({
        url: `${LELSCANVF_DOMAIN}/filterList?page=${page}&tag=${query.includedTags[0].id}&alpha=${search}&sortBy=name&asc=true`,
        method,
        headers
      })
  
      const response = await this.requestManager.schedule(request, 1)
      const $ = this.cheerio.load(response.data)

      manga = parseSearchTags($)
      metadata = !isLastPage($) ? { page: page + 1 } : undefined
    }
    else {
      const request = createRequestObject({
        url: `${LELSCANVF_DOMAIN}/search?query=${search}`,
        method,
        headers
      })
  
      const response = await this.requestManager.schedule(request, 1)
      
      manga = parseSearch(response.data)
      metadata = undefined
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
    const section1 = createHomeSection({ id: 'latest_updates', title: 'Dernier Manga Sorti', view_more: true })
    const section2 = createHomeSection({ id: 'popular_manga', title: 'Manga Populaire', view_more: true  })
    const section3 = createHomeSection({ id: 'top_manga', title: 'Top MANGA', view_more: true })

    const request1 = createRequestObject({
      url: `${LELSCANVF_DOMAIN}`,
      method: 'GET'
    })

    const request2 = createRequestObject({
      url: `${LELSCANVF_DOMAIN}/topManga`,
      method: 'GET'
    })

    const response1 = await this.requestManager.schedule(request1, 1)
    const $1 = this.cheerio.load(response1.data)

    const response2 = await this.requestManager.schedule(request2, 1)
    const $2 = this.cheerio.load(response2.data)
    
    parseHomeSections($1, [section1, section2], sectionCallback)
    parseMangaSectionOthers($2, [section3], sectionCallback)
  }


  /////////////////////////////////
  /////    VIEW MORE ITEMS    /////
  /////////////////////////////////

  async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
    let name = ''
    let param = ''
    switch (homepageSectionId) {
      case 'latest_updates':
        name = 'latest_updates'
        break;
      case 'popular_manga':
        name = 'popular_manga'
        break;
      case 'top_manga':
        name = 'top_manga'
        param = '/topManga'
        break;
    }

    const request = createRequestObject({
      url: `${LELSCANVF_DOMAIN}`,
      method,
      param
    })

    const response = await this.requestManager.schedule(request, 1)
    const $ = this.cheerio.load(response.data)
    const manga = parseViewMore($, name)

    return createPagedResults({
      results: manga
    })
  }


  //////////////////////
  /////    TAGS    /////
  //////////////////////

  async getTags(): Promise<TagSection[]> {
    const request = createRequestObject({
      url: `${LELSCANVF_DOMAIN}/manga-list`,
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
        url: `${LELSCANVF_DOMAIN}`,
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