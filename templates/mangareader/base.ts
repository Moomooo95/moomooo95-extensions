import {
    SourceManga,
    Chapter,
    ChapterDetails,
    HomeSection,
    SearchRequest,
    PagedResults,
    TagSection,
    Request,
    Response,
    MangaProviding,
    ChapterProviding,
    SearchResultsProviding,
    HomePageSectionsProviding,
    HomeSectionType,
    CloudflareBypassRequestProviding
} from '@paperback/types'

import { CheerioAPI } from 'cheerio'

import {
    parseMangaDetails,
    parseChapters,
    parseChapterDetails,
    parseSearchResults,
    parseSearchTags,
} from './parser'


export abstract class MangaReader implements MangaProviding, ChapterProviding, SearchResultsProviding, HomePageSectionsProviding, CloudflareBypassRequestProviding {

    abstract base_url: string
    abstract lang_code: string

    source_path: string = "manga"
    date_format: string = "MMMM DD, YYYY"
    date_lang: string = "fr"
    genres_selector: string = ".postbody .mgen > a"
    description_selector: string = ".postbody .entry-content.entry-content-single"
    search_selector: string = ".listupd .bsx"
    chapter_selector: string = "#chapterlist div.eph-num"
    chapter_details_selector: string = "div#readerarea img"
    author_artist_selector: string =  ".postbody .fmed"
    author_manga_selector: string = "Auteur"
    artist_manga_selector: string = "Artiste"
    latest: string = "Dernières Sorties"
    popular: string = "Populaire"
    viewer = ($: CheerioAPI, categories: any): string => {
        let series_type = $(".postbody .tsinfo .imptdt:contains(Type) a").text().trim().toLowerCase()
        let webtoon_tags = ["manhwa", "manhua", "webtoon", "vertical", "korean", "chinese"]
        let rtl_tags = ["manga", "japan"]
        
        if (series_type) {
            for (let tag in webtoon_tags) {
                if (series_type.includes(tag)) {
                    return tag
                }
            }

            for (let tag in rtl_tags) {
                if (series_type.includes(tag)) {
                    return tag
                }
            }
        } else {
            for (let tag in webtoon_tags) {
                if (categories.includes(tag)) {
                    return tag
                }
            }

            for (let tag in rtl_tags) {
                if (categories.includes(tag)) {
                    return tag
                }
            }
        }
        
        return "unknown"
    }
    status = ($: CheerioAPI): string => {
        let status_str = $('.postbody .tsinfo .imptdt:contains(Statu) i').text().trim()
        return (status_str != "") ? status_str : "Inconnu"
    }
    nsfw = ($: CheerioAPI, categories: any): boolean => {
        let nsfw_tags = ["adult", "mature"]
        let suggestive_tags = ["ecchi"]

        for (let tag in nsfw_tags) {
            if (categories.includes(tag)) {
                return true
            }
        }

        for (let tag in suggestive_tags) {
            if (categories.includes(tag)) {
                return true
            }
        }

        return false
    }
    user_agent: string = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/129.0.6668.69 Mobile/15E148 Safari/604.1"


    constructor(private cheerio: CheerioAPI) { }


    /////////////////////////////////
    /////    REQUEST MANAGER    /////
    /////////////////////////////////


    requestManager = App.createRequestManager({
        requestsPerSecond: 5,
        requestTimeout: 20000,
        interceptor: {
            interceptRequest: async (request: Request): Promise<Request> => {
                request.headers = {
                    ...(request.headers ?? {}),
                    ...{
                        'referer': this.base_url,
                        'user-agent': this.user_agent
                    }
                }
                return request
            },
            interceptResponse: async (response: Response): Promise<Response> => {
                return response
            }
        }
    });


    /////////////////////////////////
    /////    MANGA PROVIDING    /////
    /////////////////////////////////


