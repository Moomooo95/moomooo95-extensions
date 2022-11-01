import {
    Source,
    Manga,
    Chapter,
    ChapterDetails,
    HomeSection,
    SearchRequest,
    PagedResults,
    SourceInfo,
    TagType,
    ContentRating,
    RequestManager,
    TagSection,
    MangaTile,
    Section,
    HomeSectionType,
    MangaUpdates
} from "paperback-extensions-common"

import {
    isLastPage,
    parseCrunchyScanChapterDetails,
    parseCrunchyScanChapters,
    parseCrunchyScanDetails,
    parseHomeSections,
    parseSearch,
    parseTags,
    parseUpdatedManga,
    parseViewMore,
    UpdatedManga
} from "./CrunchyScanParser";

import {
    serverSettingsMenu
} from "./Settings";

import {
    getScrapServerURL
} from "./Common";

const CRUNCHYSCAN_DOMAIN = "https://crunchyscan.fr";
const method = 'GET'
const headers = {
    'Host': 'crunchyscan.fr',
}

export const CrunchyScanInfo: SourceInfo = {
    version: '1.1',
    name: 'CrunchyScan',
    icon: 'logo.png',
    author: 'Moomooo95',
    authorWebsite: 'https://github.com/Moomooo95',
    description: 'Source française CrunchyScan',
    contentRating: ContentRating.ADULT,
    websiteBaseURL: CRUNCHYSCAN_DOMAIN,
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
        },
        {
            text: 'Slow',
            type: TagType.YELLOW
        }
    ]
}

export class CrunchyScan extends Source {
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
        return `${CRUNCHYSCAN_DOMAIN}/liste-manga/${mangaId}`
    }

    ///////////////////////////////
    /////    MANGA DETAILS    /////
    ///////////////////////////////

    override async getMangaDetails(mangaId: string): Promise<Manga> {
        const request = createRequestObject({
            url: `${CRUNCHYSCAN_DOMAIN}/liste-manga/${mangaId}`,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status)
        const $ = this.cheerio.load(response.data);

        return await parseCrunchyScanDetails($, mangaId);
    }

    //////////////////////////
    /////    CHAPTERS    /////
    //////////////////////////

    override async getChapters(mangaId: string): Promise<Chapter[]> {
        const request = createRequestObject({
            url: `${CRUNCHYSCAN_DOMAIN}/liste-manga/${mangaId}/ajax/chapters/`,
            method: 'POST',
            headers,
        })

        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status)
        const $ = this.cheerio.load(response.data);

        return await parseCrunchyScanChapters($, mangaId);
    }

    //////////////////////////////////
    /////    CHAPTERS DETAILS    /////
    //////////////////////////////////

    override async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const SHADOWOFBABEL_DOMAIN = await getScrapServerURL(this.stateManager)

        const request = createRequestObject({
            url: `${SHADOWOFBABEL_DOMAIN}/crunchyscan/chapters/${mangaId}/${chapterId.split('/').filter(Boolean).pop()}`,
            method
        })

        const response = await this.requestManager.schedule(request, 1);

        return await parseCrunchyScanChapterDetails(response.data, mangaId, chapterId);
    }

    ////////////////////////////////
    /////    SEARCH REQUEST    /////
    ////////////////////////////////

    override async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const page: number = metadata?.page ?? 1
        const search = query.title?.replace(/ /g, '+').replace(/[’'´]/g, '%27') ?? ''
        let manga: MangaTile[] = []

        let url = `${CRUNCHYSCAN_DOMAIN}/?post_type=wp-manga&s=${search}&paged=${page}`

        if (query.includedTags && query.includedTags?.length != 0) {
            for (let tag of query.includedTags) {
                switch (tag.label) {
                    case "OU (ayant l'un des genres sélectionnés)":
                    case "ET (avoir tous les genres sélectionnés)":
                        url += `&op=${tag.id}`
                        break;
                    case "All":
                    case "Aucun contenu adulte":
                    case "Contenu pour adultes uniquement":
                        url += `&adult=${tag.id}`
                        break;
                    case "En Cours":
                    case "Terminé":
                    case "Annulé":
                    case "En attente":
                        url += `&status%5B%5D=${tag.id}`
                        break;
                    case "Tout":
                    case "Webcomic":
                    case "Manga":
                        url += `&type%5B%5D=${tag.id}`
                        break;
                    default:
                        url += `&genre%5B%5D=${tag.id}`
                        break;
                }
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

    override async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const section1 = createHomeSection({ id: 'hot_manga', title: 'HOT', type: HomeSectionType.featured })
        const section2 = createHomeSection({ id: 'latest_updated', title: 'Dernières Sorties', view_more: true })
        const section3 = createHomeSection({ id: 'trends', title: 'Tendances', view_more: true })

        const request = createRequestObject({
            url: `${CRUNCHYSCAN_DOMAIN}`,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 1)
        this.CloudFlareError(response.status)
        const $ = this.cheerio.load(response.data)

        parseHomeSections($, [section1, section2, section3], sectionCallback)
    }

    /////////////////////////////////
    /////    VIEW MORE ITEMS    /////
    /////////////////////////////////

    override async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        let page: number = metadata?.page ?? 1
        let param = ''

        switch (homepageSectionId) {
            case 'latest_updated':
                param = `liste-manga/page/${page}?m_orderby=latest`
                break;
            case 'trends':
                param = `liste-manga/page/${page}?m_orderby=trending`
                break;
        }

        const request = createRequestObject({
            url: `${CRUNCHYSCAN_DOMAIN}/${param}`,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 1)
        this.CloudFlareError(response.status)
        const $ = this.cheerio.load(response.data)

        const manga = parseViewMore($)
        metadata = !isLastPage($) ? { page: page + 1 } : { page: page + 1 }

        return createPagedResults({
            results: manga,
            metadata
        })
    }

    //////////////////////////////////////
    /////    FILTER UPDATED MANGA    /////
    //////////////////////////////////////

    override async filterUpdatedManga(mangaUpdatesFoundCallback: (updates: MangaUpdates) => void, time: Date, ids: string[]): Promise<void> {
        let page = 1
        let updatedManga: UpdatedManga = {
            ids: [],
            loadMore: true
        }

        while (updatedManga.loadMore) {
            const request = createRequestObject({
                url: `${CRUNCHYSCAN_DOMAIN}/liste-manga/?m_orderby=latest&page=${page++}`,
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

    override async getSearchTags(): Promise<TagSection[]> {
        const request = createRequestObject({
            url: `${CRUNCHYSCAN_DOMAIN}/?s=&post_type=wp-manga`,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 1)
        this.CloudFlareError(response.status)
        const $ = this.cheerio.load(response.data)

        return parseTags($)
    }

    ///////////////////////////////////
    /////    CLOUDFLARE BYPASS    /////
    ///////////////////////////////////

    override getCloudflareBypassRequest() {
        return createRequestObject({
            url: `${CRUNCHYSCAN_DOMAIN}`,
            method,
            headers
        })
    }

    CloudFlareError(status: any) {
        if (status == 503) {
            throw new Error('CLOUDFLARE BYPASS ERROR:\nPlease go to Settings > Sources > CrunchyScan and press Cloudflare Bypass')
        }
    }
}