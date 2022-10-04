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

export const parseMangasOriginesDetails = ($: CheerioStatic, mangaId: string): Manga => {
  const panel = $('.container .tab-summary')

  const titles = [decodeHTMLEntity($('.container .post-title h1').text().trim())]
  const image = $('img', panel).attr('data-src') == undefined ? encodeURI(($('img', panel).attr('src') ?? "").trim().replace(/-[75]+x(\w)+/gm, '')) : encodeURI(($('img', panel).attr('data-src') ?? "").trim().replace(/-[75]+x(\w)+/gm, ''))
  const author = $('[href*=manga-author]', panel).text().trim() ?? undefined
  const artist = $('[href*=manga-artist]', panel).text().trim() ?? undefined

  const rating = Number($('.post-total-rating .score', panel).text().trim())
  const views = convertNbViews(($('.post-content_item .summary-heading:contains("Rang")', panel).next().text().trim().match(/(\d+\.?\d*\w?) /gm) ?? '')[0].trim()) ?? undefined
  let hentai = false

  let otherTitles = $('.post-content_item .summary-heading:contains("Autre")', panel).next().text().trim().split(',')
  for (let title of otherTitles) {
    titles.push(decodeHTMLEntity(title.trim()))
  }

  const arrayTags: Tag[] = []
  for (const tag of $('[href*=manga-genre]', panel).toArray()) {
    const label = decodeHTMLEntity($(tag).text())
    const id = $(tag).attr('href')?.split("/")[4] ?? label
    if (['Adulte'].includes(label) || ['Hentai'].includes(label) || ['Sexe'].includes(label) || ['Uncensored'].includes(label)) {
      hentai = true
    }
    arrayTags.push({ id, label })
  }
  const tags: TagSection[] = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.length > 0 ? arrayTags.map(x => createTag(x)) : [] })];

  let status = MangaStatus.UNKNOWN
  switch ($('.post-content_item .summary-heading:contains("STATUS")', panel).next().text().trim().replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')) {
    case "Complété":
      status = MangaStatus.COMPLETED
      break;
    case "En cours":
      status = MangaStatus.ONGOING
      break;
    case "Annulé":
      status = MangaStatus.ABANDONED
      break;
    case "En pause":
      status = MangaStatus.HIATUS
      break;
  }

  const desc = decodeHTMLEntity($('.manga-excerpt', panel).text().trim())

  return createManga({
    id: mangaId,
    titles,
    image,
    author,
    artist,
    rating,
    status,
    tags,
    views,
    desc,
    hentai
  })
}


///////////////////////////////
/////    CHAPTERS LIST    /////
///////////////////////////////

