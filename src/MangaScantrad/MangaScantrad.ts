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
    MangaTile,
    ContentRating,
    RequestManager,
    HomeSectionType
} from "paperback-extensions-common"

import {
    parseHomeSections,
    parseMangaScantradDetails,
    parseMangaScantradChapters,
    parseMangaScantradChapterDetails,
    parseViewMore,
    isLastPage,
    parseTags,
    parseSearch,
    UpdatedManga,
    parseUpdatedManga
} from "./MangaScantradParser";

const MANGASCANTRAD_DOMAIN = "https://manga-scantrad.net";
const method = 'GET'
const headers = {
    'Host': 'manga-scantrad.net'
}

export const MangaScantradInfo: SourceInfo = {
    version: '1.0.0',
    name: 'MangaScantrad',
    icon: 'logo.png',
    author: 'Moomooo95',
    authorWebsite: 'https://github.com/Moomooo95',
    description: 'Source française MangaScantrad',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: MANGASCANTRAD_DOMAIN,
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

export class MangaScantrad extends Source {

    requestManager: RequestManager = createRequestManager({
        requestsPerSecond: 3
    });


    /////////////////////////////////
    /////    MANGA SHARE URL    /////
    /////////////////////////////////

    getMangaShareUrl(mangaId: string): string {
        return `${MANGASCANTRAD_DOMAIN}/manga/${mangaId}`
    }


    ///////////////////////////////
    /////    MANGA DETAILS    /////
    ///////////////////////////////

    async getMangaDetails(mangaId: string): Promise<Manga> {
        const request = createRequestObject({
            url: `${MANGASCANTRAD_DOMAIN}/manga/${mangaId}`,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data);

        return await parseMangaScantradDetails($, mangaId);
    }


    //////////////////////////
    /////    CHAPTERS    /////
    //////////////////////////

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const request = createRequestObject({
            url: `${MANGASCANTRAD_DOMAIN}/manga/${mangaId}/ajax/chapters/`,
            method: 'POST',
            headers
        })

        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data);

        return await parseMangaScantradChapters($, mangaId);
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

        return await parseMangaScantradChapterDetails($, mangaId, chapterId);
    }


    ////////////////////////////////
    /////    SEARCH REQUEST    /////
    ////////////////////////////////

    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const page: number = metadata?.page ?? 1
        const search = query.title?.replace(/ /g, '+').replace(/[’'´]/g, '%27') ?? ''
        let manga: MangaTile[] = []

        let url = `${MANGASCANTRAD_DOMAIN}/?post_type=wp-manga&s=${search}&paged=${page}`

        if (query.includedTags && query.includedTags?.length != 0) {
            for (let tag of query.includedTags) {
                url += `&genre[]=${tag.id}`
            }
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
        const section1 = createHomeSection({ id: 'latest_updated', title: 'Dernières Sorties', view_more: true })
        const section2 = createHomeSection({ id: 'popular_manga', title: 'Manga Populaire' })
        const section3 = createHomeSection({ id: 'project_partners', title: 'Projets & Partenaires' })

        const request = createRequestObject({
            url: `${MANGASCANTRAD_DOMAIN}`,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)

        parseHomeSections($, [section1, section2, section3], sectionCallback)
    }

    /////////////////////////////////
    /////    VIEW MORE ITEMS    /////
    /////////////////////////////////

    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        let page: number = metadata?.page ?? 1
        let param = ''
        switch (homepageSectionId) {
            case 'latest_updated':
                param = `?s&post_type=wp-manga&m_orderby=latest&paged=${page}`
                break;
        }

        const request = createRequestObject({
            url: `${MANGASCANTRAD_DOMAIN}/${param}`,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)

        const manga = parseViewMore($)
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
                url: `${MANGASCANTRAD_DOMAIN}/?s&post_type=wp-manga&m_orderby=latest&page=${page++}`,
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


    //////////////////////
    /////    TAGS    /////
    //////////////////////

    async getSearchTags(): Promise<TagSection[]> {
        const request = createRequestObject({
            url: `${MANGASCANTRAD_DOMAIN}/?s=&post_type=wp-manga`,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)

        return parseTags($)
    }
}