import {
  Chapter,
  ChapterDetails,
  HomeSection,
  LanguageCode,
  Manga,
  MangaStatus,
  MangaTile,
  Tag,
  TagSection
} from "paperback-extensions-common";

///////////////////////////////
/////    MANGA DETAILS    /////
///////////////////////////////

export const parseReaperScansFRDetails = ($: CheerioStatic, mangaId: string): Manga => {
  const panel = $('#nav-info')

  const titles = [decodeHTMLEntity($('.container .post-title h1').text().trim())]
  const image = $('.summary_image img').attr('src') ?? ''
  const author = $('.post-content_item .summary-heading:contains("Auteur(s)")', panel).next().text().trim() ?? "Unknown"
  const artist = $('.post-content_item .summary-heading:contains("Artiste(s)")', panel).next().text().trim() ?? "Unknown"

  const rating = Number($('.post-total-rating .score', panel).text().trim())
  const follows = Number($('.post-status .manga-action .add-bookmark .action_detail').text().trim().replace(/[^\d]/g, ""))
  let hentai = false

  const otherTitles = $('.post-content_item .summary-heading:contains("Alternative")', panel).next().text().trim().split(',')
  for (let title of otherTitles) {
    titles.push(decodeHTMLEntity(title.trim()))
  }

  const arrayTags: Tag[] = []
  const tags = $('.post-content_item .summary-heading:contains("Genre(s)")', panel).next().find('a').toArray()
  for (const tag of tags) {
    const label = decodeHTMLEntity($(tag).text())
    const id = $(tag).attr('href')?.split("/")[4] ?? label
    if (['Adulte'].includes(label) || ['Mature'].includes(label)) {
      hentai = true
    }
    arrayTags.push({ id: id, label: label })
  }
  const tagSections: TagSection[] = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.length > 0 ? arrayTags.map(x => createTag(x)) : [] })];

  let status = MangaStatus.UNKNOWN
  switch ($('.post-content_item .summary-heading:contains("Statut")', panel).next().text().trim()) {
    case "End":
      status = MangaStatus.COMPLETED
      break;
    case "OnGoing":
      status = MangaStatus.ONGOING
      break;
    case "Dropped":
      status = MangaStatus.ABANDONED
      break;
    case "Canceled":
      status = MangaStatus.UNKNOWN
      break;
  }

  const desc = decodeHTMLEntity($('#nav-profile p').text().trim())

  return createManga({
    id: mangaId,
    titles,
    image,
    author,
    artist,
    rating,
    follows,
    status,
    tags: tagSections,
    desc,
    hentai
  })
}


//////////////////////////
/////    CHAPTERS    /////
//////////////////////////

export const parseReaperScansFRChapters = ($: CheerioStatic, mangaId: string): Chapter[] => {
  const chapters: Chapter[] = []

  for (let chapter of $('.listing-chapters_wrap .wp-manga-chapter').toArray()) {
    let id = $('a', chapter).attr('href') ?? ''
    let name = decodeHTMLEntity($('.chapter-manhwa-title', chapter).text() != '' ? $('.chapter-manhwa-title', chapter).text() : $('a', chapter).text().trim()).replace(/\w+\s{1}\d+\s?-?/gm, '').trim()
    let chapNum = Number((id.split("/").slice(-2, -1)[0].split('-')[1]))
    let time = parseDate($('.chapter-release-date', chapter).text().trim())

    chapters.push(createChapter({
      id,
      mangaId,
      name,
      langCode: LanguageCode.FRENCH,
      chapNum,
      time
    }))
  }
  return chapters
}


//////////////////////////////////
/////    CHAPTERS DETAILS    /////
//////////////////////////////////

export const parseReaperScansFRChapterDetails = ($: CheerioStatic, mangaId: string, chapterId: string): ChapterDetails => {
  const pages: string[] = []

  for (let item of $('.entry-content .reading-content .page-break img').toArray()) {
    let page = $(item).attr('src')?.trim()

    if (typeof page === 'undefined')
      continue;

    pages.push(page);
  }

  return createChapterDetails({
    id: chapterId,
    mangaId: mangaId,
    pages,
    longStrip: false
  })
}


