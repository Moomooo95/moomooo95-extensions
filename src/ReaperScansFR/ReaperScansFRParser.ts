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
  const titles = [decodeHTMLEntity($('.entry-title').text().trim())]
  const image = $('.info-left-margin img').attr('src') ?? ""
  let follows = Number($('.bmc').text().trim().replace(/[^\d]/g, ""))
  let rating = Number($('.num').text().trim())

  let status = MangaStatus.UNKNOWN
  let author = "Unknown"
  let artist = undefined
  let lastUpdate = undefined

  const multipleInfo = $('.tsinfo.bixbox .imptdt').toArray()
  for (let info of multipleInfo) {
    let item = ($(info).html() ?? "").split("<i>")[0].trim()
    let val = $('i', info).text().trim()

    switch (item) {
      case "Statut":
        switch (val) {
          case "Terminée":
            status = MangaStatus.COMPLETED
            break;
          case "En cours":
            status = MangaStatus.ONGOING
            break;
        }
        break;
      case "Auteur(e)":
        author = val
        break;
      case "Artiste":
        artist = val
        break;
      case "Mis à jour le":
        lastUpdate = new Date(val)
        break;
      default:
        break;
    }
  }

  const arrayTags: Tag[] = []
  // Tags 
  const tags = $('.info-desc.bixbox .mgen a').toArray()
  for (const tag of tags) {
    const id = $(tag).first().attr('href')?.split("/")[4] ?? ''
    const label = capitalizeFirstLetter(decodeHTMLEntity($(tag).text()))

    arrayTags.push({ id: id, label: label })
  }
  const tagSections: TagSection[] = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.length > 0 ? arrayTags.map(x => createTag(x)) : [] })];

  let desc = decodeHTMLEntity($('.entry-content-single').text())

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
    lastUpdate,
    desc,
    hentai: false
  })
}


//////////////////////////
/////    Chapters    /////
//////////////////////////

