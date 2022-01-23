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
    parsePerfScantradChapterDetails,
    parsePerfScantradChapters,
    parsePerfScantradMangaDetails,
    parseHomeSections,
    UpdatedManga,
    parseUpdatedManga
} from "./PerfScantradParser";

const PERFSCANTRAD_DOMAIN = "https://perf-scantrad.fr";
const method = 'GET'
const headers = {
    'Host': 'perf-scantrad.fr',
    'Referer': 'https://perf-scantrad.fr'
}

export const PerfScantradInfo: SourceInfo = {
    version: '1.1',
    name: 'Perf Scantrad',
    icon: 'logo.png',
    author: 'Moomooo95',
    authorWebsite: 'https://github.com/Moomooo95',
    description: 'Source française Perf Scantrad',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: PERFSCANTRAD_DOMAIN,
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

export class PerfScantrad extends Source {

    requestManager: RequestManager = createRequestManager({
        requestsPerSecond: 3,
        interceptor: {
            interceptRequest: async (request: Request): Promise<Request> => {
                request.headers = {
                    'Referer': 'https://perf-scantrad.fr'
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
        return `${PERFSCANTRAD_DOMAIN}/serie/${mangaId}`
    }


    ///////////////////////////////
    /////    MANGA DETAILS    /////
    ///////////////////////////////

    async getMangaDetails(mangaId: string): Promise<Manga> {
        const request = createRequestObject({
            url: `${PERFSCANTRAD_DOMAIN}/serie/${mangaId}`,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data);

        return await parsePerfScantradMangaDetails($, mangaId);
    }


    //////////////////////////
    /////    CHAPTERS    /////
    //////////////////////////

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const request = createRequestObject({
            url: `${PERFSCANTRAD_DOMAIN}/serie/${mangaId}`,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data);

        return await parsePerfScantradChapters($, mangaId);
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

        return await parsePerfScantradChapterDetails($, mangaId, chapterId);
    }


    ////////////////////////////////
    /////    SEARCH REQUEST    /////
    ////////////////////////////////

    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        return createPagedResults({
            results: [],
            metadata
        })
    }

    //////////////////////////////
    /////    HOME SECTION    /////
    //////////////////////////////

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const section1 = createHomeSection({ id: 'recommended_mangas', title: 'Recommandé', type: HomeSectionType.featured })
        const section2 = createHomeSection({ id: 'latest_updates', title: 'Dernier Mangas Sorti' })
        const section3 = createHomeSection({ id: 'all_manga', title: 'Tous les mangas' })

        const request = createRequestObject({
            url: `${PERFSCANTRAD_DOMAIN}`,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)

        parseHomeSections($, [section1, section2, section3], sectionCallback)
    }


    //////////////////////////////////////
    /////    FILTER UPDATED MANGA    /////
    //////////////////////////////////////

    async filterUpdatedManga(mangaUpdatesFoundCallback: (updates: MangaUpdates) => void, time: Date, ids: string[]): Promise<void> {
        let updatedManga: UpdatedManga = {
            ids: [],
            loadMore: true
        }

        while (updatedManga.loadMore) {
            const request = createRequestObject({
                url: `${PERFSCANTRAD_DOMAIN}`,
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