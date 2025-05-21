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
    SourceIntents,
    ContentRating,
    SourceInfo,
    BadgeColor
} from '@paperback/types'

import {
    parseMangaDetails,
    parseChapters,
    parseChapterDetails,
    parseMangaResults,
    parseSearchTags
} from './PhenixScansParser'

import * as cheerio from 'cheerio'

const DOMAIN: string = 'https://phenix-scans.com'
export const API_DOMAIN: string = 'https://api.phenix-scans.com'

export const PhenixScansInfo: SourceInfo = {
    version: "2.0",
    language: "FR",
    name: 'PhenixScans',
    icon: 'icon.png',
    description: `Extension that pulls mangas from ${DOMAIN}`,
    author: 'Moomooo95',
    authorWebsite: 'https://github.com/Moomooo95',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    sourceTags: [
        {
            text: 'FR',
            type: BadgeColor.GREY
        },
    ],
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS
}

export class PhenixScans implements MangaProviding, ChapterProviding, SearchResultsProviding, HomePageSectionsProviding {

    requestManager = App.createRequestManager({
        requestsPerSecond: 10,
        requestTimeout: 20000,
        interceptor: {
            interceptRequest: async (request: Request): Promise<Request> => {
                request.headers = {
                    ...(request.headers ?? {}),
                    ...{
                        'referer': `${DOMAIN}/`
                    }
                }
                return request
            },
            interceptResponse: async (response: Response): Promise<Response> => {
                return response
            }
        }
    })


    /////////////////////////////////
    /////    MANGA PROVIDING    /////
    /////////////////////////////////


    getMangaShareUrl(mangaId: string): string { return `${DOMAIN}/manga/${mangaId}` }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const request = App.createRequest({
            url: `${API_DOMAIN}/front/manga/${mangaId}`,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        const json = JSON.parse(response.data as string)
        return parseMangaDetails(json, mangaId)
    }


    ///////////////////////////////////
    /////    CHAPTER PROVIDING    /////
    ///////////////////////////////////


    async getChapters(mangaId: string): Promise<Chapter[]> {
        const request = App.createRequest({
            url: `${API_DOMAIN}/front/manga/${mangaId}`,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        const json = JSON.parse(response.data as string)
        return parseChapters(json, mangaId)
    }
    
    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const request = App.createRequest({
            url: `${API_DOMAIN}/front/manga/${mangaId}/chapter/${chapterId}`,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        const json = JSON.parse(response.data as string)
        return parseChapterDetails(json, mangaId, chapterId)
    }


    /////////////////////////////////////////////
    /////    HOMEPAGE SECTIONS PROVIDING    /////
    /////////////////////////////////////////////


    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const sections = [
            App.createHomeSection({ id: 'updatedAt', title: "Dernières Sorties", type: HomeSectionType.singleRowNormal, containsMoreItems: true }),
            App.createHomeSection({ id: 'rating', title: "Populaire", type: HomeSectionType.singleRowNormal, containsMoreItems: true })
        ]

        for (const section of sections) {
            const request = App.createRequest({
                url: `${API_DOMAIN}/front/manga?sort=${section.id}`,
                method: 'GET'
            })
    
            const response = await this.requestManager.schedule(request, 1)
            const json = JSON.parse(response.data as string)

            section.items = parseMangaResults(json)
            sectionCallback(section)
        }
    }
    
    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        const page: number = metadata?.page ?? 1

        const request = App.createRequest({
            url: `${API_DOMAIN}/front/manga?sort=${homepageSectionId}&page=${page}&limit=18`,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        const json = JSON.parse(response.data as string)
        const results = parseMangaResults(json)

        return App.createPagedResults({
            results,
            metadata: json.pagination.hasNextPage ? { page: page + 1 } : undefined
        })
    }


    //////////////////////////////////////////
    /////    SEARCH RESULTS PROVIDING    /////
    //////////////////////////////////////////


    async getSearchTags?(): Promise<TagSection[]> {
        const request_genres = App.createRequest({
            url: `${API_DOMAIN}/front/manga`,
            method: 'GET'
        })
        const request_filters = App.createRequest({
            url: `${DOMAIN}/manga`,
            method: 'GET'
        })
        
        const response_genres = await this.requestManager.schedule(request_genres, 1)
        const json = JSON.parse(response_genres.data as string)
        
        const response_filters = await this.requestManager.schedule(request_filters, 1)
        const $ = cheerio.load(response_filters.data as string)
        
        return parseSearchTags(json, $)
    }
    
    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const page: number = metadata?.page ?? 1
        const search = query.title?.replace(/ /g, '+').replace(/[’'´]/g, '%27') ?? ''

        let url = ""
        if (search) {
            url = `${API_DOMAIN}/front/manga/search?query=${search}`
        } else {
            url = `${API_DOMAIN}/front/manga?page=${page}&limit=18`

            if (query.includedTags && query.includedTags?.length != 0) {
                url += `&genre=${query.includedTags.filter(tag => tag.id.startsWith("genre=")).map(tag => tag.id.replace("genre=", "")).join("%2C")}`
                url += query.includedTags.find(tag => tag.id.startsWith("&type="))?.id ?? ""
                url += query.includedTags.find(tag => tag.id.startsWith("&status="))?.id ?? ""
                url += query.includedTags.find(tag => tag.id.startsWith("&sort="))?.id ?? ""
            }
        }
    
        const request = App.createRequest({
            url,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        const json = JSON.parse(response.data as string)

        const results = parseMangaResults(json)
        metadata = json.pagination.hasNextPage ? { page: page + 1 } : undefined

        return App.createPagedResults({
            results,
            metadata
        })
    }

}   