    getMangaShareUrl(mangaId: string): string { return `${this.base_url}/${this.source_path}/${mangaId}` }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const request = App.createRequest({
            url: `${this.base_url}/${this.source_path}/${mangaId}`,
            method: 'GET',
            headers: {"User-Agent": this.user_agent}
        })

        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status)
        const $ = this.cheerio.load(response.data as string)

        return parseMangaDetails($, mangaId, this);
    }


    ///////////////////////////////////
    /////    CHAPTER PROVIDING    /////
    ///////////////////////////////////


    async getChapters(mangaId: string): Promise<Chapter[]> {
        const request = App.createRequest({
            url: `${this.base_url}/${this.source_path}/${mangaId}`,
            method: 'GET',
            headers: {"User-Agent": this.user_agent}
        })

        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status)
        const $ = this.cheerio.load(response.data as string)

        return parseChapters($, mangaId, this);
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const request = App.createRequest({
            url: `${this.base_url}/${chapterId}`,
            method: 'GET',
            headers: {"User-Agent": this.user_agent}
        })

        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status)
        const $ = this.cheerio.load(response.data as string)

        return parseChapterDetails($, mangaId, chapterId, this);
    }


    //////////////////////////////////////////
    /////    SEARCH RESULTS PROVIDING    /////
    //////////////////////////////////////////


    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const page: number = metadata?.page ?? 1
        let url = `${this.base_url}`

        if (query.includedTags && query.includedTags?.length != 0) {
            url += `/${this.source_path}/?page=${page}`
            for (let tag of query.includedTags) url += `&${tag.id}`
        } else {
            const search = query.title?.replace(/ /g, '+').replace(/[’'´]/g, '%27') ?? ''
            url += `/?s=${search}&paged=${page}`
        }

        const request = App.createRequest({
            url,
            method: 'GET',
            headers: {"User-Agent": this.user_agent}
        })

        const response = await this.requestManager.schedule(request, 1)
        this.CloudFlareError(response.status)

        const $ = this.cheerio.load(response.data as string)
        const manga = parseSearchResults($, this)
        metadata = true ? { page: page + 1 } : undefined

        return await App.createPagedResults({
            results: manga,
            metadata
        })
    }

    async getSearchTags?(): Promise<TagSection[]> {
        const request = App.createRequest({
            url: `${this.base_url}/${this.source_path}`,
            method: 'GET',
            headers: {"User-Agent": this.user_agent}
        })

        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status)
        const $ = this.cheerio.load(response.data as string)

        return await parseSearchTags($);
    }


    /////////////////////////////////////////////
    /////    HOMEPAGE SECTIONS PROVIDING    /////
    /////////////////////////////////////////////


    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const sections = [
            App.createHomeSection({ id: 'update', title: this.latest, type: HomeSectionType.singleRowNormal, containsMoreItems: true }),
            App.createHomeSection({ id: 'popular', title: this.popular, type: HomeSectionType.singleRowNormal, containsMoreItems: true })
        ]

        for (const section of sections) {
            const request = App.createRequest({
                url: `${this.base_url}/${this.source_path}/?order=${section.id}`,
                method: 'GET',
                headers: {"User-Agent": this.user_agent}
            })
    
            const response = await this.requestManager.schedule(request, 1);
            this.CloudFlareError(response.status)
            const $ = this.cheerio.load(response.data as string)

            section.items = parseSearchResults($, this)
            sectionCallback(section)
        }
    } 

    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        const page: number = metadata?.page ?? 2

        const request = App.createRequest({
            url: `${this.base_url}/${this.source_path}/?page=${page}&order=${homepageSectionId}`,
            method: 'GET',
            headers: {"User-Agent": this.user_agent}
        })

        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status)
        const $ = this.cheerio.load(response.data as string)

        return await App.createPagedResults({
            results: parseSearchResults($, this),
            metadata: { page: page + 1 }
        })
    }


    /////////////////////////////////////////////////////
    /////    CLOUDFLARE BYPASS REQUEST PROVIDING    /////
    /////////////////////////////////////////////////////


    async getCloudflareBypassRequestAsync(): Promise<Request> {
        return await App.createRequest({
            url: `${this.base_url}`,
            method: 'GET',
            headers: {"User-Agent": this.user_agent}
        })
    }

    CloudFlareError(status: any) {
        if (status == 403) {
            throw new Error("Contourner Cloudflare avant d'utiliser la source !")
        }
    }
}