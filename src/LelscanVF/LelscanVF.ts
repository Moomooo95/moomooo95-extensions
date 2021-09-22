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
  RequestHeaders,
  TagType
} from "paperback-extensions-common"

import {
  generateSearch,
  parseHomeSections,
  parseLelscanVFChapterDetails,
  parseLelscanVFChapters,
  parseLelscanVFMangaDetails,
  parseMangaSectionTiles,
  parseSearch,
  parseTags,
  parseViewMore
} from "./LelscanVFParser";

const LELSCANVF_DOMAIN = "https://www.lelscan-vf.co";
const LELSCANVF_DOMAIN_MANGA_LIST = "https://www.lelscan-vf.co/manga-list";
const method = 'GET'
const headers = {
  'Host': 'www.lelscan-vf.co',
}

export const LelscanVFInfo: SourceInfo = {
  version: '1.0.0',
  name: 'LelscanVF',
  icon: 'logo.png',
  author: 'Momo',
  authorWebsite: '',
  description: 'LELSCAN-VF',
  hentaiSource: false,
  websiteBaseURL: LELSCANVF_DOMAIN,
  sourceTags: [
    {
      text: "Francais",
      type: TagType.GREEN
    }
  ]
}

export class LelscanVF extends Source {

  /////////////////////////////////
  /////    getMangaDetails    /////
  /////////////////////////////////

  async getMangaDetails(mangaId: string): Promise<Manga> {
    
    const request = createRequestObject({
      url: `${LELSCANVF_DOMAIN}/manga/${mangaId}`,
      method,
      headers
    })

    const data = await this.requestManager.schedule(request, 1);
    const $ = this.cheerio.load(data.data);
    
    return await parseLelscanVFMangaDetails($, mangaId);
  }


  /////////////////////////////
  /////    getChapters    /////
  /////////////////////////////

  async getChapters(mangaId: string): Promise<Chapter[]> {

    const request = createRequestObject({
      url: `${LELSCANVF_DOMAIN}/manga/${mangaId}`,
      method,
      headers
    })

    const data = await this.requestManager.schedule(request, 1);
    const $ = this.cheerio.load(data.data);
    
    return await parseLelscanVFChapters($, mangaId);
  }
  

  ////////////////////////////////////
  /////    getChaptersDetails    /////
  ////////////////////////////////////

  async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
    
    const request = createRequestObject({
      url: `${chapterId}`,
      method,
      headers 
    })

    const data = await this.requestManager.schedule(request, 1);
    const $ = this.cheerio.load(data.data);
    
    return await parseLelscanVFChapterDetails($, mangaId, chapterId);
  }


  ///////////////////////////////
  /////    searchRequest    /////
  ///////////////////////////////

  async searchRequest(query: SearchRequest, metadata: any): Promise<PagedResults> {
    
    const search = generateSearch(query)
    const request = createRequestObject({
      url: `${LELSCANVF_DOMAIN}/search`,
      method,
      headers,
      param: `?query=${search}`
    })

    const response = await this.requestManager.schedule(request, 1)
    const $ = this.cheerio.load(response.data)
    const manga = parseSearch($)

    return createPagedResults({
      results: manga,
      metadata
    })    
  }


  /////////////////////////////////////
  /////    getHomePageSections    /////
  /////////////////////////////////////

  async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
    // Give Paperback a skeleton of what these home sections should look like to pre-render them
    const section1 = createHomeSection({ id: 'latest_updates', title: 'Dernier Manga Sorti', view_more: true })
    const section2 = createHomeSection({ id: 'popular_manga', title: 'Manga Populaire', view_more: true  })
    const section3 = createHomeSection({ id: 'top_manga', title: 'Top MANGA', view_more: true })

    // Fill the homsections with data
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
    parseMangaSectionTiles($2, [section3], sectionCallback)
  }


  //////////////////////////////////
  /////    getViewMoreItems    /////
  //////////////////////////////////

  async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults | null> {
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
      default:
        return Promise.resolve(null)
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


  /////////////////////////
  /////    getTags    /////
  /////////////////////////

  async getTags(): Promise<TagSection[] | null> {
    const request = createRequestObject({
      url: `${LELSCANVF_DOMAIN_MANGA_LIST}`,
      method,
    })

    const response = await this.requestManager.schedule(request, 1)
    const $ = this.cheerio.load(response.data)
    return parseTags($)
  }
}