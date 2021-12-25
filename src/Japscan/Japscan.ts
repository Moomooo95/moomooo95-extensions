import {
    Source,
    Manga,
    Chapter,
    ChapterDetails,
    HomeSection,
    SearchRequest,
    PagedResults,
    SourceInfo,
    MangaUpdates,
    TagType,
    ContentRating,
    RequestManager
} from "paperback-extensions-common"

import {
    parseJapscanChapterDetails,
    parseJapscanChapters,
    parseJapscanMangaDetails,
    parseSearch,
    parseHomeSections,
    parseViewMore,
    parseDate
} from "./JapscanParser";

const JAPSCAN_DOMAIN = "https://www.japscan.ws";
const method = 'GET'
const headers = {
    "Host": "www.japscan.ws",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"
}

const headers_search = {
    "Host": "www.japscan.ws",
    "Content-Type": "application/x-www-form-urlencoded",
    "Content-Length": "11",
    "X-Requested-With": "XMLHttpRequest",
}

export const JapscanInfo: SourceInfo = {
    version: '1.0',
    name: 'Japscan',
    icon: 'logo.png',
    author: 'Moomooo95',
    authorWebsite: 'https://github.com/Moomooo95',
    description: 'Source française Japscan',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: JAPSCAN_DOMAIN,
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

export class Japscan extends Source {
    requestManager: RequestManager = createRequestManager({
        requestsPerSecond: 3
    });

    /////////////////////////////////
    /////    MANGA SHARE URL    /////
    /////////////////////////////////

    getMangaShareUrl(mangaId: string): string {
        return `${JAPSCAN_DOMAIN}/manga/${mangaId}`
    }


    ///////////////////////////////
    /////    MANGA DETAILS    /////
    ///////////////////////////////

    async getMangaDetails(mangaId: string): Promise<Manga> {
        const request = createRequestObject({
            url: `${JAPSCAN_DOMAIN}/manga/${mangaId}/`,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data);
        
        return await parseJapscanMangaDetails($, mangaId);
    }


    //////////////////////////
    /////    CHAPTERS    /////
    //////////////////////////

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const request = createRequestObject({
            url: `${JAPSCAN_DOMAIN}/manga/${mangaId}/`,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data);
        
        return await parseJapscanChapters($, mangaId);
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
        
        return await parseJapscanChapterDetails($, mangaId, chapterId);
    }


    ////////////////////////////////
    /////    SEARCH REQUEST    /////
    ////////////////////////////////

    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const search = query.title
        const request = createRequestObject({
            url: `${JAPSCAN_DOMAIN}/live-search/`,
            method : 'POST',
            headers: headers_search,
            data: `search=${search}`
        })

        const response = await this.requestManager.schedule(request, 1)        
        const manga = parseSearch(response.data)

        return createPagedResults({
            results: manga
        })    
    }


    //////////////////////////////
    /////    HOME SECTION    /////
    //////////////////////////////

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const section1 = createHomeSection({ id: 'latest_updates', title: 'Dernier Manga Sorti', view_more: true })
        const section2 = createHomeSection({ id: 'top_mangas_today', title: 'TOP MANGAS 24H' })
        const section3 = createHomeSection({ id: 'top_mangas_week', title: 'TOP MANGAS Semaine' })
        const section4 = createHomeSection({ id: 'top_mangas_all_time', title: 'TOP MANGAS 2021' })

        const request = createRequestObject({
            url: `${JAPSCAN_DOMAIN}/`,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)
        
        parseHomeSections($, [section1, section2, section3, section4], sectionCallback)
    }

    /////////////////////////////////
    /////    VIEW MORE ITEMS    /////
    /////////////////////////////////
    
    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        let page: number = metadata?.page ?? 1
        
        const request = createRequestObject({
            url: `${JAPSCAN_DOMAIN}`,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)

        const manga = parseViewMore($, page)
        metadata = !(page==8) ? { page: page + 1 } : undefined

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
            url: `${JAPSCAN_DOMAIN}`,
            method,
            headers
        })
  
        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)
  
        const updatedManga: string[] = []
        for (const manga of $('#tab-1 h3').toArray()) {
            let id = "https://www.japscan.ws" + $('a', manga).attr('href')
            let mangaDate = new Date()

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