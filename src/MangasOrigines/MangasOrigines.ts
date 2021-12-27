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
  MangaTile,
  ContentRating,
  RequestManager,
  HomeSectionType
} from "paperback-extensions-common"

import { 
  parseHomeSections,
  parseMangasOriginesDetails,
  parseMangasOriginesChapters,
  parseMangasOriginesChapterDetails,
  parseViewMore,
  isLastPage,
  parseTags,
  parseSearch,
  parseDate
} from "./MangasOriginesParser";

const MANGASORIGINES_DOMAIN = "https://mangas-origines.fr";
const method = 'GET'
const headers = {
  'Host': 'mangas-origines.fr'
}

export const MangasOriginesInfo: SourceInfo = {
  version: '1.2',
  name: 'MangasOrigines',
  icon: 'logo.png',
  author: 'Moomooo95',
  authorWebsite: 'https://github.com/Moomooo95',
  description: 'Source française MangasOrigines',
  contentRating: ContentRating.ADULT,
  websiteBaseURL: MANGASORIGINES_DOMAIN,
  sourceTags: [
    {
      text: "Francais",
      type: TagType.GREY
    },
    {
        text: 'Notifications',
        type: TagType.GREEN
    },
    {
      text: 'Cloudflare',
      type: TagType.RED
    }
  ]
}

export class MangasOrigines extends Source {

  requestManager: RequestManager = createRequestManager({
      requestsPerSecond: 3
  });

  
  /////////////////////////////////
  /////    MANGA SHARE URL    /////
  /////////////////////////////////

  getMangaShareUrl(mangaId: string): string {
    return `${MANGASORIGINES_DOMAIN}/catalogue/${mangaId}`
  }


  ///////////////////////////////
  /////    MANGA DETAILS    /////
  ///////////////////////////////

  async getMangaDetails(mangaId: string): Promise<Manga> {
    const request = createRequestObject({
      url: `${MANGASORIGINES_DOMAIN}/catalogue/${mangaId}`,
      method,
      headers
    })

    const response = await this.requestManager.schedule(request, 1);
    this.CloudFlareError(response.status)
    const $ = this.cheerio.load(response.data);
    
    return await parseMangasOriginesDetails($, mangaId);
  }


  //////////////////////////
  /////    CHAPTERS    /////
  //////////////////////////

  async getChapters(mangaId: string): Promise<Chapter[]> {
    const request = createRequestObject({
      url: `${MANGASORIGINES_DOMAIN}/catalogue/${mangaId}/ajax/chapters/`,
      method: 'POST',
      headers
    })

    const response = await this.requestManager.schedule(request, 1);
    this.CloudFlareError(response.status)
    const $ = this.cheerio.load(response.data);
    
    return await parseMangasOriginesChapters($, mangaId);
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
    this.CloudFlareError(response.status)
    const $ = this.cheerio.load(response.data);
    
    return await parseMangasOriginesChapterDetails($, mangaId, chapterId);
  }


  ////////////////////////////////
  /////    SEARCH REQUEST    /////
  ////////////////////////////////