////////////////////////
/////    SEARCH    /////
////////////////////////

export const parseSearch = ($: CheerioStatic): MangaTile[] => {
  const manga: MangaTile[] = []

  for (const item of $('.c-tabs-item .row.c-tabs-item__content').toArray()) {
    let id = $('.tab-thumb.c-image-hover a', item).attr('href')?.split("/")[4] ?? ''
    let image = $('.tab-thumb.c-image-hover a img', item).attr('src')?.replace('-193x278', '') ?? ''
    let title = decodeHTMLEntity(($('.tab-summary .post-title h3', item).text().trim()))
    let subtitle = decodeHTMLEntity($('.tab-meta .meta-item.latest-chap a', item).text().trim())

    manga.push(createMangaTile({
      id,
      image,
      title: createIconText({ text: title }),
      subtitleText: createIconText({ text: subtitle })
    }))
  }

  return manga
}


///////////////////////////
/////    HOT MANGA    /////
///////////////////////////

const parseHotManga = ($: CheerioStatic): MangaTile[] => {
  const hotManga: MangaTile[] = []

  for (var item of $('.n2-ss-slide').toArray()) {
    var url = $('.n2-ss-slide-inner', item).attr('data-href')?.split("/")[4]
    var image = `https:${$('.n2-ss-slide-background img', item).attr('src')}`
    var title = ''

    if (typeof url === 'undefined' || typeof image === 'undefined')
      continue

    if (url !== '') {
      hotManga.push(createMangaTile({
        id: url,
        image: image,
        title: createIconText({ text: title })
      }))
    }
  }

  return hotManga
}

//////////////////////////////////////////
/////    LATEST UPDATED WEBTOONS     /////
//////////////////////////////////////////

const parseLastUpdatedWebtoons = ($: CheerioStatic): MangaTile[] => {
  const lastUpdatedWebtoons: MangaTile[] = []

  for (const item of $('.latest .col-6.col-sm-6.col-md-6.col-xl-3').toArray()) {
    let url = $('.series-content a', item).attr('href')?.split("/")[4]
    let image = $('.image-series a img', item).attr('src')
    let title = decodeHTMLEntity($('.series-content a h5', item).text().trim())
    let subtitle = decodeHTMLEntity($('.info .d-flex.justify-content-between a', item).eq(0).text().trim())

    if (typeof url === 'undefined' || typeof image === 'undefined')
      continue

    lastUpdatedWebtoons.push(createMangaTile({
      id: url,
      image: image,
      title: createIconText({ text: title }),
      subtitleText: createIconText({ text: subtitle })
    }))
  }

  return lastUpdatedWebtoons
}

//////////////////////////////////////////
/////    LATEST UPDATED NOVELS     /////
//////////////////////////////////////////

const parseLastUpdatedNovels = ($: CheerioStatic): MangaTile[] => {
  const lastUpdatedNovels: MangaTile[] = []

  for (const item of $('.latest-novels .col-6.col-sm-6.col-md-6.col-xl-2').toArray()) {
    let url = $('.series-content a', item).attr('href')?.split("/")[4]
    let image = $('.image-series a img', item).attr('src')
    let title = decodeHTMLEntity($('.series-content a h5', item).text().trim())
    let subtitle = decodeHTMLEntity($('.info .d-flex.justify-content-between a', item).eq(0).text().trim())

    if (typeof url === 'undefined' || typeof image === 'undefined')
      continue

    lastUpdatedNovels.push(createMangaTile({
      id: url,
      image: image,
      title: createIconText({ text: title }),
      subtitleText: createIconText({ text: subtitle })
    }))
  }

  return lastUpdatedNovels
}

///////////////////////////////////
/////    POPULAR MANGA DAY    /////
///////////////////////////////////

