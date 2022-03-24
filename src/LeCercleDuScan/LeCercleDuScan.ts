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
    parseLeCercleDuScanChapterDetails,
    parseLeCercleDuScanChapters,
    parseLeCercleDuScanMangaDetails,
    parseSearch,
    parseHomeSections,
    parseMangaSectionOthers,
    parseViewMore,
    isLastPage,
    UpdatedManga,
    parseUpdatedManga
} from "./LeCercleDuScanParser";

const LECERCLEDUSCAN_DOMAIN = "https://lel.lecercleduscan.com";
const method = 'POST'
const headers = {
    'Host': 'lel.lecercleduscan.com',
}
const headers_search = {
    "Host": "lel.lecercleduscan.com",
    "Content-Type": "application/x-www-form-urlencoded",
    "Content-Length": "11",
}

export const LeCercleDuScanInfo: SourceInfo = {
    version: '1.3',
    name: 'Le Cercle du Scan',
    icon: 'logo.png',
    author: 'Moomooo95',
    authorWebsite: 'https://github.com/Moomooo95',
    description: 'Source française Le Cercle du Scan',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: LECERCLEDUSCAN_DOMAIN,
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

export class LeCercleDuScan extends Source {
    requestManager: RequestManager = createRequestManager({
        requestsPerSecond: 3
    });

    /////////////////////////////////
    /////    MANGA SHARE URL    /////
    /////////////////////////////////

    getMangaShareUrl(mangaId: string): string {
        return `${LECERCLEDUSCAN_DOMAIN}/series/${mangaId}`
    }


    ///////////////////////////////
    /////    MANGA DETAILS    /////
    ///////////////////////////////

    async getMangaDetails(mangaId: string): Promise<Manga> {
        const request = createRequestObject({
            url: `${LECERCLEDUSCAN_DOMAIN}/series/${mangaId}`,
            method,
            headers,
            data: "adult=true"
        })

        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data);

        return await parseLeCercleDuScanMangaDetails($, mangaId);
    }


    //////////////////////////
    /////    CHAPTERS    /////
    //////////////////////////

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const request = createRequestObject({
            url: `${LECERCLEDUSCAN_DOMAIN}/series/${mangaId}`,
            method,
            headers,
            data: "adult=true"
        })

        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data);

        return await parseLeCercleDuScanChapters($, mangaId);
    }


    //////////////////////////////////
    /////    CHAPTERS DETAILS    /////
    //////////////////////////////////

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const request = createRequestObject({
            url: `${chapterId}`,
            method,
            headers,
            data: "adult=true"
        })

        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data);

        return await parseLeCercleDuScanChapterDetails($, mangaId, chapterId);
    }


    ////////////////////////////////
    /////    SEARCH REQUEST    /////
    ////////////////////////////////

    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const search = query.title?.replace(/ /g, '+').replace(/[’'´]/g, '%27')
        const request = createRequestObject({
            url: `${LECERCLEDUSCAN_DOMAIN}/search`,
            method: 'POST',
            headers: headers_search,
            data: `search=${search}`
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)

        const manga = parseSearch($)

        return createPagedResults({
            results: manga
        })
    }


    //////////////////////////////
    /////    HOME SECTION    /////
    //////////////////////////////

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const section1 = createHomeSection({ id: 'latest_updates', title: 'Dernier Manga Sorti', view_more: true })
        const section2 = createHomeSection({ id: 'all_manga', title: 'Tous les mangas', view_more: true })

        const request1 = createRequestObject({
            url: `${LECERCLEDUSCAN_DOMAIN}/latest`,
            method: 'GET',
            headers
        })

        const response1 = await this.requestManager.schedule(request1, 1)
        const $1 = this.cheerio.load(response1.data)

        const request2 = createRequestObject({
            url: `${LECERCLEDUSCAN_DOMAIN}/directory`,
            method: 'GET',
            headers
        })

        const response2 = await this.requestManager.schedule(request2, 1)
        const $2 = this.cheerio.load(response2.data)

        parseHomeSections($1, [section1], sectionCallback)
        parseMangaSectionOthers($2, [section2], sectionCallback)
    }

    /////////////////////////////////
    /////    VIEW MORE ITEMS    /////
    /////////////////////////////////

    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        let page: number = metadata?.page ?? 1
        let param = ''

        switch (homepageSectionId) {
            case 'latest_updates':
                param = `latest/${page}`
                break;
            case 'all_manga':
                param = `directory/${page}`
                break;
        }

        const request = createRequestObject({
            url: `${LECERCLEDUSCAN_DOMAIN}/${param}`,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)

        const manga = parseViewMore($, homepageSectionId)
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
        let page = 1
        let updatedManga: UpdatedManga = {
            ids: [],
            loadMore: true
        }

        while (updatedManga.loadMore) {
            const request = createRequestObject({
                url: `${LECERCLEDUSCAN_DOMAIN}/latest/${page++}`,
                method,
                headers
            })

            const response = await this.requestManager.schedule(request, 1)
            const $ = this.cheerio.load(response.data)

            updatedManga = parseUpdatedManga($, time, ids)
            if (updatedManga.ids.length > 0) {
                mangaUpdatesFoundCallback(createMangaUpdates({
                    ids: updatedManga.ids
                }));
            }
        }
    }
}