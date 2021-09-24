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
import { parseHomeSections } from "../ReaperScans/ReaperScansParser";

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
      type: TagType.GREEN
    }
  ]
}

export class ReaperScans extends Source {
    getMangaDetails(mangaId: string): Promise<Manga> {
        throw new Error("Method not implemented.");
    }
    getChapters(mangaId: string): Promise<Chapter[]> {
        throw new Error("Method not implemented.");
    }
    getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        throw new Error("Method not implemented.");
    }
    searchRequest(query: SearchRequest, metadata: any): Promise<PagedResults> {
        throw new Error("Method not implemented.");
    }


    /////////////////////////////////////
    /////    getHomePageSections    /////
    /////////////////////////////////////

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        
        const section1 = createHomeSection({ id: 'hot_manga', title: 'HOT' })

        const section2 = createHomeSection({ id: 'popular_today', title: 'Populaire : Aujourd\'hui', view_more: true  })
        const section3 = createHomeSection({ id: 'popular_week', title: 'Populaire : Semaine', view_more: true  })
        const section4 = createHomeSection({ id: 'popular_month', title: 'Populaire : Mois', view_more: true  })
        const section5 = createHomeSection({ id: 'popular_all_times', title: 'Populaire : Tous', view_more: true  })
    
        const section6 = createHomeSection({ id: 'latest_projects', title: 'Derniers Projets', view_more: true })
        const section7 = createHomeSection({ id: 'latest_updated', title: 'Dernières Sorties', view_more: true })
    
        const section8 = createHomeSection({ id: 'new_projects', title: 'Nouvelles Séries', view_more: true })

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

}