export const parseReaperScansFRChapters = ($: CheerioStatic, mangaId: string): Chapter[] => {
  const chapters: Chapter[] = []

  for (let chapter of $('#chapterlist li').toArray()) {
    const id = $('a', chapter).attr('href') ?? ''
    const name = decodeHTMLEntity($('.chapternum', chapter).text()) != "" ? decodeHTMLEntity($('.chapternum', chapter).text()) : undefined
    const chapNum = Number($('.chapternum', chapter).text().split(' ')[1])
    const time = new Date(parseDateChap($('.chapterdate', chapter).text().trim()))

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
/////    Chapters Details    /////
//////////////////////////////////

export const parseReaperScansFRChapterDetails = ($: CheerioStatic, mangaId: string, chapterId: string): ChapterDetails => {
  const pages: string[] = []

  for (let item of $($.parseHTML($('noscript').text())).children().toArray()) {
    let page = $(item).attr('src')

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
/////    Search    /////
////////////////////////

export const parseSearch = ($: CheerioStatic): MangaTile[] => {
  const manga: MangaTile[] = []

  for (const item of $('.listupd .bs').toArray()) {
    const id = $('a', item).attr('href')?.split('/')[4] ?? ''
    const title = decodeHTMLEntity($('a', item).attr('title') ?? '')
    const image = $('img', item).attr("src") ?? ''
    const subtitle = decodeHTMLEntity($('.epxs', item).text())


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

  for (const item of $('.swiper-wrapper .swiper-slide').toArray()) {
    let url = $('a', item).first().attr('href')?.split("/")[4]
    let image = ($('.bigbanner', item).attr('style') ?? "").split('\'')[1]
    let title = decodeHTMLEntity($('.name', item).text())

    if (typeof url === 'undefined' || typeof image === 'undefined')
      continue

    hotManga.push(createMangaTile({
      id: url,
      image: image,
      title: createIconText({ text: title })
    }))
  }

  return hotManga
}

////////////////////////////////
/////    LAST RELEASES     /////
////////////////////////////////

const parseLastUpdate = ($: CheerioStatic): MangaTile[] => {
  const lastUpdate: MangaTile[] = []

  for (const item of $('.postbody .listupd').eq(1).children().toArray()) {
    let url = $('a', item).first().attr('href')?.split("/")[4]
    let image = $('img', item).attr('src')
    let title = decodeHTMLEntity($('a', item).first().attr('title') ?? '')
    let subtitle = decodeHTMLEntity($('a', item).eq(2).text())

    if (typeof url === 'undefined' || typeof image === 'undefined')
      continue

    lastUpdate.push(createMangaTile({
      id: url,
      image: image,
      title: createIconText({ text: title }),
      subtitleText: createIconText({ text: subtitle })
    }))
  }

  return lastUpdate
}

///////////////////////////////////
/////    POPULAR MANGA DAY    /////
///////////////////////////////////

const parsePopularMangaToday = ($: CheerioStatic): MangaTile[] => {
  const popularMangaToday: MangaTile[] = []

  for (const item of $('.hotslid .bs').toArray()) {
    let url = $('a', item).first().attr('href')?.split("/")[4]
    let image = $('img', item).attr('src')
    let title = decodeHTMLEntity($('a', item).first().attr('title') ?? '')
    let subtitle = decodeHTMLEntity($('.epxs', item).text())

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

  for (const item of $('.wpop-weekly li').toArray()) {
    let url = $('a', item).first().attr('href')?.split("/")[4]
    let image = $('img', item).attr('src')
    let title = decodeHTMLEntity($('.leftseries h2 a', item).text())

    if (typeof url === 'undefined' || typeof image === 'undefined')
      continue

    popularMangaWeek.push(createMangaTile({
      id: url,
      image: image,
      title: createIconText({ text: title })
    }))
  }

  return popularMangaWeek
}

/////////////////////////////////////
/////    POPULAR MANGA MONTH    /////
/////////////////////////////////////

const parsePopularMangaMonth = ($: CheerioStatic): MangaTile[] => {
  const popularMangaMonth: MangaTile[] = []

  for (const item of $('.wpop-monthly li').toArray()) {
    let url = $('a', item).first().attr('href')?.split("/")[4]
    let image = $('img', item).attr('src')
    let title = decodeHTMLEntity($('.leftseries h2 a', item).text())

    if (typeof url === 'undefined' || typeof image === 'undefined')
      continue

    popularMangaMonth.push(createMangaTile({
      id: url,
      image: image,
      title: createIconText({ text: title })
    }))
  }

  return popularMangaMonth
}

////////////////////////////////////////////
/////    POPULAR MANGA ALL THE TIME    /////
////////////////////////////////////////////

const parsePopularMangaAllTime = ($: CheerioStatic): MangaTile[] => {
  const popularMangaAllTime: MangaTile[] = []

  for (const item of $('.wpop-alltime li').toArray()) {
    let url = $('a', item).first().attr('href')?.split("/")[4]
    let image = $('img', item).attr('src')
    let title = decodeHTMLEntity($('.leftseries h2 a', item).text())

    if (typeof url === 'undefined' || typeof image === 'undefined')
      continue

    popularMangaAllTime.push(createMangaTile({
      id: url,
      image: image,
      title: createIconText({ text: title })
    }))
  }

  return popularMangaAllTime
}

/////////////////////////////////
/////    LATEST PROJECTS    /////
/////////////////////////////////

const parseLastProjects = ($: CheerioStatic): MangaTile[] => {
  const lastProjects: MangaTile[] = []

  for (const item of $('.postbody .listupd').eq(0).children().toArray()) {
    let url = $('a', item).first().attr('href')?.split("/")[3].split("-").slice(0, -1).join("-") ?? 'undefined'
    let image = $('img', item).attr('src')
    let title = decodeHTMLEntity($('a', item).first().attr('title')?.split(" ").slice(0, -1).join(" ") ?? '')
    let subtitle = decodeHTMLEntity($('.epxs', item).text())

    if (typeof url === 'undefined' || typeof image === 'undefined')
      continue

    lastProjects.push(createMangaTile({
      id: url,
      image: image,
      title: createIconText({ text: title }),
      subtitleText: createIconText({ text: subtitle })
    }))
  }

  return lastProjects
}

//////////////////////////////
/////    NEW PROJECTS    /////
//////////////////////////////

const parseNewProjects = ($: CheerioStatic): MangaTile[] => {
  const newProjects: MangaTile[] = []

  for (const item of $('.section .serieslist').eq(3).find('li').toArray()) {
    let url = $('a', item).first().attr('href')?.split("/")[4]
    let image = $('img', item).attr('src')
    let title = decodeHTMLEntity($('h2', item).text().trim())

    if (typeof url === 'undefined' || typeof image === 'undefined')
      continue

    newProjects.push(createMangaTile({
      id: url,
      image: image,
      title: createIconText({ text: title })
    }))
  }

  return newProjects
}

//////////////////////////////
/////    HOME SECTION    /////
//////////////////////////////

export const parseHomeSections = ($: CheerioStatic, sections: HomeSection[], sectionCallback: (section: HomeSection) => void): void => {
  for (const section of sections) sectionCallback(section)

  const hotManga: MangaTile[] = parseHotManga($)
  const LastUpdate: MangaTile[] = parseLastUpdate($)
  const popularMangaToday: MangaTile[] = parsePopularMangaToday($)
  const popularMangaWeek: MangaTile[] = parsePopularMangaWeek($)
  const popularMangaMonth: MangaTile[] = parsePopularMangaMonth($)
  const popularMangaAllTime: MangaTile[] = parsePopularMangaAllTime($)
  const LastProjects: MangaTile[] = parseLastProjects($)
  const NewProjects: MangaTile[] = parseNewProjects($)

  sections[0].items = hotManga
  sections[1].items = LastUpdate
  sections[2].items = popularMangaToday
  sections[3].items = popularMangaWeek
  sections[4].items = popularMangaMonth
  sections[5].items = popularMangaAllTime
  sections[6].items = LastProjects
  sections[7].items = NewProjects

  for (const section of sections) sectionCallback(section)
}

///////////////////////////
/////    VIEW MORE    /////
///////////////////////////

export const parseViewMore = ($: CheerioStatic): MangaTile[] => {
  const viewMore: MangaTile[] = []

  for (const item of $('.postbody .listupd').eq(0).children().toArray()) {
    let url = $('a', item).first().attr('href')?.split("/")[4] ?? 'undefined'
    let image = $('img', item).attr('src')
    let title = decodeHTMLEntity($('a', item).first().attr('title') ?? '')
    let subtitle = decodeHTMLEntity($('.epxs', item).text())

    if (typeof url === 'undefined' || typeof image === 'undefined')
      continue

    viewMore.push(createMangaTile({
      id: url,
      image: image,
      title: createIconText({ text: title }),
      subtitleText: createIconText({ text: subtitle })
    }))
  }

  return viewMore
}


/////////////////////////////////
/////    CHECK LAST PAGE    /////
/////////////////////////////////

export const isLastPage = ($: CheerioStatic, section: String): boolean => {
  switch (section) {
    case 'latest_projects':
      return $('.next.page-numbers').length == 0
    case 'latest_updated':
      return $('.hpage .r').length == 0
    case 'search':
      return $('.next.page-numbers').length == 0
    case 'search_tags':
      return $('.hpage .r').length == 0
    default:
      return false
  }
}


//////////////////////
/////    TAGS    /////
//////////////////////

export const parseTags = ($: CheerioStatic): TagSection[] => {
  const arrayTags: Tag[] = []

  for (let item of $('.dropdown-menu.c4.genrez li').toArray()) {
    let id = $('input', item).attr('value') ?? ''
    let label = capitalizeFirstLetter(decodeHTMLEntity($('label', item).text()))
    arrayTags.push({ id: id, label: label })
  }
  const tagSections: TagSection[] = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.map(x => createTag(x)) })]

  return tagSections
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

  for (const item of $('.postbody .listupd').eq(1).find('.utao.styletwo').toArray()) {
    let id = ($('a', item).first().attr('href') ?? '').split('/').slice(-2, -1)[0]
    let mangaTime = parseDate(($('.luf span', item).text() ?? '').trim().split('Il y a ')[1])

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


function parseDateChap(str: string) {
  str = str.trim()
  if (str.length == 0) {
    let date = new Date()
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }

  var month = str.split(' ')[0]
  switch (month) {
    case "janvier":
      return str.replace(month, "january")
    case "février":
      return str.replace(month, "february")
    case "mars":
      return str.replace(month, "march")
    case "avril":
      return str.replace(month, "april")
    case "mai":
      return str.replace(month, "may")
    case "juin":
      return str.replace(month, "june")
    case "juillet":
      return str.replace(month, "july")
    case "août":
      return str.replace(month, "august")
    case "septembre":
      return str.replace(month, "september")
    case "octobre":
      return str.replace(month, "october")
    case "novembre":
      return str.replace(month, "november")
    case "décembre":
      return str.replace(month, "december")
    default:
      return new Date()
  }
}

function parseDate(str: string) {
  str = str.trim()
  if (str.length == 0) {
    let date = new Date()
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }

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

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}