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
  Request,
  Response
} from "paperback-extensions-common"

import {
  isLastPage,
  parseHomeSections,
  parseFRScanChapterDetails,
  parseFRScanChapters,
  parseFRScanMangaDetails,
  parseSearch,
  parseTags,
  UpdatedManga,
  parseUpdatedManga
} from "./FRScanParser";

const FRSCAN_DOMAIN = "https://frscan.ws/";
const method = 'GET'
const headers = {
  'Host': 'frscan.ws'
}

export const FRScanInfo: SourceInfo = {
  version: '1.2.1',
  name: 'FRScan',
  icon: 'logo.png',
  author: 'Moomooo95',
  authorWebsite: 'https://github.com/Moomooo95',
  description: 'Source française FRScan (anciennement appelée LelScanVF)',
  contentRating: ContentRating.MATURE,
  websiteBaseURL: FRSCAN_DOMAIN,
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

export class FRScan extends Source {

  requestManager: RequestManager = createRequestManager({
    requestsPerSecond: 3,
    interceptor: {
        interceptRequest: async (request: Request): Promise<Request> => {
            request.headers = {
                'Referer': 'https://frscan.ws/'
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
    return `${FRSCAN_DOMAIN}/manga/${mangaId}`
  }


  ///////////////////////////////
  /////    MANGA DETAILS    /////
  ///////////////////////////////

  async getMangaDetails(mangaId: string): Promise<Manga> {
    const request = createRequestObject({
      url: `${FRSCAN_DOMAIN}/manga/${mangaId}`,
      method,
      headers
    })

    const response = await this.requestManager.schedule(request, 1);
    const $ = this.cheerio.load(response.data);

    return await parseFRScanMangaDetails($, mangaId);
  }


  //////////////////////////
  /////    CHAPTERS    /////
  //////////////////////////

  async getChapters(mangaId: string): Promise<Chapter[]> {
    const request = createRequestObject({
      url: `${FRSCAN_DOMAIN}/manga/${mangaId}`,
      method,
      headers
    })

    const response = await this.requestManager.schedule(request, 1);
    const $ = this.cheerio.load(response.data);

    return await parseFRScanChapters($, mangaId);
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

    return await parseFRScanChapterDetails($, mangaId, chapterId);
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
        url: `${FRSCAN_DOMAIN}/filterList?page=${page}&tag=${query.includedTags[0].id}&alpha=${search}&sortBy=name&asc=true`,
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
        url: `${FRSCAN_DOMAIN}/filterList?page=${page}&alpha=${search}&sortBy=name&asc=true`,
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
    const section1 = createHomeSection({ id: 'latest_popular_manga', title: 'Dernier Manga Populaire Sorti' })
    const section2 = createHomeSection({ id: 'latest_updates', title: 'Dernier Manga Sorti' })
    const section3 = createHomeSection({ id: 'top_manga', title: 'Top MANGA' })

    const request1 = createRequestObject({
      url: `${FRSCAN_DOMAIN}`,
      method
    })

    const response1 = await this.requestManager.schedule(request1, 1)
    const $1 = this.cheerio.load(response1.data)

    parseHomeSections($1, [section1, section2, section3], sectionCallback)
  }


  //////////////////////
  /////    TAGS    /////
  //////////////////////

  async getSearchTags(): Promise<TagSection[]> {
    const request = createRequestObject({
      url: `${FRSCAN_DOMAIN}/manga-list`,
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
        url: `${FRSCAN_DOMAIN}`,
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