export const parseMangasOriginesChapters = ($: CheerioStatic, mangaId: string): Chapter[] => {
  const chapters: Chapter[] = []

  for (let chapter of $('.wp-manga-chapter').toArray()) {
    const id = $('a', chapter).first().attr('href') + "?style=list" ?? ''
    const chapNum = Number(($('a', chapter).first().text().trim().match(/(\d+)(\.?)(\d*)/gm) ?? '')[0])
    const time = parseDate($('.chapter-release-date i', chapter).text() != '' ? $('.c-new-tag', chapter).attr('title') ?? '' : $('.chapter-release-date i', chapter).text())

    chapters.push(createChapter({
      id,
      mangaId,
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

export const parseMangasOriginesChapterDetails = ($: CheerioStatic, mangaId: string, chapterId: string): ChapterDetails => {
  const pages: string[] = []

  for (let item of $('.container .reading-content img').toArray()) {
    let page = $(item).attr('src') == undefined ? encodeURI($(item).attr('data-src')!.trim()) : encodeURI($(item).attr('src')!.trim())

    if (typeof page === 'undefined')
      continue;

    pages.push(page);
  }

  return createChapterDetails({
    id: chapterId,
    mangaId,
    pages,
    longStrip: false
  })
}


////////////////////////
/////    SEARCH    /////
////////////////////////

export const parseSearch = ($: CheerioStatic): MangaTile[] => {
  const manga: MangaTile[] = []

  for (const item of $('.row .c-tabs-item__content').toArray()) {
    const id = $('h3 a', item).attr('href')?.split('/')[4] ?? ''
    const title = decodeHTMLEntity($('h3 a', item).text()) ?? ''
    const image = getURLImage($, item)
    const subtitle = decodeHTMLEntity($('.latest-chap .chapter a', item).text())

    manga.push(createMangaTile({
      id,
      image,
      title: createIconText({ text: title }),
      subtitleText: createIconText({ text: subtitle })
    }))
  }

  return manga
}


/////////////////////
/////    HOT    /////
/////////////////////

const parseHotManga = ($: CheerioStatic): MangaTile[] => {
  const hotManga: MangaTile[] = []

  for (const item of $('.container .manga-slider .slider__container .slider__item').toArray()) {
    let id = $('h4 a', item).attr('href')?.split("/")[4]
    let image = encodeURI(($('img', item).attr('src') ?? "").trim())
    let title = decodeHTMLEntity($('h4', item).text().trim())

    if (typeof id === 'undefined' || typeof image === 'undefined')
      continue

    hotManga.push(createMangaTile({
      id,
      image,
      title: createIconText({ text: title })
    }))
  }

  return hotManga
}

////////////////////////////////
/////    LATEST UPDATED    /////
////////////////////////////////

const parseLatestUpdatedManga = ($: CheerioStatic): MangaTile[] => {
  const latestUpdatedManga: MangaTile[] = []

  for (const item of $('#loop-content .page-item-detail.manga').toArray()) {
    let id = $('h3 a', item).attr('href')?.split("/")[4]
    let image = getURLImage($, item)
    let title = decodeHTMLEntity($('h3 a', item).text().trim())
    let subtitle = decodeHTMLEntity($('.chapter-item .chapter.font-meta', item).eq(0).text().trim())

    if (typeof id === 'undefined' || typeof image === 'undefined')
      continue

    latestUpdatedManga.push(createMangaTile({
      id,
      image,
      title: createIconText({ text: title }),
      subtitleText: createIconText({ text: subtitle })
    }))
  }

  return latestUpdatedManga
}

////////////////////////
/////    TRENDS    /////
////////////////////////

const parseTrendsManga = ($: CheerioStatic): MangaTile[] => {
  const popularOriginsExclusives: MangaTile[] = []

  for (const item of $('#block-7 .item').toArray()) {
    let id = $('h3 a', item).attr('href')?.split("/")[4]
    let image = getURLImage($, item)
    let title = $('h3 a', item).text().trim()

    if (typeof id === 'undefined' || typeof image === 'undefined')
      continue

    popularOriginsExclusives.push(createMangaTile({
      id,
      image,
      title: createIconText({ text: title })
    }))
  }

  return popularOriginsExclusives
}

//////////////////////////////
/////    POPULAR WEEK    /////
//////////////////////////////

const parsePopularWeekManga = ($: CheerioStatic): MangaTile[] => {
  const popularWeekManga: MangaTile[] = []

  for (const item of $('.widget-content .popular-item-wrap').toArray()) {
    let id = $('h5 a', item).attr('href')?.split("/")[4]
    let image = getURLImage($, item)
    let title = decodeHTMLEntity($('h5 a', item).text().trim())
    let subtitle = decodeHTMLEntity($('.chapter-item .chapter.font-meta', item).eq(0).text().trim())

    if (typeof id === 'undefined' || typeof image === 'undefined')
      continue

    popularWeekManga.push(createMangaTile({
      id,
      image,
      title: createIconText({ text: title }),
      subtitleText: createIconText({ text: subtitle })
    }))
  }

  return popularWeekManga
}

//////////////////////////////
/////    HOME SECTION    /////
//////////////////////////////

export const parseHomeSections = ($: CheerioStatic, sections: HomeSection[], sectionCallback: (section: HomeSection) => void): void => {
  for (const section of sections) sectionCallback(section)
  sections[0].items = parseHotManga($)
  sections[1].items = parseLatestUpdatedManga($)
  sections[2].items = parseTrendsManga($)
  sections[3].items = parsePopularWeekManga($)

  for (const section of sections) sectionCallback(section)
}

///////////////////////////
/////    VIEW MORE    /////
///////////////////////////

export const parseViewMore = ($: CheerioStatic): MangaTile[] => {
  const viewMore: MangaTile[] = []

  for (const item of $('.page-content-listing.item-default .page-item-detail.manga').toArray()) {
    let id = $('h3 a', item).attr('href')?.split("/")[4]
    let image = getURLImage($, item)
    let title = decodeHTMLEntity($('h3 a', item).text().trim())
    let subtitle = decodeHTMLEntity($('.chapter-item .chapter', item).eq(0).text().trim())

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
  return $('.error-404.not-found').length != 0
}


//////////////////////
/////    TAGS    /////
//////////////////////

export const parseTags = ($: CheerioStatic): TagSection[] => {
  const arrayGenres: Tag[] = []
  const arrayGenresConditions: Tag[] = []
  const arrayAdultContent: Tag[] = []
  const arrayStatutManga: Tag[] = []

  // Genres
  for (let item of $('#search-advanced .checkbox-group .checkbox').toArray()) {
    let id = $('input', item).attr('value') ?? ''
    let label = decodeHTMLEntity($('label', item).text().trim())

    arrayGenres.push({ id, label })
  }
  // Genres Conditions
  for (let item of $('#search-advanced .form-group .form-control').eq(0).children().toArray()) {
    let id = $(item).attr('value') ?? ''
    let label = decodeHTMLEntity($(item).text().trim())

    arrayGenresConditions.push({ id, label })
  }
  // Adult Content
  for (let item of $('#search-advanced .form-group .form-control').eq(4).children().toArray()) {
    let id = $(item).attr('value') ?? ''
    let label = decodeHTMLEntity($(item).text().trim())

    arrayAdultContent.push({ id, label })
  }
  // Statut
  for (let item of $('#search-advanced .form-group').eq(6).children('.checkbox-inline').toArray()) {
    let id = $('input', item).attr('value') ?? ''
    let label = decodeHTMLEntity($('label', item).text().trim().replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, ''))

    arrayStatutManga.push({ id, label })
  }

  return [
    createTagSection({ id: '0', label: 'Genres', tags: arrayGenres.map(x => createTag(x)) }),
    createTagSection({ id: '1', label: 'Genres Conditions', tags: arrayGenresConditions.map(x => createTag(x)) }),
    createTagSection({ id: '2', label: 'Contenu pour adulte', tags: arrayAdultContent.map(x => createTag(x)) }),
    createTagSection({ id: '3', label: 'Statut', tags: arrayStatutManga.map(x => createTag(x)) })
  ]
}


///////////////////////////////
/////    UPDATED MANGA    /////
///////////////////////////////

export interface UpdatedManga {
  ids: string[];
  loadMore: boolean;
}

export const parseUpdatedManga = ($: CheerioStatic, time: Date, ids: string[]): UpdatedManga => {
  const manga: string[] = []
  let loadMore = true

  for (const item of $('.page-content-listing.item-default .page-item-detail.manga').toArray()) {
    let id = ($('h3 a', item).attr('href') ?? '').split('/').slice(-2, -1)[0]
    let mangaTime = parseDate($('.post-on.font-meta', item).eq(0).find('a').attr('title') ?? '')

    if (mangaTime > time)
      if (ids.includes(id))
        manga.push(id)
      else loadMore = false
  }

  return {
    ids: manga,
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

  if (/^(\d){1,2} (\D)+ (\d){4}$/.test(str)) {
    let date = str.split(' ')
    let year = date[2]
    let months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
    let month = months.findIndex((element) => element == date[1]).toString()
    let day = date[0]

    return new Date(parseInt(year), parseInt(month), parseInt(day))
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

function convertNbViews(str: string) {
  let views = undefined
  let number = parseInt((str.match(/(\d+\.?\d?)/gm) ?? "")[0])
  let unit = (str.match(/[a-zA-Z]/gm) ?? "")[0]

  switch (unit) {
    case "K":
      views = number * 1e3
      break;
    case "M":
      views = number * 1e6
      break;
    default:
      views = number
      break;
  }
  return Number(views)
}

function getURLImage($ : CheerioStatic, item: CheerioElement) {
  let image = undefined
  if ($('img', item).attr('srcset') != undefined) {
    image = encodeURI((($('img', item).attr('srcset') ?? "").split(',').pop() ?? "").trim().split(' ')[0].replace(/-[1,3](\w){2}x(\w){3}[.]{1}/gm, '.'))
  }
  else if ($('img', item).attr('data-srcset') != undefined) {
    image = encodeURI((($('img', item).attr('data-srcset') ?? "").split(',').pop() ?? "").trim().split(' ')[0].replace(/-[1,3](\w){2}x(\w){3}[.]{1}/gm, '.'))
  }
  else if ($('img', item).attr('data-src') != undefined) {
    image = encodeURI(($('img', item).attr('data-src') ?? "").trim().replace(/-[1,3](\w){2}x(\w){3}[.]{1}/gm, '.'))
  }
  else {
    image = encodeURI(($('img', item).attr('src') ?? "").trim().replace(/-[75]+x(\w)+[.]{1}/gm, '.'))
  }

  return image
}

