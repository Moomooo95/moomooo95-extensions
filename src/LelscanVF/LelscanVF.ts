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
    RequestManager,
    ContentRating,
    MangaTile,
    Request,
    Response,
    SearchField
} from "paperback-extensions-common"

import {
    isLastPage,
    parseHomeSections,
    parseLelscanVFChapterDetails,
    parseLelscanVFChapters,
    parseLelscanVFMangaDetails,
    parseMangaSectionOthers,
    parseSearch,
    parseTags,
    parseUpdatedManga,
    UpdatedManga
} from "./LelscanVFParser";

const LELSCANVF_DOMAIN = "https://lelscanvf.com";
const method = 'GET'
const headers = {
    'Host': 'www.lelscanvf.com',
}

export const LelscanVFInfo: SourceInfo = {
    version: '1.0.0',
    name: 'LelscanVF',
    icon: 'logo.png',
    author: 'Moomooo95',
    authorWebsite: 'https://github.com/Moomooo95',
    description: 'Source française LELSCANVF',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: LELSCANVF_DOMAIN,
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

export class LelscanVF extends Source {

    requestManager: RequestManager = createRequestManager({
        requestsPerSecond: 3,
        interceptor: {
            interceptRequest: async (request: Request): Promise<Request> => {
                request.headers = {
                    'Referer': LELSCANVF_DOMAIN
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
        return `${LELSCANVF_DOMAIN}/manga/${mangaId}`
    }


    ///////////////////////////////
    /////    MANGA DETAILS    /////
    ///////////////////////////////

    async getMangaDetails(mangaId: string): Promise<Manga> {
        const request = createRequestObject({
            url: `${LELSCANVF_DOMAIN}/manga/${mangaId}`,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data);

        return await parseLelscanVFMangaDetails($, mangaId);
    }


    //////////////////////////
    /////    CHAPTERS    /////
    //////////////////////////

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const request = createRequestObject({
            url: `${LELSCANVF_DOMAIN}/manga/${mangaId}`,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data);

        return await parseLelscanVFChapters($, mangaId);
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

        return await parseLelscanVFChapterDetails($, mangaId, chapterId);
    }


    ////////////////////////////////
    /////    SEARCH REQUEST    /////
    ////////////////////////////////

    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const page: number = metadata?.page ?? 1
        const search = query.title?.replace(/ /g, '+').replace(/[’'´]/g, '%27') ?? ""
        let manga: MangaTile[] = []

        let url = `${LELSCANVF_DOMAIN}/filterList?sortBy=name&asc=true&alpha=${search}&page=${page}`

        if (query.includedTags && query.includedTags?.length != 0) {
            url += `&tag=${query.includedTags[0].id}`
        }

        const request = createRequestObject({
            url,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)

        manga = parseSearch($)
        metadata = !isLastPage($) ? { page: page + 1 } : undefined

        return createPagedResults({
            results: manga,
            metadata
        })
    }


    ////////////////////////////// 
    /////    HOME SECTION    /////
    //////////////////////////////

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const section1 = createHomeSection({ id: 'latest_updates', title: 'Dernier Manga Sorti' })
        const section2 = createHomeSection({ id: 'popular_manga', title: 'Manga Populaire' })
        const section3 = createHomeSection({ id: 'top_manga', title: 'Top Manga' })

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
        parseMangaSectionOthers($2, [section3], sectionCallback)
    }

    //////////////////////
    /////    TAGS    /////
    //////////////////////

    async getTags(): Promise<TagSection[]> {
        const request = createRequestObject({
            url: `${LELSCANVF_DOMAIN}/manga-list`,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)

        return parseTags($)
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
                url: `${LELSCANVF_DOMAIN}`,
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