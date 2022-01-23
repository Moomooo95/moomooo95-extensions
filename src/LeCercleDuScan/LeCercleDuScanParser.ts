import {
  Chapter,
  ChapterDetails,
  HomeSection,
  LanguageCode,
  Manga,
  MangaStatus,
  MangaTile
} from "paperback-extensions-common";


///////////////////////////////
/////    MANGA DETAILS    /////
///////////////////////////////

export const parseLeCercleDuScanMangaDetails = ($: CheerioStatic, mangaId: string): Manga => {
  const titles = [decodeHTMLEntity($('.large.comic .title').text().trim())]
  const image = $('.thumbnail img').attr('src') ?? ""

  let author = "Unknown"
  let artist = undefined
  let desc = undefined

  const multipleInfo = $('.large.comic .info').text().trim().split(/  +/g)
  for (let info of multipleInfo) {
    let item = info.split(":")
    switch (item[0]) {
      case "Author":
        author = item[1]
        break;
      case "Artist":
        artist = item[1]
        break;
      case "Synopsis":
        desc = decodeHTMLEntity(item[1])
        break;
      default:
        break;
    }
  }

  return createManga({
    id: mangaId,
    titles,
    image,
    author,
    artist,
    status: MangaStatus.UNKNOWN,
    desc,
    hentai: false
  })
}


//////////////////////////
/////    CHAPTERS    /////
//////////////////////////

export const parseLeCercleDuScanChapters = ($: CheerioStatic, mangaId: string): Chapter[] => {
  const chapters: Chapter[] = []

  for (let chapter of $('.list .element').toArray()) {
    const id = $('.title a', chapter).attr('href') ?? ''
    const name = decodeHTMLEntity($('.title a', chapter).text() ?? '') != '' ? decodeHTMLEntity($('.title a', chapter).text() ?? '') : undefined
    const volume = !isNaN(Number($(chapter).parent().children('.title').text().trim().split(' ').pop())) ? Number($(chapter).parent().children('.title').text().trim().split(' ').pop()) : undefined
    const chapNum = Number(id.split('/')[7])
    const time = parseDate($('.meta_r', chapter).text().split(',').pop() ?? '')

    chapters.push(createChapter({
      id,
      mangaId,
      name,
      langCode: LanguageCode.FRENCH,
      chapNum,
      volume,
      time
    }))

  }

  return chapters
}


//////////////////////////////////
/////    CHAPTERS DETAILS    /////
//////////////////////////////////

export const parseLeCercleDuScanChapterDetails = ($: CheerioStatic, mangaId: string, chapterId: string): ChapterDetails => {
  const pages: string[] = []

  for (let item of JSON.parse(($('script').eq(3).html() ?? "").split('\n')[2].split('=')[1].slice(0, -1))) {
    let page = item.url

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

  for (const item of $('.list .group').toArray()) {
    const url = $('a', item).first().attr('href')?.split('/')[4] ?? ''
    const title = decodeHTMLEntity($('a', item).first().text())
    const image = ''
    const subtitle = decodeHTMLEntity($('a', item).eq(1).text())

    manga.push(createMangaTile({
      id: url,
      image,
      title: createIconText({ text: title }),
      subtitleText: createIconText({ text: subtitle })
    }))
  }

  return manga
}


//////////////////////////////////////
/////    DERNIERS MANGA SORTI    /////
//////////////////////////////////////

const parseLatestManga = ($: CheerioStatic): MangaTile[] => {
  const latestManga: MangaTile[] = []

  for (const item of $('.group').toArray()) {
    const url = $('a', item).first().attr('href')?.split('/')[4] ?? ''
    const title = decodeHTMLEntity($('a', item).first().text())
    const image = ''
    const subtitle = decodeHTMLEntity($('a', item).eq(2).text())

    if (typeof url === 'undefined' || typeof image === 'undefined')
      continue

    latestManga.push(createMangaTile({
      id: url,
      image,
      title: createIconText({ text: title }),
      subtitleText: createIconText({ text: subtitle }),
    }))
  }

  return latestManga
}

////////////////////////////////
/////    TOUS LES MANGA    /////
////////////////////////////////

const parseAllManga = ($: CheerioStatic): MangaTile[] => {
  const allManga: MangaTile[] = []

  for (const item of $('.group').toArray()) {
    const url = $('a', item).first().attr('href')?.split('/')[4] ?? ''
    const title = decodeHTMLEntity($('a', item).eq(1).text())
    const image = $('.preview', item).attr('src')
    const subtitle = decodeHTMLEntity($('a', item).eq(2).text())

    if (typeof url === 'undefined' || typeof image === 'undefined')
      continue

    allManga.push(createMangaTile({
      id: url,
      image: image,
      title: createIconText({ text: title }),
      subtitleText: createIconText({ text: subtitle }),
    }))
  }

  return allManga
}

//////////////////////////////
/////    HOME SECTION    /////
//////////////////////////////

export const parseHomeSections = ($: CheerioStatic, sections: HomeSection[], sectionCallback: (section: HomeSection) => void): void => {
  for (const section of sections) sectionCallback(section)
  const latestManga: MangaTile[] = parseLatestManga($)

  sections[0].items = latestManga

  for (const section of sections) sectionCallback(section)
}

//////////////////////////////////
/////    HOME SECTION TWO    /////
//////////////////////////////////

export const parseMangaSectionOthers = ($: CheerioStatic, sections: HomeSection[], sectionCallback: (section: HomeSection) => void): void => {
  for (const section of sections) sectionCallback(section)
  const allManga: MangaTile[] = parseAllManga($)

  sections[0].items = allManga

  for (const section of sections) sectionCallback(section)
}

///////////////////////////
/////    VIEW MORE    /////
///////////////////////////

export const parseViewMore = ($: CheerioStatic, section: string): MangaTile[] => {
  switch (section) {
    case 'latest_updates':
      return parseLatestManga($)
    case 'all_manga':
      return parseAllManga($)
    default:
      return []
  }
}

/////////////////////////////////
/////    CHECK LAST PAGE    /////
/////////////////////////////////

export const isLastPage = ($: CheerioStatic): boolean => {
  return $('.next').length == 0
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

  for (const item of $('.group').toArray()) {
    let id = ($('a', item).first().attr('href') ?? '').split('/').slice(-2, -1)[0]
    let mangaTime = parseDate($('.meta_r', item).text().split(',').pop() ?? '')

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
  if (str.length == 0) {
    let date = new Date()
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }

  switch (str.trim()) {
    case "Aujourd'hui":
      let today = new Date()
      return new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes())

    case "Hier":
      let yesterday = new Date()
      return new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate() - 1, yesterday.getHours(), yesterday.getMinutes())

    default:
      let date = str.split(".")
      return new Date(parseInt(date[0]), parseInt(date[1]) - 1, parseInt(date[2]))
  }
}