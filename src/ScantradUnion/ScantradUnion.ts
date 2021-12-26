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
    HomeSectionType,
    MangaTile,
    TagSection
} from "paperback-extensions-common"

import {
    parseScantradUnionChapterDetails,
    parseScantradUnionChapters,
    parseScantradUnionMangaDetails,
    parseSearch,
    parseHomeSections,
    parseDate,
    parseTags,
    isLastPage
} from "./ScantradUnionParser";

const SCANTRADUNION_DOMAIN = "https://scantrad-union.com";
const method = 'GET'
const headers = {
    'Host': 'scantrad-union.com'
}

export const ScantradUnionInfo: SourceInfo = {
    version: '1.0',
    name: 'Scantrad Union',
    icon: 'logo.png',
    author: 'Moomooo95',
    authorWebsite: 'https://github.com/Moomooo95',
    description: 'Source française Scantrad Union',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: SCANTRADUNION_DOMAIN,
    sourceTags: [
        {
            text: "Francais",
            type: TagType.GREY
        },
        {
            text: 'Notifications',
            type: TagType.GREEN
        },
        {
            text: 'Slow',
            type: TagType.YELLOW
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
        let manga: MangaTile[] = []

        if (query.includedTags && query.includedTags?.length != 0) {
            const request = createRequestObject({
                url: `${SCANTRADUNION_DOMAIN}/tag/${query.includedTags[0].id}/page/${page}`,
                method,
                headers
            })

            const response = await this.requestManager.schedule(request, 1)
            const $ = this.cheerio.load(response.data)

            manga = parseSearch($)
            metadata = !isLastPage($) ? { page: page + 1 } : undefined
        }
        else {
            const request = createRequestObject({
                url: `${SCANTRADUNION_DOMAIN}/?s=${search}`,
                method,
                headers
            })

            const response = await this.requestManager.schedule(request, 1)
            const $ = this.cheerio.load(response.data)

            manga = parseSearch($)
            metadata = undefined
        }

        return createPagedResults({
            results: manga,
            metadata
        })
    }


    //////////////////////////////
    /////    HOME SECTION    /////
    //////////////////////////////

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const section1 = createHomeSection({ id: 'series_forward', title: 'Séries en Avant', type: HomeSectionType.featured })
        const section2 = createHomeSection({ id: 'latest_updates', title: 'Dernières sorties' })

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

    async getTags(): Promise<TagSection[]> {
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
        const request = createRequestObject({
            url: `${SCANTRADUNION_DOMAIN}`,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)

        const updatedManga: string[] = []
        for (const manga of $('#dernierschapitres.dernieresmaj .colonne').toArray()) {
            let id = $('.carteinfos a', manga).eq(1).attr('href')
            let mangaDate = parseDate($('.carteinfos .datechapitre', manga).text().trim().split(' ').slice(-2).join(' ')) ?? ''

            if (!id) continue
            if (mangaDate > time) {
                if (ids.includes(id)) {
                    updatedManga.push(id)
                }
            }
        }

        mangaUpdatesFoundCallback(createMangaUpdates({ ids: updatedManga }))
    }
}