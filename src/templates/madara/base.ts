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
    SearchField,
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
    parseSearchFields,
    parseHomePageSections,
    parseViewMoreItems
} from './parser'


export abstract class Madara implements MangaProviding, ChapterProviding, SearchResultsProviding, HomePageSectionsProviding, CloudflareBypassRequestProviding {

    abstract base_url: string
    abstract lang_code: string

    // Website Configuration
    source_path: string = "manga"
    search_cookies: string = "wpmanga-adault=1"
    post_type: string = "wp-manga"
    alt_ajax: boolean = false
    cloudflare_domain: boolean = true

    // Date Configuration
    date_format: string = "DD/MM/YYYY"
    date_lang: string = "fr"

    // Default Selectors Definition
    title_selector: string = "div.post-title h1"
    otherstitle_selector: string = "div.post-content_item:contains(Alternative) div.summary-content"
    image_selector: string = "div.summary_image img"
    author_selector: string = "[href*=manga-aut]"
    artist_selector: string = "[href*=manga-art]"
    description_selector: string = "div.description-summary div p"
    genres_selector: string = "div.genres-content > a"
    type_selector: string = "div.post-content_item:contains(Type) div.summary-content"
    status_selector: string = `div.post-content_item:contains(Statu) div.summary-content`
    rating_selector: string = ".post-total-rating .total_votes"
    search_selector: string = "div.c-tabs-item__content"
    base_id_selector: string = "h3.h5 > a"
    chapters_selector: string = "li.wp-manga-chapter"
    chapters_date_selector: string = "span.chapter-release-date"
    chapter_pictures_selector: string = "div.page-break > img"
    badge_adult_selector: string = ".manga-title-badges.adult"
    badges_selector: string = "span.manga-title-badges"

    // String Personnalised
    search_fileds_name_list: { default: string; new: string }[] = [
        { default: "Author", new: "Auteur" },
        { default: "Artist", new: "Artiste" },
        { default: "Year", new: "Année" },
    ]
    genres_conditions_name_list: { default: string; new: string }[] = [
        { default: "OR (having one of selected genres)", new: "OU (ayant au moins un des genres sélectionné)" },
        { default: "AND (having all selected genres)", new: "ET (ayant tous les genres sélectionné)" }
    ]
    adult_content_name_list: { default: string; new: string }[] = [
        { default: "All", new: "Tout" },
        { default: "None adult content", new: "Aucun contenu pour adulte" },
        { default: "Only adult content", new: "Seulement du contenu pour adulte" }
    ]
    status_name_list: { default: string[]; new: string }[] = [
        { default: ["ongoing", "releasing", "en cours"], new: "En cours" },
        { default: ["completed", "terminé"], new: "Terminé" },
        { default: ["canceled", "dropped", "annulé"], new: "Annulé" },
        { default: ["hiatus", "on hold", "en attente", "en pause"], new: "En pause" },
        { default: ["upcoming", "à venir", "prochainement"], new: "Prochainement" }
    ]
    latest: string = "Dernières Sorties"
    trending: string = "Tendance"

    // Functions
    viewer = ($: CheerioAPI, categories: any): string => {
        const seriesType = $(this.type_selector).text().trim().toLowerCase()
        const webtoonTags = ["manhwa", "manhua", "webtoon", "vertical", "korean", "chinese"]
        const rtlTags = ["manga", "japan"]

        const source = seriesType || categories.join(" ").toLowerCase()

        return webtoonTags.find(tag => source.includes(tag))
            ?? rtlTags.find(tag => source.includes(tag))
            ?? "unknown"

    }
    status = ($: CheerioAPI): string => {
        let status_str = $(this.status_selector).text().trim().toLowerCase()
        
        const cleaned = status_str.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
        const match = this.status_name_list.find(entry => entry.default.includes(cleaned))

        return match ? match.new : "N/A"
    }
    nsfw = ($: CheerioAPI, categories: any): boolean => {
        if ($(this.badge_adult_selector)) {
            return true
        } else {
            for (let tag in ["adult", "mature", "ecchi"]) {
                if (categories.includes(tag)) {
                    return true
                }
            }
            return false
        }
    }


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
                        'referer': this.base_url
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
            method: 'GET'
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
        let url = `${this.base_url}/wp-admin/admin-ajax.php`
        if (this.alt_ajax) {
            url = `${this.base_url}/${this.source_path}/${mangaId}/ajax/chapters`
        }

        let int_id = await this.getIntMangaId(mangaId)

