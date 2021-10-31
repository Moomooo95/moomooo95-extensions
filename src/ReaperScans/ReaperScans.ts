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
import { isLastPage, parseHomeSections, parseReaperScansChapterDetails, parseReaperScansChapters, parseReaperScansDetails, parseSearch, parseTags, parseViewMore } from "../ReaperScans/ReaperScansParser";

const REAPERSCANS_DOMAIN = "https://reaperscans.fr";
const method = 'GET'
const headers = {
  'Host': 'reaperscans.fr'
}

export const ReaperScansInfo: SourceInfo = {
  version: '1.0.0',
  name: 'ReaperScans',
  icon: 'logo.png',
  author: 'Moomooo',
  authorWebsite: '',
  description: 'Source française ReaperScans',
  hentaiSource: false,
  websiteBaseURL: REAPERSCANS_DOMAIN,
  sourceTags: [
    {
      text: "Francais",
      type: TagType.GREY
    }
  ]
}

export class ReaperScans extends Source {


  //////////////////////////////////
  /////    getMangaShareUrl    /////
  //////////////////////////////////

  getMangaShareUrl(mangaId: string): string | null {
    return `${REAPERSCANS_DOMAIN}/manga/${mangaId}`
  }


  /////////////////////////////////
  /////    getMangaDetails    /////
  /////////////////////////////////

  async getMangaDetails(mangaId: string): Promise<Manga> {
      
    const request = createRequestObject({
        url: `${REAPERSCANS_DOMAIN}/manga/${mangaId}`,
        method,
        headers
    })

    const data = await this.requestManager.schedule(request, 1);
    const $ = this.cheerio.load(data.data);
    
    return await parseReaperScansDetails($, mangaId);
  }


  /////////////////////////////
  /////    getChapters    /////
  /////////////////////////////

  async getChapters(mangaId: string): Promise<Chapter[]> {

    const request = createRequestObject({
      url: `${REAPERSCANS_DOMAIN}/manga/${mangaId}`,
      method,
      headers
    })

    const data = await this.requestManager.schedule(request, 1);
    const $ = this.cheerio.load(data.data);
    
    return await parseReaperScansChapters($, mangaId);
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
    
    return await parseReaperScansChapterDetails($, mangaId, chapterId);
  }


  ///////////////////////////////
  /////    searchRequest    /////
  ///////////////////////////////

  async searchRequest(query: SearchRequest): Promise<PagedResults> {
      
    const search = query.title
    const request = createRequestObject({
        url: `${REAPERSCANS_DOMAIN}/?s=${search}`,
        method : 'GET',
        headers
    })

    const response = await this.requestManager.schedule(request, 1)
    const $ = this.cheerio.load(response.data)
    
    const manga = parseSearch($)

    return createPagedResults({
        results: manga
    })
  }


  /////////////////////////////////////
  /////    getHomePageSections    /////
  /////////////////////////////////////

  async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
      
      const section1 = createHomeSection({ id: 'hot_manga', title: 'HOT' })

      const section2 = createHomeSection({ id: 'popular_today', title: 'Populaire : Aujourd\'hui' })
      const section3 = createHomeSection({ id: 'popular_week', title: 'Populaire : Semaine' })
      const section4 = createHomeSection({ id: 'popular_month', title: 'Populaire : Mois' })
      const section5 = createHomeSection({ id: 'popular_all_times', title: 'Populaire : Tous' })
  
      const section6 = createHomeSection({ id: 'latest_projects', title: 'Derniers Projets', view_more: true })
      const section7 = createHomeSection({ id: 'latest_updated', title: 'Dernières Sorties', view_more: true })
  
      const section8 = createHomeSection({ id: 'new_projects', title: 'Nouvelles Séries' })

      // Fill the homsections with data
      const request1 = createRequestObject({
          url: `${REAPERSCANS_DOMAIN}`,
          method,
          headers
      })

      const response1 = await this.requestManager.schedule(request1, 1)
      const $1 = this.cheerio.load(response1.data)
      
      parseHomeSections($1, [section1, section2, section3, section4, section5, section6, section7, section8], sectionCallback)
  }
    

  //////////////////////////////////
  /////    getViewMoreItems    /////
  //////////////////////////////////

  async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults | null> {
    
    let page: number = metadata?.page ?? 1
    let param = ''
    switch (homepageSectionId) {
      case 'latest_projects':
        param = `projets/page/${page}`
        break;
      case 'latest_updated':
        param = `manga/?order=update&page=${page}`
        break;
      default:
        return Promise.resolve(null)
    }

    const request = createRequestObject({
      url: `${REAPERSCANS_DOMAIN}/${param}`,
      method,
      headers
    })

    const response = await this.requestManager.schedule(request, 1)
    const $ = this.cheerio.load(response.data)
    const manga = parseViewMore($)
    metadata = !isLastPage($, homepageSectionId) ? { page: (page + 1) } : undefined

    return createPagedResults({
      results: manga,
      metadata
    })
  }


  /////////////////////////
  /////    getTags    /////
  /////////////////////////

  async getTags(): Promise<TagSection[] | null> {
    const request = createRequestObject({
      url: `${REAPERSCANS_DOMAIN}/manga`,
      method,
      headers
    })

    const response = await this.requestManager.schedule(request, 1)
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
        url: `${REAPERSCANS_DOMAIN}`,
        method: 'GET'
    }) 
  }

}