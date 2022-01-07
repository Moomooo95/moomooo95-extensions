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
    TagSection,
    MangaTile
} from "paperback-extensions-common"

import {
    isLastPage,
    parseCrunchyScanChapterDetails,
    parseCrunchyScanChapters,
    parseCrunchyScanDetails,
    parseHomeSections,
    parseSearch,
    parseTags,
    parseViewMore
} from "./CrunchyScanParser";

const CRUNCHYSCAN_DOMAIN = "https://crunchyscan.fr";
const SHADOWOFBABEL_DOMAIN = "https://shadow-of-babel.herokuapp.com";
const method = 'GET'
const headers = {
    'Host': 'crunchyscan.fr',
}
const headers_search = {
    "Host": "crunchyscan.fr",
    "accept": "text/plain, */*; q=0.01",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "Content-Length": "275"
}

export const CrunchyScanInfo: SourceInfo = {
    version: '1.0',
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
    requestManager: RequestManager = createRequestManager({
        requestsPerSecond: 3,
        requestTimeout: 50000
    });


    /////////////////////////////////
    /////    MANGA SHARE URL    /////
    /////////////////////////////////

    getMangaShareUrl(mangaId: string): string {
        return `${CRUNCHYSCAN_DOMAIN}/liste-manga/${mangaId}`
    }


    ///////////////////////////////
    /////    MANGA DETAILS    /////
    ///////////////////////////////

    async getMangaDetails(mangaId: string): Promise<Manga> {
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

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const request = createRequestObject({
            url: `${CRUNCHYSCAN_DOMAIN}/liste-manga/${mangaId}/ajax/chapters/`,
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Host": "crunchyscan.fr",
                "Origin": "https://crunchyscan.fr",
                "Referer": "https://crunchyscan.fr/",
                "X-Requested-With": "XMLHttpRequest"
            },
        })

        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status)
        const $ = this.cheerio.load(response.data);
        
        return await parseCrunchyScanChapters($, mangaId);
    }


    //////////////////////////////////
    /////    CHAPTERS DETAILS    /////
    //////////////////////////////////

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
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

    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const page: number = metadata?.page ?? 1
        const search = query.title?.replace(/ /g, '+').replace(/[’'´]/g, '%27') ?? ''
        let manga: MangaTile[] = []

        if (query.includedTags && query.includedTags?.length != 0) {
            const request = createRequestObject({
                url: `${CRUNCHYSCAN_DOMAIN}/archives/manga-genre/${query.includedTags[0].id}/page/${page}?s=${search}`,
                method : 'GET',
                headers
            })
        
            const response = await this.requestManager.schedule(request, 1)
            this.CloudFlareError(response.status)
            const $ = this.cheerio.load(response.data)
            
            manga = parseViewMore($)
            metadata = !isLastPage($) ? { page: page + 1 } : undefined
        }
        else {
            const request = createRequestObject({
                url: `${CRUNCHYSCAN_DOMAIN}/wp-admin/admin-ajax.php`,
                method : 'POST',
                headers: headers_search,
                data: `action=ajaxsearchpro_search&aspp=${encodeURI(search)}&asid=1&asp_inst_id=1_2&options=current_page_id%3D793%26qtranslate_lang%3D0%26filters_changed%3D0%26filters_initial%3D1%26asp_gen%255B%255D%3Dtitle%26asp_gen%255B%255D%3Dcontent%26asp_gen%255B%255D%3Dexcerpt%26customset%255B%255D%3Dwp-manga`
            })

            const response = await this.requestManager.schedule(request, 1)
            this.CloudFlareError(response.status)
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
        const section1 = createHomeSection({ id: 'latest_updated', title: 'Dernières Mise à jour', view_more: true })
        const section2 = createHomeSection({ id: 'most_viewed', title: 'Mangas avec le plus de vues' })
        const section3 = createHomeSection({ id: 'random_mangas', title: 'Mangas Aléatoires' })

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

    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        let page: number = metadata?.page ?? 1
        let param = ''

        switch (homepageSectionId) {
            case 'latest_updated':
                param = `liste-manga/page/${page}?m_orderby=latest`
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





    //////////////////////
    /////    TAGS    /////
    //////////////////////

    async getSearchTags(): Promise<TagSection[]> {
        const request = createRequestObject({
            url: `${CRUNCHYSCAN_DOMAIN}/liste-manga`,
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

    CloudFlareError(status: any) {
        if(status == 503) {
            throw new Error('CLOUDFLARE BYPASS ERROR:\nPlease go to Settings > Sources > \<\The name of this source\> and press Cloudflare Bypass')
        }
    }
    
    getCloudflareBypassRequest() {
        return createRequestObject({
            url: `${CRUNCHYSCAN_DOMAIN}/liste-manga/les-techniques-celestes-du-dieu-guerrier/chapitre-19/`,
            method : "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Host": "crunchyscan.fr",
                "Origin": "https://crunchyscan.fr",
                "Referer": "https://crunchyscan.fr/",
                "X-Requested-With": "XMLHttpRequest"
            },
            data: "g-recaptcha-response=03AGdBq271pcGFYFPqGn9sl29SDdx-i3YVeTOxUUdehMrYQaxE2kX4MYQz6KmmjwClAhgKDXIg17gi_4Pf0UR_kA8H_Ogc1Pjo5hIConU-NnkyNRKQN9v-O9euApCd0xVANXsY0c6Ca9LklrxCOi5ExqqN2I9ZwPR5XzRnSk6J79xK81AHiZo48KTx3dONWnuPHQa5wOKBCVMvkUST7ts9lBW_oIEDFha1XTr7WzLvlcYiSVyzoL590S8vqgRq_UKbkCHXzZnl-MBur3__CuaFhYERS_fJMeasPlkUJU2hgOJ5rBmuB_TeDHb5k-Z94a1fOlvjJyL2fyKMzY6JZZPRyokupaF9upCNbXr7ddSKC0jeLklIR6M6uIfzyyWVBHWk6UI-cB23z7dwKz40hvfxQR3R_vOSljaEUiPNEMPc92wYfTeA8sc8HJYB11DwnAnWjy0SgqFk5aIhhY7HYaySjGR18N_YRYDMO8Y3MLuKmMCig2f3yxE14UsLXx4X8LpTa32fKXTBQTPxqkgqiERQ-pbm_yQu0X731A&submitpost=Valider"
        }) 
    }
}