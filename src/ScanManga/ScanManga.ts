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
    HomeSectionType
  } from "paperback-extensions-common"
  
  import {
    isLastPage,
    parseDate,
    parseHomeSections,
    parseScanMangaChapterDetails,
    parseScanMangaChapters,
    parseScanMangaDetails,
    parseSearch
  } from "./ScanMangaParser";
  
  const SCANMANGA_DOMAIN = "https://www.scan-manga.com";
  const method = 'GET'
  const headers = {
    'Host': 'www.scan-manga.com',
  }
  
  export const ScanMangaInfo: SourceInfo = {
      version: '1.0',
      name: 'Scan Manga',
      icon: 'logo.png',
      author: 'Moomooo95',
      authorWebsite: 'https://github.com/Moomooo95',
      description: 'Source française Scan Manga',
      contentRating: ContentRating.ADULT,
      websiteBaseURL: SCANMANGA_DOMAIN,
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
  
  export class ScanManga extends Source {
  
    requestManager: RequestManager = createRequestManager({
        requestsPerSecond: 3
    });
  
  
    /////////////////////////////////
    /////    MANGA SHARE URL    /////
    /////////////////////////////////
  
    getMangaShareUrl(mangaId: string): string {
        return `${SCANMANGA_DOMAIN}/${mangaId}/`
    }


    ///////////////////////////////
    /////    MANGA DETAILS    /////
    ///////////////////////////////

    async getMangaDetails(mangaId: string): Promise<Manga> {
        const request = createRequestObject({
            url: `${SCANMANGA_DOMAIN}/${mangaId}/`,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data);
        
        return await parseScanMangaDetails($, mangaId);
    }


    //////////////////////////
    /////    CHAPTERS    /////
    //////////////////////////

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const request = createRequestObject({
            url: `${SCANMANGA_DOMAIN}/${mangaId}/`,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data);
        
        return await parseScanMangaChapters($, mangaId);
    }
    

    //////////////////////////////////
    /////    CHAPTERS DETAILS    /////
    //////////////////////////////////

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const request = createRequestObject({
            url: `${chapterId}`,
            method,
            headers : { 
                "authority": "lel.scanmanga.eu",
                "path": `${chapterId}`,
                "scheme": "https",
                "accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
                "referer": "https://www.scan-manga.com/",
                "sec-fetch-dest": "image",
                "sec-fetch-mode": "no-cors",
                "sec-fetch-site": "cross-site",
                "sec-gpc": "1",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"
            }
        })

        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status)
        const $ = this.cheerio.load(response.data);
        
        return await parseScanMangaChapterDetails($, mangaId, chapterId);
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
                url: `${SCANMANGA_DOMAIN}/`,
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
                url: `${SCANMANGA_DOMAIN}/qsearch.json?term=${search}`,
                method,
                headers
            })
        
            const response = await this.requestManager.schedule(request, 1)
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
        const section1 = createHomeSection({ id: 'latest_updates', title: 'Dernier Manga Sorti' })
        const section2 = createHomeSection({ id: 'top_discovery_bd', title: 'Top Découvertes Mangas' })
        const section3 = createHomeSection({ id: 'top_dismissed_bd', title: 'Top Licenciées Mangas' })
        const section4 = createHomeSection({ id: 'new_mangas', title: 'Nouveaux Mangas' })

        const request1 = createRequestObject({
            url: `${SCANMANGA_DOMAIN}`,
            method: 'GET'
        })

        const response1 = await this.requestManager.schedule(request1, 1)
        const $1 = this.cheerio.load(response1.data)
        
        parseHomeSections($1, [section1, section2, section3, section4], sectionCallback)
    }


    //////////////////////////////////////
    /////    FILTER UPDATED MANGA    /////
    //////////////////////////////////////

    async filterUpdatedManga(mangaUpdatesFoundCallback: (updates: MangaUpdates) => void, time: Date, ids: string[]): Promise<void> {
        const request = createRequestObject({
            url: `${SCANMANGA_DOMAIN}`,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 1)
        this.CloudFlareError(response.status)
        const $ = this.cheerio.load(response.data)

        const updatedManga: string[] = []
        for (const manga of $('#content_news .listing').toArray()) {
            let id = $('.left .nom_manga', manga).attr('href')
            let mangaDate = parseDate($('.left .date', manga).clone().children().remove().end().text().trim())
    
            if (!id) continue
            if (mangaDate > time) {
                if (ids.includes(id)) {
                updatedManga.push(id)
                }
            }
        }

        mangaUpdatesFoundCallback(createMangaUpdates({ids: updatedManga}))
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
            url: `https://lel.scanmanga.eu/solo_leveling/11059/117067/4_3a115fd7984d0fe6289a56c12814e1b6.jpg?zoneID=144480&pageID=2756308&siteID=5176&st=2PFy-47nXG4iYim1TFNxEQ&e=1636156800`,
            method: 'GET',
            headers: { 
                "authority": "lel.scanmanga.eu",
                "accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
                "referer": "https://www.scan-manga.com/",
                "sec-fetch-dest": "image",
                "sec-fetch-mode": "no-cors",
                "sec-fetch-site": "cross-site",
                "sec-gpc": "1",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
                "host": "lel.scanmanga.eu", 
            }
        }) 
    }

}