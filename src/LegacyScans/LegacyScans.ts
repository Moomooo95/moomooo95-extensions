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
    MangaTile
  } from "paperback-extensions-common"
  
  import {
    isLastPage,
    parseHomeSections,
    parseLegacyScansChapterDetails,
    parseLegacyScansChapters,
    parseLegacyScansMangaDetails,
    parseSearch,
    parseTags,
    UpdatedManga,
    parseUpdatedManga,
    parseViewMore
  } from "./LegacyScansParser";
  
  const LEGACYSCANS_DOMAIN = "https://legacy-scans.com";
  const method = 'GET'
  const headers = {
    'Host': 'legacy-scans.com',
  }
  
  export const LegacyScansInfo: SourceInfo = {
    version: '1.0',
    name: 'LegacyScans',
    icon: 'logo.png',
    author: 'Moomooo95',
    authorWebsite: 'https://github.com/Moomooo95',
    description: 'Source française LegacyScans',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: LEGACYSCANS_DOMAIN,
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
  
  export class LegacyScans extends Source {
  
    requestManager: RequestManager = createRequestManager({
      requestsPerSecond: 3
    });
  
  
    /////////////////////////////////
    /////    MANGA SHARE URL    /////
    /////////////////////////////////
  
    getMangaShareUrl(mangaId: string): string {
      return `${LEGACYSCANS_DOMAIN}/manga/${mangaId}`
    }
  
  
    ///////////////////////////////
    /////    MANGA DETAILS    /////
    ///////////////////////////////
  
    async getMangaDetails(mangaId: string): Promise<Manga> {
      const request = createRequestObject({
        url: `${LEGACYSCANS_DOMAIN}/manga/${mangaId}`,
        method,
        headers
      })
  
      const response = await this.requestManager.schedule(request, 1);
      const $ = this.cheerio.load(response.data);
  
      return await parseLegacyScansMangaDetails($, mangaId);
    }
  
  
    //////////////////////////
    /////    CHAPTERS    /////
    //////////////////////////
  
    async getChapters(mangaId: string): Promise<Chapter[]> {
      const request = createRequestObject({
        url: `${LEGACYSCANS_DOMAIN}/manga/${mangaId}`,
        method,
        headers
      })
  
      const response = await this.requestManager.schedule(request, 1);
      const $ = this.cheerio.load(response.data);
  
      return await parseLegacyScansChapters($, mangaId);
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
  
      return await parseLegacyScansChapterDetails($, mangaId, chapterId);
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
          url: `${LEGACYSCANS_DOMAIN}/manga/?page=${page}&genre%5B%5D=${query.includedTags[0].id}`,
          method: 'GET',
          headers
        })
  
        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)
  
        manga = parseSearch($)
        metadata = !isLastPage($, 'search_tags') ? { page: page + 1 } : undefined
      }
      else {
        const request = createRequestObject({
          url: `${LEGACYSCANS_DOMAIN}/page/${page}/?s=${search}`,
          method: 'GET',
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
      const section1 = createHomeSection({ id: 'latest_updates', title: 'Dernières sorties', view_more: true })
      const section2 = createHomeSection({ id: 'popular_today', title: 'Populaires aujourd\'hui' })
      const section3 = createHomeSection({ id: 'popular_week', title: 'Populaires Semaine' })
      const section4 = createHomeSection({ id: 'popular_months', title: 'Populaires Mois' })
      const section5 = createHomeSection({ id: 'popular_all', title: 'Populaires Tous' })
       
  
      const request1 = createRequestObject({
        url: `${LEGACYSCANS_DOMAIN}`,
        method: 'GET'
      })
  
      const response1 = await this.requestManager.schedule(request1, 1)
      const $1 = this.cheerio.load(response1.data)
  
      parseHomeSections($1, [section1, section2, section3, section4, section5], sectionCallback)
    }

    /////////////////////////////////
    /////    VIEW MORE ITEMS    /////
    /////////////////////////////////

    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
      let page: number = metadata?.page ?? 1
      let param = ''

      switch (homepageSectionId) {
        case 'latest_updates':
          param = `page/${page}`
          break;
      }

      const request = createRequestObject({
        url: `${LEGACYSCANS_DOMAIN}/${param}`,
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
  
  
    //////////////////////
    /////    TAGS    /////
    //////////////////////
  
    async getSearchTags(): Promise<TagSection[]> {
      const request = createRequestObject({
        url: `${LEGACYSCANS_DOMAIN}/genres`,
        method,
        headers
      })
  
      const response = await this.requestManager.schedule(request, 1)
      const $ = this.cheerio.load(response.data)
  
      return parseTags($)
    }
  
  
    //////////////////////////////////////
    /////    FILTER UPDATED MANGA    /////
    //////////////////////////////////////
  
    async filterUpdatedManga(mangaUpdatesFoundCallback: (updates: MangaUpdates) => void, time: Date, ids: string[]): Promise<void> {
      let updatedManga: UpdatedManga = {
        ids: [],
        loadMore: true
      }
  
      while (updatedManga.loadMore) {
        const request = createRequestObject({
          url: `${LEGACYSCANS_DOMAIN}`,
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