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
    TagType,
    ContentRating,
    RequestManager,
    MangaUpdates,
    MangaTile,
    HomeSectionType
} from "paperback-extensions-common"

import {
    isLastPage,
    parseDate,
    parseHomeSections,
    parsePatatescansChapterDetails,
    parsePatatescansChapters,
    parsePatatescansDetails,
    parseSearch,
    parseTags,
    parseViewMore
} from "../Patatescans/PatatescansParser";

const PATATESCANS_DOMAIN = "https://patatescans.com";
const method = 'GET'
const headers = {
    'Host': 'patatescans.com'
}

export const PatatescansInfo: SourceInfo = {
    version: '1.0',
    name: 'Patatescans',
    icon: 'logo.png',
    author: 'Moomooo95',
    authorWebsite: 'https://github.com/Moomooo95',
    description: 'Source française Patatescans',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: PATATESCANS_DOMAIN,
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

export class Patatescans extends Source {

    requestManager: RequestManager = createRequestManager({
        requestsPerSecond: 3
    });


    /////////////////////////////////
    /////    MANGA SHARE URL    /////
    /////////////////////////////////

    getMangaShareUrl(mangaId: string): string {
        return `${PATATESCANS_DOMAIN}/manga/${mangaId}`
    }


    ///////////////////////////////
    /////    MANGA DETAILS    /////
    ///////////////////////////////

    async getMangaDetails(mangaId: string): Promise<Manga> {
        const request = createRequestObject({
            url: `${PATATESCANS_DOMAIN}/manga/${mangaId}`,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data);

        return await parsePatatescansDetails($, mangaId);
    }


    //////////////////////////
    /////    CHAPTERS    /////
    //////////////////////////

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const request = createRequestObject({
            url: `${PATATESCANS_DOMAIN}/manga/${mangaId}`,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data);

        return await parsePatatescansChapters($, mangaId);
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

        return await parsePatatescansChapterDetails($, mangaId, chapterId);
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
                url: `${PATATESCANS_DOMAIN}/manga/?page=${page}&genre%5B0%5D=${query.includedTags[0].id}`,
                method,
                headers
            })

            const response = await this.requestManager.schedule(request, 1)
            const $ = this.cheerio.load(response.data)

            manga = parseSearch($)
            metadata = !isLastPage($, 'search_tags') ? { page: page + 1 } : undefined
        }
        else {
            const request = createRequestObject({
                url: `${PATATESCANS_DOMAIN}/page/${page}/?s=${search}`,
                method,
                headers
            })

            const response = await this.requestManager.schedule(request, 1)
            const $ = this.cheerio.load(response.data)

            manga = parseSearch($)
            metadata = !isLastPage($, 'search') ? { page: page + 1 } : undefined
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
        const section1 = createHomeSection({ id: 'hot_manga', title: 'HOT', type: HomeSectionType.featured })
        const section2 = createHomeSection({ id: 'popular_manga', title: 'Populaire' })
        const section3 = createHomeSection({ id: 'latest_updated', title: 'Dernières Sorties', view_more: true })

        const request = createRequestObject({
            url: `${PATATESCANS_DOMAIN}`,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 1)
        const $1 = this.cheerio.load(response.data)

        parseHomeSections($1, [section1, section2, section3], sectionCallback)
    }


    /////////////////////////////////
    /////    VIEW MORE ITEMS    /////
    /////////////////////////////////

    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        let page: number = metadata?.page ?? 1
        let param = ''

        switch (homepageSectionId) {
            case 'latest_projects':
                param = `projets/page/${page}`
                break;
            case 'latest_updated':
                param = `manga/?page=${page}&order=update`
                break;
        }

        const request = createRequestObject({
            url: `${PATATESCANS_DOMAIN}/${param}`,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)

        const manga = parseViewMore($)
        metadata = !isLastPage($, homepageSectionId) ? { page: page + 1 } : undefined

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
            url: `${PATATESCANS_DOMAIN}`,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)

        const updatedManga: string[] = []
        for (const manga of $('.postbody .listupd').eq(1).find('.utao.styletwo').toArray()) {
            let id = $('a', manga).first().attr('href')
            let mangaDate = parseDate(($('.luf span', manga).text() ?? '').trim().split('Il y a ')[1])

            if (!id) continue
            if (mangaDate > time) {
                if (ids.includes(id)) {
                    updatedManga.push(id)
                }
            }
        }

        mangaUpdatesFoundCallback(createMangaUpdates({ ids: updatedManga }))
    }

    //////////////////////
    /////    TAGS    /////
    //////////////////////

    async getTags(): Promise<TagSection[]> {
        const request = createRequestObject({
            url: `${PATATESCANS_DOMAIN}/manga`,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)

        return parseTags($)
    }
}