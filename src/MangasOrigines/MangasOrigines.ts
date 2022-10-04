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
  MangaTile,
  ContentRating,
  RequestManager,
  HomeSectionType
} from "paperback-extensions-common"

import {
  parseHomeSections,
  parseMangasOriginesDetails,
  parseMangasOriginesChapters,
  parseMangasOriginesChapterDetails,
  parseViewMore,
  isLastPage,
  parseTags,
  parseSearch,
  UpdatedManga,
  parseUpdatedManga
} from "./MangasOriginesParser";

const MANGASORIGINES_DOMAIN = "https://mangas-origines.fr";
const method = 'GET'
const headers = {
  'Host': 'mangas-origines.fr'
}

export const MangasOriginesInfo: SourceInfo = {
  version: '1.7.2',
  name: 'MangasOrigines',
  icon: 'logo.png',
  author: 'Moomooo95',
  authorWebsite: 'https://github.com/Moomooo95',
  description: 'Source française MangasOrigines',
  contentRating: ContentRating.ADULT,
  websiteBaseURL: MANGASORIGINES_DOMAIN,
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

export class MangasOrigines extends Source {

  requestManager: RequestManager = createRequestManager({
    requestsPerSecond: 3
  });


  /////////////////////////////////
  /////    MANGA SHARE URL    /////
  /////////////////////////////////

  getMangaShareUrl(mangaId: string): string {
    return `${MANGASORIGINES_DOMAIN}/manga/${mangaId}`
  }


  ///////////////////////////////
  /////    MANGA DETAILS    /////
  ///////////////////////////////

  async getMangaDetails(mangaId: string): Promise<Manga> {
    const request = createRequestObject({
      url: `${MANGASORIGINES_DOMAIN}/manga/${mangaId}`,
      method,
      headers
    })

    const response = await this.requestManager.schedule(request, 1);
    const $ = this.cheerio.load(response.data);

    return await parseMangasOriginesDetails($, mangaId);
  }


  //////////////////////////
  /////    CHAPTERS    /////
  //////////////////////////

  async getChapters(mangaId: string): Promise<Chapter[]> {
    const request = createRequestObject({
      url: `${MANGASORIGINES_DOMAIN}/manga/${mangaId}/ajax/chapters/`,
      method: 'POST',
      headers
    })

    const response = await this.requestManager.schedule(request, 1);
    const $ = this.cheerio.load(response.data);

    return await parseMangasOriginesChapters($, mangaId);
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

    return await parseMangasOriginesChapterDetails($, mangaId, chapterId);
  }


  ////////////////////////////////
  /////    SEARCH REQUEST    /////
  ////////////////////////////////

  async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
    const page: number = metadata?.page ?? 1
    const search = query.title?.replace(/ /g, '+').replace(/[’'´]/g, '%27') ?? ''
    let manga: MangaTile[] = []

    let url = `${MANGASORIGINES_DOMAIN}/?post_type=wp-manga&s=${search}&paged=${page}`

    if (query.includedTags && query.includedTags?.length != 0) {
      for (let tag of query.includedTags) {
        switch (tag.label) {
          case "Doit contenir un genre sélectionné":
          case "Doit avoir contenir tous les genres sélectionnés":
            url += `&op=${tag.id}`
            break;
          case "Tout":
          case "Aucun contenu pour adulte":
          case "Afficher seulement du contenus pour adulte":
            url += `&adult=${tag.id}`
            break;
          case "En cours":
          case "Complété":
          case "Annulé":
          case "En pause":
          case "Prochainement":
            url += `&status%5B%5D=${tag.id}`
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

  async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
    const section1 = createHomeSection({ id: 'hot_manga', title: '🔥 HOT 🔥', type: HomeSectionType.featured })
    const section2 = createHomeSection({ id: 'latest_updated', title: 'Dernières Sorties', view_more: true })
    const section3 = createHomeSection({ id: 'trends', title: 'Tendances', view_more: true })
    const section4 = createHomeSection({ id: 'popular_week', title: 'TOP Hebdomadaire' })

    const request = createRequestObject({
      url: `${MANGASORIGINES_DOMAIN}`,
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

  async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
    let page: number = metadata?.page ?? 1
    let param = ''
    switch (homepageSectionId) {
      case 'latest_updated':
        param = `catalogues/page/${page}/?m_orderby=latest`
        break;
      case 'trends':
        param = `catalogues/page/${page}/?m_orderby=trending`
        break;
    }

    const request = createRequestObject({
      url: `${MANGASORIGINES_DOMAIN}/${param}`,
      method,
      headers
    })

    const response = await this.requestManager.schedule(request, 1)
    const $ = this.cheerio.load(response.data)

    const manga = parseViewMore($)
    metadata = !isLastPage($) ? { page: page + 1 } : undefined

    return createPagedResults({
      results: manga,
      metadata
    })
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
        url: `${MANGASORIGINES_DOMAIN}/catalogues/?m_orderby=latest&page=${page++}`,
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

  async getSearchTags(): Promise<TagSection[]> {
    const request = createRequestObject({
      url: `${MANGASORIGINES_DOMAIN}/?s=&post_type=wp-manga`,
      method,
      headers
    })

    const response = await this.requestManager.schedule(request, 1)
    const $ = this.cheerio.load(response.data)

    return parseTags($)
  }
}