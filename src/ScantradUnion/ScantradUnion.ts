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
    RequestManager,
    TagSection
} from "paperback-extensions-common"

import {
    parseScantradUnionChapterDetails,
    parseScantradUnionChapters,
    parseScantradUnionMangaDetails,
    parseSearch,
    parseHomeSections,
    parseTags,
    isLastPage,
    UpdatedManga,
    parseUpdatedManga
} from "./ScantradUnionParser";

const SCANTRADUNION_DOMAIN = "https://scantrad-union.com";
const method = 'GET'
const headers = {
    'Host': 'scantrad-union.com'
}

export const ScantradUnionInfo: SourceInfo = {
    version: '1.2.0',
    name: 'Scantrad Union',
    icon: 'logo.png',
    author: 'Moomooo95',
    authorWebsite: 'https://github.com/Moomooo95',
    description: 'Source française Scantrad Union',
    contentRating: ContentRating.ADULT,
    websiteBaseURL: SCANTRADUNION_DOMAIN,
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

export class ScantradUnion extends Source {

    requestManager: RequestManager = createRequestManager({
        requestsPerSecond: 3
    });

    /////////////////////////////////
    /////    MANGA SHARE URL    /////
    /////////////////////////////////

    getMangaShareUrl(mangaId: string): string {
        return `${SCANTRADUNION_DOMAIN}/manga/${mangaId}`
    }


    ///////////////////////////////
    /////    MANGA DETAILS    /////
    ///////////////////////////////

    async getMangaDetails(mangaId: string): Promise<Manga> {
        const request = createRequestObject({
            url: `${SCANTRADUNION_DOMAIN}/manga/${mangaId}`,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data);

        return await parseScantradUnionMangaDetails($, mangaId);
    }


    //////////////////////////
    /////    CHAPTERS    /////
    //////////////////////////

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const request = createRequestObject({
            url: `${SCANTRADUNION_DOMAIN}/manga/${mangaId}`,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data);

        return await parseScantradUnionChapters($, mangaId);
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

        return await parseScantradUnionChapterDetails($, mangaId, chapterId);
    }


    ////////////////////////////////
    /////    SEARCH REQUEST    /////
    ////////////////////////////////

    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const page: number = metadata?.page ?? 1
        const search = query.title?.replace(/ /g, '+').replace(/[’'´]/g, '%27') ?? ''

        let param = "current_page_id=9387&qtranslate_lang=0&asp_gen%5B%5D=title&customset%5B%5D=manga"

        if (query.includedTags && query.includedTags?.length != 0) {
            for (let tag of query.includedTags) {

                if (tag.id.includes('Teams')) {
                    param += `&termset%5Bteam%5D%5B%5D=${tag.id.split('-')[0]}`
                } else {
                    param += `&post_tag_set%5B%5D=${tag.id}`
                }
            }
        }

        let url = `${SCANTRADUNION_DOMAIN}/page/${page}/?s=${search}&asp_active=1&p_asid=1&p_asp_data=${Buffer.from(param, 'binary').toString('base64')}`

        const request = createRequestObject({
            url,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)

        return createPagedResults({
            results: parseSearch($),
            metadata: !isLastPage($) ? { page: page + 1 } : undefined
        })
    }


    //////////////////////////////
    /////    HOME SECTION    /////
    //////////////////////////////

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const section1 = createHomeSection({ id: 'latest_updates', title: 'Dernières Sorties' })
        const section2 = createHomeSection({ id: 'series_forward', title: 'Séries en Avant' })

        const request1 = createRequestObject({
            url: `${SCANTRADUNION_DOMAIN}`,
            method,
            headers
        })

        const response1 = await this.requestManager.schedule(request1, 1)
        const $1 = this.cheerio.load(response1.data)

        parseHomeSections($1, [section1, section2], sectionCallback)
    }

    //////////////////////
    /////    TAGS    /////
    //////////////////////

    async getSearchTags(): Promise<TagSection[]> {
        const request = createRequestObject({
            url: `${SCANTRADUNION_DOMAIN}`,
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
                url: `${SCANTRADUNION_DOMAIN}`,
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