const parsePopularMangaToday = ($: CheerioStatic): MangaTile[] => {
  const popularMangaToday: MangaTile[] = []

  for (const item of $('#nav-home li').toArray()) {
    let url = $('.title-and-infos a', item).attr('href')?.split("/")[4]
    let image = $('.fotinhofofa a img', item).attr('src')?.replace('-125x180', '')
    let title = decodeHTMLEntity($('.title-and-infos a h2', item).text().trim())
    let subtitle = "⭐ " + decodeHTMLEntity($('.title-and-infos .numscore', item).text().trim())

    if (typeof url === 'undefined' || typeof image === 'undefined')
      continue

    popularMangaToday.push(createMangaTile({
      id: url,
      image: image,
      title: createIconText({ text: title }),
      subtitleText: createIconText({ text: subtitle })
    }))
  }

  return popularMangaToday
}

////////////////////////////////////
/////    POPULAR MANGA WEEK    /////
////////////////////////////////////

const parsePopularMangaWeek = ($: CheerioStatic): MangaTile[] => {
  const popularMangaWeek: MangaTile[] = []

  for (const item of $('#nav-roi li').toArray()) {
    let url = $('.title-and-infos a', item).attr('href')?.split("/")[4]
    let image = $('.fotinhofofa a img', item).attr('src')?.replace('-125x180', '')
    let title = decodeHTMLEntity($('.title-and-infos a h2', item).text().trim())
    let subtitle = "⭐ " + decodeHTMLEntity($('.title-and-infos .numscore', item).text().trim())

    if (typeof url === 'undefined' || typeof image === 'undefined')
      continue

    popularMangaWeek.push(createMangaTile({
      id: url,
      image: image,
      title: createIconText({ text: title }),
      subtitleText: createIconText({ text: subtitle })
    }))
  }

  return popularMangaWeek
}

////////////////////////////////////////////
/////    POPULAR MANGA ALL THE TIME    /////
////////////////////////////////////////////

const parsePopularMangaAllTime = ($: CheerioStatic): MangaTile[] => {
  const popularMangaAllTime: MangaTile[] = []

  for (const item of $('#nav-contact li').toArray()) {
    let url = $('.title-and-infos a', item).attr('href')?.split("/")[4]
    let image = $('.fotinhofofa a img', item).attr('src')?.replace('-125x180', '')
    let title = decodeHTMLEntity($('.title-and-infos a h2', item).text().trim())
    let subtitle = "⭐ " + decodeHTMLEntity($('.title-and-infos .numscore', item).text().trim())

    if (typeof url === 'undefined' || typeof image === 'undefined')
      continue

    popularMangaAllTime.push(createMangaTile({
      id: url,
      image: image,
      title: createIconText({ text: title }),
      subtitleText: createIconText({ text: subtitle })
    }))
  }

  return popularMangaAllTime
}

//////////////////////////////
/////    HOME SECTION    /////
//////////////////////////////

export const parseHomeSections = ($: CheerioStatic, sections: HomeSection[], sectionCallback: (section: HomeSection) => void): void => {
  for (const section of sections) sectionCallback(section)

  sections[0].items = parseHotManga($)
  sections[1].items = parseLastUpdatedWebtoons($)
  sections[2].items = parseLastUpdatedNovels($)
  sections[3].items = parsePopularMangaToday($)
  sections[4].items = parsePopularMangaWeek($)
  sections[5].items = parsePopularMangaAllTime($)

  for (const section of sections) sectionCallback(section)
}

///////////////////////////
/////    VIEW MORE    /////
///////////////////////////

export const parseViewMore = ($: CheerioStatic): MangaTile[] => {
  const viewMore: MangaTile[] = []

  for (const item of $('.page-content-listing.item-big_thumbnail .page-item-detail').toArray()) {
    let id = $('.item-thumb.c-image-hover a', item).attr('href')?.split("/")[4]
    let image = $('.item-thumb.c-image-hover a img', item).attr('src')?.replace('-175x238', '')
    let title = decodeHTMLEntity($('.item-summary .post-title h3', item).text().trim())
    let subtitle = decodeHTMLEntity($('.item-summary .list-chapter .chapter a', item).eq(0).text().trim())

    if (typeof id === 'undefined' || typeof image === 'undefined')
      continue

    viewMore.push(createMangaTile({
      id,
      image,
      title: createIconText({ text: title }),
      subtitleText: createIconText({ text: subtitle })
    }))
  }

  return viewMore
}