  async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
    const page: number = metadata?.page ?? 1
    const search = query.title?.replace(/ /g, '+').replace(/[’'´]/g, '%27') ?? ''
    let manga: MangaTile[] = []

    if (query.includedTags && query.includedTags?.length != 0) {
      const request = createRequestObject({
        url: `${MANGASORIGINES_DOMAIN}/?s=${search}&post_type=wp-manga&genre%5B0%5D=${query.includedTags[0].id}&paged=${page}`,
        method : 'GET',
        headers
      })
  
      const response = await this.requestManager.schedule(request, 1)
      this.CloudFlareError(response.status)
      const $ = this.cheerio.load(response.data)
      
      manga = parseSearch($)
      metadata = !isLastPage($) ? { page: page + 1 } : undefined
    }
    else {
      const request = createRequestObject({
        url: `${MANGASORIGINES_DOMAIN}/?s=${search}&post_type=wp-manga&paged=${page}`,
        method : 'GET',
        headers
      })
  
      const response = await this.requestManager.schedule(request, 1)
      this.CloudFlareError(response.status)
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
    const section1 = createHomeSection({ id: 'hot_manga', title: '🔥 HOT 🔥', type: HomeSectionType.featured })
    const section2 = createHomeSection({ id: 'popular_today', title: 'TOP DU JOUR', view_more: true })
    const section3 = createHomeSection({ id: 'latest_updated', title: 'Dernières Mise à jour', view_more: true })
    const section4 = createHomeSection({ id: 'novelty', title: 'Nouveautés' })

    const request = createRequestObject({
      url: `${MANGASORIGINES_DOMAIN}`,
      method,
      headers
    })

    const response = await this.requestManager.schedule(request, 1)
    this.CloudFlareError(response.status)
    const $ = this.cheerio.load(response.data)
    
    parseHomeSections($, [section1, section2, section3, section4], sectionCallback)
  }

  /////////////////////////////////
  /////    VIEW MORE ITEMS    /////
  /////////////////////////////////

  async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
    let page: number = metadata?.page ?? 1
    let param = ''
    switch (homepageSectionId) {
      case 'popular_today':
        param = `catalogue/?m_orderby=trending&page=${page}`
        break;
      case 'latest_updated':
        param = `catalogue/?m_orderby=latest&page=${page}`
        break;
    }

    const request = createRequestObject({
      url: `${MANGASORIGINES_DOMAIN}/${param}`,
      method,
      headers
    })

    const response = await this.requestManager.schedule(request, 1)
    this.CloudFlareError(response.status)
    const $ = this.cheerio.load(response.data)

    const manga = parseViewMore($)
    metadata = !isLastPage($) ? { page: page + 1 } : undefined

    return createPagedResults({
      results: manga,
      metadata
    })
  }


  //////////////////////////////////////
  /////    FILTER UPDATED MANGA    /////
  //////////////////////////////////////

  async filterUpdatedManga(mangaUpdatesFoundCallback: (updates: MangaUpdates) => void, time: Date, ids: string[]): Promise<void> {
    const request = createRequestObject({
      url: `${MANGASORIGINES_DOMAIN}`,
      method,
      headers
    })

    const response = await this.requestManager.schedule(request, 1)
    this.CloudFlareError(response.status)
    const $ = this.cheerio.load(response.data)

    const updatedManga: string[] = []
    for (const manga of $('.page-content-listing.item-default .page-item-detail.manga').toArray()) {
      let id = $('h3 a', manga).attr('href')
      let mangaDate = parseDate($('.post-on.font-meta', manga).eq(0).text().trim())
  
      if (!id) continue
      if (mangaDate > time) {
        if (ids.includes(id)) {
          updatedManga.push(id)
        }
      }
    }

    mangaUpdatesFoundCallback(createMangaUpdates({ids: updatedManga}))
  }

  
  //////////////////////
  /////    TAGS    /////
  //////////////////////

  async getSearchTags(): Promise<TagSection[]> {
    const request = createRequestObject({
      url: `${MANGASORIGINES_DOMAIN}/?s=&post_type=wp-manga`,
      method,
      headers
    })

    const response = await this.requestManager.schedule(request, 1)
    this.CloudFlareError(response.status)
    const $ = this.cheerio.load(response.data)
    
    return parseTags($)
  }


  ///////////////////////////////////
  /////    CLOUDFLARE BYPASS    /////
  ///////////////////////////////////

  CloudFlareError(status: any) {
    if(status == 503) {
      throw new Error('CLOUDFLARE BYPASS ERROR:\nPlease go to Settings > Sources > \<\The name of this source\> and press Cloudflare Bypass')
    }
  }
  
  getCloudflareBypassRequest() {
    return createRequestObject({
      url: `${MANGASORIGINES_DOMAIN}`,
      method: 'GET',
      headers
    }) 
  }
}