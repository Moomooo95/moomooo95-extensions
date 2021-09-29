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
    parseLeCercleDuScanChapterDetails,
    parseLeCercleDuScanChapters,
    parseLeCercleDuScanMangaDetails,
    parseSearch,
    parseHomeSections,
    parseMangaSectionTiles,
    parseViewMore,
    isLastPage
} from "./LeCercleDuScanParser";

const LECERCLEDUSCAN_DOMAIN = "https://lel.lecercleduscan.com";
const method = 'GET'
const headers = {
    'Host': 'lel.lecercleduscan.com',
}
const headers_search = {
    "Host": "lel.lecercleduscan.com",
    "Content-Type": "application/x-www-form-urlencoded",
    "Content-Length": "11",
}

export const LeCercleDuScanInfo: SourceInfo = {
version: '1.0.0',
name: 'Le Cercle du Scan',
icon: 'logo.png',
author: 'Moomooo',
authorWebsite: '',
description: 'Source française Le Cercle du Scan',
hentaiSource: false,
websiteBaseURL: LECERCLEDUSCAN_DOMAIN,
sourceTags: [
    {
    text: "Francais",
    type: TagType.GREEN
    }
]
}

export class LeCercleDuScan extends Source {


    //////////////////////////////////
    /////    getMangaShareUrl    /////
    //////////////////////////////////

    getMangaShareUrl(mangaId: string): string | null {
        return `${LECERCLEDUSCAN_DOMAIN}/series/${mangaId}`
    }


    /////////////////////////////////
    /////    getMangaDetails    /////
    /////////////////////////////////

    async getMangaDetails(mangaId: string): Promise<Manga> {
        
        const request = createRequestObject({
            url: `${LECERCLEDUSCAN_DOMAIN}/series/${mangaId}`,
            method,
            headers
        })

        const data = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(data.data);
        
        return await parseLeCercleDuScanMangaDetails($, mangaId);
    }


    /////////////////////////////
    /////    getChapters    /////
    /////////////////////////////

    async getChapters(mangaId: string): Promise<Chapter[]> {

        const request = createRequestObject({
            url: `${LECERCLEDUSCAN_DOMAIN}/series/${mangaId}`,
            method,
            headers
        })

        const data = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(data.data);
        
        return await parseLeCercleDuScanChapters($, mangaId);
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
        
        return await parseLeCercleDuScanChapterDetails($, mangaId, chapterId);
    }


    ///////////////////////////////
    /////    searchRequest    /////
    ///////////////////////////////

    async searchRequest(query: SearchRequest): Promise<PagedResults> {
        
        const search = generateSearch(query)
        const request = createRequestObject({
            url: `${LECERCLEDUSCAN_DOMAIN}/search`,
            method : 'POST',
            headers : headers_search,
            data: `search=${search}`
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
        // Give Paperback a skeleton of what these home sections should look like to pre-render them
        const section1 = createHomeSection({ id: 'latest_updates', title: 'Dernier Manga Sorti', view_more: true })
        const section2 = createHomeSection({ id: 'all_manga', title: 'Tous les mangas', view_more: true  })

        // Fill the homsections with data
        const request1 = createRequestObject({
            url: `${LECERCLEDUSCAN_DOMAIN}/latest`,
            method: 'GET',
            headers
        })

        const request2 = createRequestObject({
            url: `${LECERCLEDUSCAN_DOMAIN}/directory`,
            method: 'GET',
            headers
        })

        const response1 = await this.requestManager.schedule(request1, 1)
        const $1 = this.cheerio.load(response1.data)

        const response2 = await this.requestManager.schedule(request2, 1)
        const $2 = this.cheerio.load(response2.data)
        
        parseHomeSections($1, [section1], sectionCallback)
        parseMangaSectionTiles($2, [section2], sectionCallback)
    }





    //////////////////////////////////
    /////    getViewMoreItems    /////
    //////////////////////////////////
    
    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults | null> {

        let page: number = metadata?.page ?? 1
        let param = ''
        switch (homepageSectionId) {
            case 'latest_updates':
                param = `/latest/${page}`
                break;
            case 'all_manga':
                param = `/directory/${page}`
                break;
            default:
                return Promise.resolve(null)
        }

        const request = createRequestObject({
            url: `${LECERCLEDUSCAN_DOMAIN}/${param}`,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)

        const manga = parseViewMore($, homepageSectionId)
        metadata = !isLastPage($) ? { page: (page + 1) } : undefined

        return createPagedResults({
            results: manga,
            metadata
        })
  }

}