        const request = App.createRequest({
            url,
            method: 'POST',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            data: `action=manga_get_chapters&manga=${int_id}`
        })

        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status)
        const $ = this.cheerio.load(response.data as string)

        return parseChapters($, mangaId, this);
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const request = App.createRequest({
            url: `${this.base_url}/${this.source_path}/${mangaId}/${chapterId}?style=list`,
            method: 'GET'
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
        const search = query.title?.replace(/ /g, '+').replace(/[’'´]/g, '%27') ?? ''

        let url = `${this.base_url}/?post_type=${this.post_type}&s=${search}&paged=${page}`

        if (query.includedTags && query.includedTags?.length != 0) {
            for (let tag of query.includedTags) url += `&${tag.id}`
        }

        if (query.parameters && query.includedTags?.length != 0) {
            for (const [key, value] of Object.entries(query.parameters)) {
                url += `&${key}=${value}`
            }
        }

        const request = App.createRequest({
            url,
            method: 'GET',
            headers: {"Cookie": this.search_cookies}
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
            url: `${this.base_url}/?s=&post_type=${this.post_type}`,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status)
        const $ = this.cheerio.load(response.data as string)

        return await parseSearchTags($, this);
    }

    async getSearchFields?(): Promise<SearchField[]> {
        const request = App.createRequest({
            url: `${this.base_url}/?s=&post_type=${this.post_type}`,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status)
        const $ = this.cheerio.load(response.data as string)

        return await parseSearchFields($, this);
    }


    /////////////////////////////////////////////
    /////    HOMEPAGE SECTIONS PROVIDING    /////
    /////////////////////////////////////////////


    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const sections = [
            App.createHomeSection({ id: 'latest', title: this.latest, type: HomeSectionType.singleRowNormal, containsMoreItems: true }),
            App.createHomeSection({ id: 'trending', title: this.trending, type: HomeSectionType.singleRowNormal, containsMoreItems: true })
        ]

        for (const section of sections) {
            const request = App.createRequest({
                url: `${this.base_url}/?s&post_type=${this.post_type}&m_orderby=${section.id}`,
                method: 'GET'
            })
    
            const response = await this.requestManager.schedule(request, 1);
            this.CloudFlareError(response.status)
            const $ = this.cheerio.load(response.data as string)

            section.items = parseHomePageSections($, this)
            sectionCallback(section)
        }
    } 

    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        const page: number = metadata?.page ?? 1
        let listing_id = ''

        switch (homepageSectionId) {
            case 'latest':
                listing_id = '_latest_update'
                break
            case 'trending':
                listing_id = `_wp_manga_week_views_value`
                break
            default:
                throw new Error(`Invalid homeSectionId | ${homepageSectionId}`)
        }

        const request = App.createRequest({
            url: `${this.base_url}/wp-admin/admin-ajax.php`,
            method: 'POST',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            data: `action=madara_load_more&page=${page}&template=madara-core%2Fcontent%2Fcontent-archive&vars%5Bpaged%5D=1&vars%5Borderby%5D=meta_value_num&vars%5Btemplate%5D=archive&vars%5Bsidebar%5D=full&vars%5Bpost_type%5D=${this.post_type}&vars%5Bpost_status%5D=publish&vars%5Bmeta_key%5D=${listing_id}&vars%5Border%5D=desc&vars%5Bmeta_query%5D%5Brelation%5D=OR&vars%5Bmanga_archives_item_layout%5D=big_thumbnail`
        })

        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status)
        const $ = this.cheerio.load(response.data as string)

        return await App.createPagedResults({
            results: parseViewMoreItems($, this),
            metadata: { page: page + 1 }
        })
    }


    /////////////////////////////////////////////////////
    /////    CLOUDFLARE BYPASS REQUEST PROVIDING    /////
    /////////////////////////////////////////////////////


    async getCloudflareBypassRequestAsync(): Promise<Request> {
        if (this.cloudflare_domain) {
            return await App.createRequest({
                url: `${this.base_url}`,
                method: 'GET'
            })
        } else {
            return await App.createRequest({
                url: `${this.base_url}/${this.source_path}/s`,
                method: 'GET'
            })
        }
    }

    CloudFlareError(status: any) {
        if (status == 403) {
            throw new Error("Contourner Cloudflare avant d'utiliser la source !")
        }
    }

    async getIntMangaId(mangaId: string) : Promise<String> {
        const request = App.createRequest({
            url: `${this.base_url}/${this.source_path}/${mangaId}`,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status)
        const $ = this.cheerio.load(response.data as string)

        return $('script#wp-manga-js-extra').html()!.match(/"manga_id":"(\d*)"/)![1]!
    }
}