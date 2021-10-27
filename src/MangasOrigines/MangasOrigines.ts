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
  parseHomeSections,
  parseMangasOriginesDetails,
  parseMangasOriginesChapters,
  parseMangasOriginesChapterDetails,
  parseViewMore,
  isLastPage,
  parseTags
} from "./MangasOriginesParser";

const MANGASORIGINES_DOMAIN = "https://mangas-origines.fr";
const method = 'GET'
const headers = {
  'Host': 'mangas-origines.fr'
}

export const MangasOriginesInfo: SourceInfo = {
  version: '1.0.0',
  name: 'MangasOrigines',
  icon: 'logo.png',
  author: 'Moomooo',
  authorWebsite: '',
  description: 'Source française MangasOrigines',
  hentaiSource: false,
  websiteBaseURL: MANGASORIGINES_DOMAIN,
  sourceTags: [
    {
      text: "Francais",
      type: TagType.GREY
    }
  ]
}

export class MangasOrigines extends Source {

    /////////////////////////////////
    /////    MANGA SHARE URL    /////
    /////////////////////////////////

    getMangaShareUrl(mangaId: string): string | null {
      return `${MANGASORIGINES_DOMAIN}/manga/${mangaId}`
    }


    ///////////////////////////////
    /////    MANGA DETAILS    /////
    ///////////////////////////////

    async getMangaDetails(mangaId: string): Promise<Manga> {
        
      const request = createRequestObject({
          url: `${MANGASORIGINES_DOMAIN}/manga/${mangaId}`,
          method,
          headers
      })

      const data = await this.requestManager.schedule(request, 1);
      const $ = this.cheerio.load(data.data);
      
      return await parseMangasOriginesDetails($, mangaId);
    }


    //////////////////////////
    /////    CHAPTERS    /////
    //////////////////////////

    async getChapters(mangaId: string): Promise<Chapter[]> {

      const request = createRequestObject({
        url: `${MANGASORIGINES_DOMAIN}/manga/${mangaId}/ajax/chapters/`,
        method: 'POST',
        headers
      })

      const data = await this.requestManager.schedule(request, 1);
      const $ = this.cheerio.load(data.data);
      
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

      const data = await this.requestManager.schedule(request, 1);
      const $ = this.cheerio.load(data.data);
      
      return await parseMangasOriginesChapterDetails($, mangaId, chapterId);
    }


    //////////////////////////////////
    /////    SEARCH REQUEST    /////
    //////////////////////////////////

    searchRequest(query: SearchRequest, metadata: any): Promise<PagedResults> {
        throw new Error("Method not implemented.");
    }


    //////////////////////////////
    /////    HOME SECTION    /////
    //////////////////////////////

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        
        const section1 = createHomeSection({ id: 'hot_manga', title: '🔥 HOT 🔥' })
        const section2 = createHomeSection({ id: 'popular_today', title: 'TOP DU JOUR', view_more: true })
        const section3 = createHomeSection({ id: 'latest_updated', title: 'Dernières Mise à jour', view_more: true })
        const section4 = createHomeSection({ id: 'novelty', title: 'Nouveautés' })

        // Fill the homsections with data
        const request1 = createRequestObject({
            url: `${MANGASORIGINES_DOMAIN}`,
            method,
            headers
        })

        const response1 = await this.requestManager.schedule(request1, 1)
        const $1 = this.cheerio.load(response1.data)
        
        parseHomeSections($1, [section1, section2, section3, section4], sectionCallback)
    }

    /////////////////////////////////
    /////    VIEW MORE ITEMS    /////
    /////////////////////////////////

    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults | null> {
      
      let page: number = metadata?.page ?? 1
      let param = ''
      switch (homepageSectionId) {
        case 'popular_today':
          param = `manga/?m_orderby=trending&page=${page}`
          break;
        case 'latest_updated':
          param = `manga/?m_orderby=latest&page=${page}`
          break;
        default:
          return Promise.resolve(null)
      }

      const request = createRequestObject({
        url: `${MANGASORIGINES_DOMAIN}/${param}`,
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

    
    //////////////////////
    /////    TAGS    /////
    //////////////////////

    async getTags(): Promise<TagSection[] | null> {
      const request = createRequestObject({
        url: `${MANGASORIGINES_DOMAIN}`,
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
            url: `${MANGASORIGINES_DOMAIN}`,
            method: 'GET'
        }) 
    }

}