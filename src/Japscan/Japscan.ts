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
    Section
} from "paperback-extensions-common"

import {
    parseJapscanChapterDetails,
    parseJapscanChapters,
    parseJapscanMangaDetails,
    parseSearch,
    parseHomeSections,
    parseViewMore,
    UpdatedManga,
    parseUpdatedManga
} from "./JapscanParser";

import { 
    serverSettingsMenu
} from "./Settings";

import {
    getScrapServerURL
} from "./Common";

const JAPSCAN_DOMAIN = "https://www.japscan.me";
const method = 'GET'
const headers = {
    "Host": "www.japscan.me",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"
}

const headers_search = {
    "Host": "www.japscan.me",
    "Content-Type": "application/x-www-form-urlencoded",
    "Content-Length": "11",
    "X-Requested-With": "XMLHttpRequest",
}

export const JapscanInfo: SourceInfo = {
    version: '1.1',
    name: 'Japscan',
    icon: 'logo.png',
    author: 'Moomooo95',
    authorWebsite: 'https://github.com/Moomooo95',
    description: 'Source française Japscan',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: JAPSCAN_DOMAIN,
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

export class Japscan extends Source {
    stateManager = createSourceStateManager({});
    
    requestManager: RequestManager = createRequestManager({
        requestsPerSecond: 3,
        requestTimeout: 100000
    });

    /////////////////////////////
    /////    SOURCE MENU    /////
    /////////////////////////////

    override async getSourceMenu(): Promise<Section> {
        return createSection({
            id: "main",
            header: "Source Settings",
            rows: async () => [
                serverSettingsMenu(this.stateManager),
            ],
        });
    }

    /////////////////////////////////
    /////    MANGA SHARE URL    /////
    /////////////////////////////////

    override getMangaShareUrl(mangaId: string): string {
        return `${JAPSCAN_DOMAIN}/manga/${mangaId}`
    }


    ///////////////////////////////
    /////    MANGA DETAILS    /////
    ///////////////////////////////

    override async getMangaDetails(mangaId: string): Promise<Manga> {
        const request = createRequestObject({
            url: `${JAPSCAN_DOMAIN}/manga/${mangaId}/`,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data);
        
        return await parseJapscanMangaDetails($, mangaId);
    }


    //////////////////////////
    /////    CHAPTERS    /////
    //////////////////////////

    override async getChapters(mangaId: string): Promise<Chapter[]> {
        const request = createRequestObject({
            url: `${JAPSCAN_DOMAIN}/manga/${mangaId}/`,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data);
        
        return await parseJapscanChapters($, mangaId);
    }


    //////////////////////////////////
    /////    CHAPTERS DETAILS    /////
    //////////////////////////////////

    override async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const SHADOWOFBABEL_DOMAIN = await getScrapServerURL(this.stateManager)
        
        const request = createRequestObject({
            url: `${SHADOWOFBABEL_DOMAIN}/japscan/chapters/${mangaId}/${chapterId.split('/').filter(Boolean).pop()}`,
            method
        })

        const response = await this.requestManager.schedule(request, 1);

        return await parseJapscanChapterDetails(response.data, mangaId, chapterId);
    }


    ////////////////////////////////
    /////    SEARCH REQUEST    /////
    ////////////////////////////////

    override async getSearchResults(query: SearchRequest, _metadattrackera: any): Promise<PagedResults> {
        const search = query.title
        const request = createRequestObject({
            url: `${JAPSCAN_DOMAIN}/live-search/`,
            method : 'POST',
            headers: headers_search,
            data: `search=${search}`
        })

        const response = await this.requestManager.schedule(request, 1)        
        const manga = parseSearch(response.data)

        return createPagedResults({
            results: manga
        })    
    }


    //////////////////////////////
    /////    HOME SECTION    /////
    //////////////////////////////

    override async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const section1 = createHomeSection({ id: 'latest_updates', title: 'Dernières Sorties', view_more: true })
        const section2 = createHomeSection({ id: 'top_mangas_today', title: 'Tendances : Journalières' })
        const section3 = createHomeSection({ id: 'top_mangas_week', title: 'Tendances : Hebdomadaires' })
        const section4 = createHomeSection({ id: 'top_mangas_all_time', title: 'Tendances : Année' })

        const request = createRequestObject({
            url: `${JAPSCAN_DOMAIN}/`,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)
        
        parseHomeSections($, [section1, section2, section3, section4], sectionCallback)
    }

    /////////////////////////////////
    /////    VIEW MORE ITEMS    /////
    /////////////////////////////////
    
    override async getViewMoreItems(_homepageSectionId: string, metadata: any): Promise<PagedResults> {
        let page: number = metadata?.page ?? 1
        
        const request = createRequestObject({
            url: `${JAPSCAN_DOMAIN}`,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)

        const manga = parseViewMore($, page)
        metadata = !(page==8) ? { page: page + 1 } : undefined

        return createPagedResults({
            results: manga,
            metadata
        })
    }


    //////////////////////////////////////
    /////    FILTER UPDATED MANGA    /////
    //////////////////////////////////////

    override async filterUpdatedManga(mangaUpdatesFoundCallback: (updates: MangaUpdates) => void, time: Date, ids: string[]): Promise<void> {
        let updatedManga: UpdatedManga = {
            ids: [],
            loadMore: true
        }

        while (updatedManga.loadMore) {
            const request = createRequestObject({
                url: `${JAPSCAN_DOMAIN}`,
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