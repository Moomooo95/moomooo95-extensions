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
    LanguageCode,
    Request,
    Response
} from "paperback-extensions-common"

import {
    isLastPage,
    parseHomeSections,
    parseJapanreadChapterDetails,
    parseJapanreadMangaDetails,
    parseSearch,
    parseLatestUpdatedManga,
    parseTags,
    parseDate,
    decodeHTMLEntity,
    UpdatedManga,
    parseUpdatedManga
} from "./JapanreadParser";

const JAPANREAD_DOMAIN = "https://www.japanread.cc";
const method = 'GET'
const headers = {
    'Host': 'www.japanread.cc',
}

export const JapanreadInfo: SourceInfo = {
    version: '1.2.1',
    name: 'Japanread',
    icon: 'logo.png',
    author: 'Moomooo95',
    authorWebsite: 'https://github.com/Moomooo95',
    description: 'Source française Japanread',
    contentRating: ContentRating.ADULT,
    websiteBaseURL: JAPANREAD_DOMAIN,
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
          text: 'Cloudflare',
          type: TagType.RED
        }
    ]
}

export class Japanread extends Source {

    requestManager: RequestManager = createRequestManager({
        requestsPerSecond: 3,
        requestTimeout: 100000,
        interceptor: {
            interceptRequest: async (request: Request): Promise<Request> => {
                request.headers = {
                    'Referer': 'https://www.japanread.cc/'
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
        return `${JAPANREAD_DOMAIN}/manga/${mangaId}`
    }


    ///////////////////////////////
    /////    MANGA DETAILS    /////
    ///////////////////////////////

    async getMangaDetails(mangaId: string): Promise<Manga> {
        const request = createRequestObject({
            url: `${JAPANREAD_DOMAIN}/manga/${mangaId}`,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status)
        const $ = this.cheerio.load(response.data);

        return await parseJapanreadMangaDetails($, mangaId);
    }


    //////////////////////////
    /////    CHAPTERS    /////
    //////////////////////////

    async getChapters(mangaId: string): Promise<Chapter[]> {

        let request = createRequestObject({
            url: `${JAPANREAD_DOMAIN}/manga/${mangaId}`,
            method,
            headers
        })

        let response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status)
        let $ = this.cheerio.load(response.data);

        const page_max = Number($('.pagination .page-item .page-link').slice(-2, -1).text())

        const chapters: Chapter[] = []

        if (page_max == 0) {
            for (let chapter of $('#chapters div[data-row=chapter]').toArray()) {
                const id = `https://www.japanread.cc${$('a', chapter).eq(0).attr('href') ?? ''}`
                const name = $('a', chapter).eq(0).children().text().replace(/^ -/, '').trim() != '' ? decodeHTMLEntity($('a', chapter).eq(0).children().text().replace(/^ -/, '').trim()) : undefined
                const chapNum = Number((($('a', chapter).eq(0).attr('href') ?? '').split('/').pop() ?? '').replace(/-/g, '.'))
                const volume = !isNaN(Number(($('a', chapter).eq(0).text().match(/^Vol.(\d) /gm) ?? '.')[0].split('.')[1])) ? Number(($('a', chapter).eq(0).text().match(/^Vol.(\d) /gm) ?? '.')[0].split('.')[1]) : undefined
                const time = parseDate($('a', chapter).eq(0).parent().next().next().clone().children().remove().end().text().trim().replace(/-/g, '.'))

                chapters.push(createChapter({
                    id,
                    mangaId,
                    name,
                    langCode: LanguageCode.FRENCH,
                    chapNum,
                    volume,
                    time
                }))
            }
        }
        else {
            for (var page = 1; page <= page_max; page++) {
                let request = createRequestObject({
                    url: `${JAPANREAD_DOMAIN}/manga/${mangaId}?page=${page}`,
                    method,
                    headers
                })

                let response = await this.requestManager.schedule(request, 1);
                let $ = this.cheerio.load(response.data);

                for (let chapter of $('#chapters div[data-row=chapter]').toArray()) {
                    const id = `https://www.japanread.cc${$('a', chapter).eq(0).attr('href') ?? ''}`
                    const name = $('.manga_title', chapter).text().trim() != '' ? decodeHTMLEntity($('.manga_title', chapter).text().trim()) : undefined
                    const chapNum = Number((($('a', chapter).eq(0).attr('href') ?? '').split('/').pop() ?? '').replace(/-/g, '.'))
                    const volume = !isNaN(Number(($('a', chapter).eq(0).text().match(/^Vol.(\d) /gm) ?? '.')[0].split('.')[1])) ? Number(($('a', chapter).eq(0).text().match(/^Vol.(\d) /gm) ?? '.')[0].split('.')[1]) : undefined
                    const time = parseDate($('a', chapter).eq(0).parent().next().next().clone().children().remove().end().text().trim().replace(/-/g, '.'))

                    chapters.push(createChapter({
                        id,
                        mangaId,
                        name,
                        langCode: LanguageCode.FRENCH,
                        chapNum,
                        volume,
                        time
                    }))
                }
            }
        }

        return await chapters;
    }


    //////////////////////////////////
    /////    CHAPTERS DETAILS    /////
    //////////////////////////////////

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const request0 = createRequestObject({
            url: `${chapterId}`,
            method,
            headers
        })

        const response0 = await this.requestManager.schedule(request0, 1);
        this.CloudFlareError(response0.status)
        const $0 = this.cheerio.load(response0.data);

        const id = $0("meta[data-chapter-id]").attr("data-chapter-id") ?? ''

        const request = createRequestObject({
            url: `${JAPANREAD_DOMAIN}/api/?id=${id}&type=chapter`,
            method,
            headers: {
                'a': '1df19bce590b',
                'Referer': chapterId,
                'x-requested-with': 'XMLHttpRequest'
            }
        })

        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status)

        return await parseJapanreadChapterDetails(response.data, mangaId, chapterId, id);
    }


    ////////////////////////////////
    /////    SEARCH REQUEST    /////
    ////////////////////////////////

    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const page: number = metadata?.page ?? 1
        const search = query.title?.replace(/ /g, '+').replace(/[’'´]/g, '%27') ?? ""
        let manga: MangaTile[] = []

        if (query.includedTags && query.includedTags?.length != 0) {

            const request = createRequestObject({
                url: `${JAPANREAD_DOMAIN}/search?withCategories=${query.includedTags[0].id}&q=${search}&page=${page}`,
                method,
                headers
            })

            const response = await this.requestManager.schedule(request, 1)
            this.CloudFlareError(response.status)
            const $ = this.cheerio.load(response.data)

            manga = parseSearch($)
            metadata = !isLastPage($) ? { page: page + 1 } : undefined
        }
        else {
            const request = createRequestObject({
                url: `${JAPANREAD_DOMAIN}/search?q=${search}&page=${page}`,
                method,
                headers
            })

            const response = await this.requestManager.schedule(request, 1)
            this.CloudFlareError(response.status)
            const $ = this.cheerio.load(response.data)

            manga = parseSearch($)
            metadata = !isLastPage($) ? { page: page + 1 } : undefined
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
        const section1 = createHomeSection({ id: 'latest_updated_manga', title: 'Dernier Manga Sorti', view_more: true })
        const section2 = createHomeSection({ id: 'most_viewed_manga', title: 'Mangas les plus vus' })
        const section3 = createHomeSection({ id: 'top_rated_manga', title: 'Mangas les mieux notés' })
        const section4 = createHomeSection({ id: 'novelty_manga', title: 'Nouveautés' })

        const request = createRequestObject({
            url: `${JAPANREAD_DOMAIN}`,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        this.CloudFlareError(response.status)
        const $ = this.cheerio.load(response.data)

        parseHomeSections($, [section1, section2, section3, section4], sectionCallback)
    }

    /////////////////////////////////
    /////    VIEW MORE ITEMS    /////
    /////////////////////////////////

    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        const page: number = metadata?.page ?? 1
        let param = ''

        switch (homepageSectionId) {
            case 'latest_updated_manga':
                param = `?page=${page}`
                break;
        }

        const request = createRequestObject({
            url: `${JAPANREAD_DOMAIN}/${param}`,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 1)
        this.CloudFlareError(response.status)
        const $ = this.cheerio.load(response.data)

        const manga = parseLatestUpdatedManga($)
        metadata = !isLastPage($) ? { page: page + 1 } : undefined

        return createPagedResults({
            results: manga,
            metadata
        })
    }


    //////////////////////
    /////    TAGS    /////
    //////////////////////

    async getSearchTags(): Promise<TagSection[]> {
        const request = createRequestObject({
            url: `${JAPANREAD_DOMAIN}/manga-list`,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 1)
        this.CloudFlareError(response.status)
        const $ = this.cheerio.load(response.data)

        return parseTags($)
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
                url: `${JAPANREAD_DOMAIN}/?page=${page++}`,
                method,
                headers
            })

            const response = await this.requestManager.schedule(request, 1)
            this.CloudFlareError(response.status)
            const $ = this.cheerio.load(response.data)

            updatedManga = parseUpdatedManga($, time, ids)
            if (updatedManga.ids.length > 0) {
                mangaUpdatesFoundCallback(createMangaUpdates({
                    ids: updatedManga.ids
                }));
            }
        }
    }

    ///////////////////////////////////
    /////    CLOUDFLARE BYPASS    /////
    ///////////////////////////////////

    CloudFlareError(status: any) {
        if (status == 503) {
            throw new Error('CLOUDFLARE BYPASS ERROR:\nVeuillez aller dans les Paramètres > Sources > Japanread et appuyez sur Cloudflare Bypass')
        }
    }

    getCloudflareBypassRequest() {
        return createRequestObject({
            url: `${JAPANREAD_DOMAIN}/manga/reverse-villain`,
            method,
            headers
        })
    }
}