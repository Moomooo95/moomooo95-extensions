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
    Request,
    Response,
    RequestManager,
    HomeSectionType
} from "paperback-extensions-common"

import {
    parseScantradChapterDetails,
    parseScantradChapters,
    parseScantradMangaDetails,
    parseSearch,
    parseHomeSections,
    parseMangaSectionOthers,
    parseViewMore,
    isLastPage,
    UpdatedManga,
    parseUpdatedManga
} from "./ScantradParser";

const SCANTRAD_DOMAIN = "https://scantrad.net";
const method = 'POST'
const headers = {
    'Host': 'scantrad.net'
}

export const ScantradInfo: SourceInfo = {
    version: '1.1',
    name: 'Scantrad',
    icon: 'logo.png',
    author: 'Moomooo95',
    authorWebsite: 'https://github.com/Moomooo95',
    description: 'Source française Scantrad',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: SCANTRAD_DOMAIN,
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

export class Scantrad extends Source {
    requestManager: RequestManager = createRequestManager({
        requestsPerSecond: 3,
        interceptor: {
            interceptRequest: async (request: Request): Promise<Request> => {
                request.headers = {
                    'Referer': 'https://scantrad.net/'
                }
                return request
            },
            interceptResponse: async (response: Response): Promise<Response> => {
                return response
            }
        }
    });

    /////////////////////////////////
    /////    MANGA SHARE URL    /////
    /////////////////////////////////

    getMangaShareUrl(mangaId: string): string {
        return `${SCANTRAD_DOMAIN}/${mangaId}`
    }


    ///////////////////////////////
    /////    MANGA DETAILS    /////
    ///////////////////////////////

    async getMangaDetails(mangaId: string): Promise<Manga> {
        const request = createRequestObject({
            url: `${SCANTRAD_DOMAIN}/${mangaId}`,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data);

        return await parseScantradMangaDetails($, mangaId);
    }


    //////////////////////////
    /////    CHAPTERS    /////
    //////////////////////////

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const request = createRequestObject({
            url: `${SCANTRAD_DOMAIN}/${mangaId}`,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data);

        return await parseScantradChapters($, mangaId);
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

        return await parseScantradChapterDetails($, mangaId, chapterId);
    }


    ////////////////////////////////
    /////    SEARCH REQUEST    /////
    ////////////////////////////////

    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const search = query.title?.replace(/ /g, '+').replace(/[’'´]/g, '%27')
        const request = createRequestObject({
            url: `${SCANTRAD_DOMAIN}`,
            method: 'POST',
            headers,
            data: `q=${search}`
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
        const section1 = createHomeSection({ id: 'top_discover', title: 'A découvrir', type: HomeSectionType.featured })
        const section2 = createHomeSection({ id: 'latest_updates', title: 'Dernier Mangas Sorti', view_more: true })
        const section3 = createHomeSection({ id: 'all_manga', title: 'Tous les mangas' })
        //const section4 = createHomeSection({ id: 'upcoming_releases', title: 'Sorties à venir prochainement' })

        // Section 1 and 2
        const request1 = createRequestObject({
            url: `${SCANTRAD_DOMAIN}`,
            method: 'GET',
            headers
        })

        const response1 = await this.requestManager.schedule(request1, 1)
        const $1 = this.cheerio.load(response1.data)

        // Section 3
        const request2 = createRequestObject({
            url: `${SCANTRAD_DOMAIN}/mangas`,
            method: 'GET',
            headers
        })

        const response2 = await this.requestManager.schedule(request2, 1)
        const $2 = this.cheerio.load(response2.data)

        parseHomeSections($1, [section1, section2], sectionCallback)
        parseMangaSectionOthers($2, [section3], sectionCallback)
    }

    /////////////////////////////////
    /////    VIEW MORE ITEMS    /////
    /////////////////////////////////

    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        let page: number = metadata?.page ?? 1
        let param = ''

        switch (homepageSectionId) {
            case 'latest_updates':
                param = `?page=${page}`
                break;
        }

        const request = createRequestObject({
            url: `${SCANTRAD_DOMAIN}/${param}`,
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
                url: `${SCANTRAD_DOMAIN}/?page=${page++}`,
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