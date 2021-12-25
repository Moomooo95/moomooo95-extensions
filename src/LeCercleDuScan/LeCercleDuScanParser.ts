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
  const titles = [$('.large.comic .title').text().trim()]
  const image = $('.thumbnail img').attr('src') ?? ""
  
  let author = "Unknown"
  let artist = undefined
  let summary = undefined

  const multipleInfo = $('.large.comic .info').text().trim().split(/  +/g)
  for (let info of multipleInfo)
  {
    let item = info.split(":")
    switch (item[0]) {
      case "Author":
        author = item[1]
        break;
      case "Artist":
        artist = item[1]
        break;
      case "Synopsis":
        summary = item[1]
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
    rating: Number(null),
    status: MangaStatus.UNKNOWN,
    desc: summary,
    hentai : false
  })
}


//////////////////////////
/////    CHAPTERS    /////
//////////////////////////

export const parseLeCercleDuScanChapters = ($: CheerioStatic, mangaId: string): Chapter[] => {
  const allChapters = $('.list .element')
  const chapters: Chapter[] = []
  
  for (let chapter of allChapters.toArray()) {
    const id: string = $('.title a', chapter).attr('href') ?? ''
    const name: string = $('.title a', chapter).text() ?? ''
    const volume: number = Number($(chapter).parent().children('.title').text().trim().split(' ').pop())
    const chapNum: number = Number( id.split('/')[7] )
    const time: Date = parseDate($('.meta_r', chapter).text().split(',').pop() ?? '')

    if (isNaN(volume)) {
      chapters.push(createChapter({
        id,
        mangaId,
        name,
        langCode: LanguageCode.FRENCH,
        chapNum,
        time
      }))
    }
    else {
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
    
  }

  return chapters
}
  

//////////////////////////////////
/////    CHAPTERS DETAILS    /////
//////////////////////////////////

export const parseLeCercleDuScanChapterDetails = ($: CheerioStatic, mangaId: string, chapterId: string): ChapterDetails => {
  const pages: string[] = []
  const allItems = JSON.parse(($('script').eq(3).html() ?? "").split('\n')[2].split('=')[1].slice(0,-1))

  for(let item of allItems) {
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
    const title = $('a', item).first().text()
    const image = ''
    const subtitle = $('a', item).eq(1).text()

    manga.push(createMangaTile({
      id : url,
      image,
      title: createIconText({ text: title }),
      subtitleText : createIconText({ text: subtitle })
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
    const title = $('a', item).first().text()
    const image = ''
    const subtitle = $('a', item).eq(2).text()

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
    const title = $('a', item).eq(1).text()
    const image = $('.preview', item).attr('src')
    const subtitle = $('a', item).eq(2).text()

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


/////////////////////////////////
/////    ADDED FUNCTIONS    /////
/////////////////////////////////

export function parseDate(str: string) {
  if (str.length == 0)
  {
    let date = new Date()
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }

  switch (str.trim()) {
    case "Aujourd'hui":
      let today = new Date()
      return new Date(today.getFullYear(), today.getMonth(), today.getDate())

    case "Hier":
      let yesterday = new Date()
      return new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()-1)

    default:
      let date = str.split(".")
      return new Date(parseInt(date[0]), parseInt(date[1])-1, parseInt(date[2]))
  }
}