/////////////////////////////////
/////    CHECK LAST PAGE    /////
/////////////////////////////////

export const isLastPage = ($: CheerioStatic): boolean => {
  return $('nav.navigation-ajax').length == 0
}


//////////////////////
/////    TAGS    /////
//////////////////////

export const parseTags = ($: CheerioStatic): TagSection[] => {
  const arrayTags: Tag[] = []
  for (let item of $('.genres_wrap .row.genres li').toArray()) {
    let id = $('a', item).attr('href')?.split('/')[5] ?? ''
    let label = ($('a', item).text().trim().split('\n')[0])
    arrayTags.push({ id: id, label: label })
  }

  return [createTagSection({ id: '0', label: 'genres', tags: arrayTags.map(x => createTag(x)) })]
}


///////////////////////////////
/////    UPDATED MANGA    /////
///////////////////////////////

export interface UpdatedManga {
  ids: string[];
  loadMore: boolean;
}

export const parseUpdatedManga = ($: CheerioStatic, time: Date, ids: string[]): UpdatedManga => {
  let loadMore = true
  const updatedManga: string[] = []

  for (const item of $('.page-content-listing.item-big_thumbnail .page-item-detail').toArray()) {
    let id = $('h3 a', item).attr('href')?.split("/")[4] ?? ''
    let date = parseDate($('.list-chapter .post-on', item).first().text().trim())

    if (typeof id === 'undefined' || typeof date === 'undefined')
      continue

    if (date > time) {
      if (ids.includes(id)) {
        updatedManga.push(id)
      }
    } else {
      loadMore = false
    }
  }

  return {
    ids: updatedManga,
    loadMore,
  }
}


/////////////////////////////////
/////    ADDED FUNCTIONS    /////
/////////////////////////////////

function decodeHTMLEntity(str: string) {
  return str.replace(/&#(\d+);/g, function (match, dec) {
    return String.fromCharCode(dec);
  })
}

function parseDate(str: string) {
  str = str.trim()
  if (str.length == 0) {
    let date = new Date()
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }

  if (/^(\d){2}\/(\d){2}\/(\d){4}$/.test(str)) {
    let date = str.split('/')
    return new Date(parseInt(date[2]), parseInt(date[1]) - 1, parseInt(date[0]))
  }
  else {
    let date = str.split(' ')
    let date_today = new Date()
    switch (date[1].slice(0, 2)) {
      case "s":
        return new Date(date_today.getFullYear(), date_today.getMonth(), date_today.getDate(), date_today.getHours(), date_today.getMinutes(), date_today.getSeconds() - parseInt(date[0]))
      case "mi":
        return new Date(date_today.getFullYear(), date_today.getMonth(), date_today.getDate(), date_today.getHours(), date_today.getMinutes() - parseInt(date[0]))
      case "he":
        return new Date(date_today.getFullYear(), date_today.getMonth(), date_today.getDate(), date_today.getHours() - parseInt(date[0]), date_today.getMinutes())
      case "jo":
        return new Date(date_today.getFullYear(), date_today.getMonth(), date_today.getDate() - parseInt(date[0]), date_today.getHours(), date_today.getMinutes())
      case "se":
        return new Date(date_today.getFullYear(), date_today.getMonth(), date_today.getDate() - (parseInt(date[0]) * 7), date_today.getHours(), date_today.getMinutes())
      case "mo":
        return new Date(date_today.getFullYear(), date_today.getMonth() - parseInt(date[0]), date_today.getDate(), date_today.getHours(), date_today.getMinutes())
      case "an":
        return new Date(date_today.getFullYear() - parseInt(date[0]), date_today.getMonth(), date_today.getDate(), date_today.getHours(), date_today.getMinutes())
    }
    return date_today
  }
}