import cheerio from "cheerio";
import {
    Chapter,
    ChapterDetails,
    HomeSection,
    LanguageCode,
    Manga, 
    MangaStatus,
    MangaTile,
    MangaUpdates,
    PagedResults,
    SearchRequest,
    TagSection 
} from "paperback-extensions-common";

import { 
    parseJsonText
} from "typescript";

import { LeCercleDuScan } from "./LeCercleDuScan";


///////////////////////////////
/////    Manga Details    /////
///////////////////////////////

export const parseLeCercleDuScanMangaDetails = ($: CheerioStatic, mangaId: string): Manga => {
    
    const titles = [$('.large.comic .title').text().trim()]
    const image = $('.thumbnail img').attr('src') ?? ""

    const multipleInfo = $('.large.comic .info').text().trim().split(/  +/g)

    let author = "Unknown"
    let artist = undefined
    let summary = undefined
    
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
        status: MangaStatus.ONGOING,
        desc: summary,
        hentai : false
    })
}


//////////////////////////
/////    Chapters    /////
//////////////////////////

export const parseLeCercleDuScanChapters = ($: CheerioStatic, mangaId: string): Chapter[] => {
    const allChapters = $('.list .element')
    const chapters: Chapter[] = []
    
    for (let chapter of allChapters.toArray()) {
      const id: string = $('.title a', chapter).attr('href') ?? ''
      const name: string = $('.title a', chapter).text() ?? ''
      const chapNum: number = Number( id.split('/')[7] )
      const time: Date = new Date($('.meta_r', chapter).text().split(',').pop()?.trim() ?? '')

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

export const parseLeCercleDuScanChapterDetails = ($: CheerioStatic, mangaId: string, chapterId: string): ChapterDetails => {
    const pages: string[] = []
    const allItems = JSON.parse(($('script').eq(3).html() ?? "").split('\n')[2].split('=')[1].slice(0,-1))

    for(let item of allItems)
    {
        let page = item.url
        console.log(page)

        // If page is undefined, dont push it
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

export const generateSearch = (query: SearchRequest): string => {
    let keyword = (query.title ?? '').replace(/ /g, '_')
    if (query.author)
      keyword += (query.author ?? '').replace(/ /g, '_')
    let search: string = `${keyword}`
  
    return search
}
  
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


//////////////////////
/////    HOME    /////
//////////////////////


    //////////////////////////////////////////
    /////    DEFINITIONS DES SECTIONS    /////
    //////////////////////////////////////////


              //////////////////////////////////////
              /////    DERNIERS MANGA SORTI    /////
              //////////////////////////////////////

const parseLatestManga = ($: CheerioStatic): MangaTile[] => {
  const latestManga: MangaTile[] = []

  for (const item of $('.group').toArray()) {
    const url = $('a', item).first().attr('href')?.split('/')[4] ?? ''
    const title = $('a', item).first().text()
    const image = ""
    const subtitle = $('a', item).eq(2).text()
    
    console.log(url + " " + image + " " + title + " " + subtitle)

    // Credit to @GameFuzzy
    // Checks for when no id or image found
    if (typeof url === 'undefined' || typeof image === 'undefined') 
      continue

    latestManga.push(createMangaTile({
      id: url,
      image: image,
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

    // Credit to @GameFuzzy
    // Checks for when no id or image found
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

  // Perform the callbacks again now that the home page sections are filled with data
  for (const section of sections) sectionCallback(section)
}


///////////////////////////////////
/////    SECTION ALL MANGA    /////
///////////////////////////////////

export const parseMangaSectionTiles = ($: CheerioStatic, sections: HomeSection[], sectionCallback: (section: HomeSection) => void): void => {
    for (const section of sections) sectionCallback(section)
    const allManga: MangaTile[] = parseAllManga($)

    sections[0].items = allManga

    // Perform the callbacks again now that the home page sections are filled with data
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


////////////////////////////
/////    isLastPage    /////
////////////////////////////

export const isLastPage = ($: CheerioStatic): boolean => {
    return (($('.next a').first().length == 0) ? true : false)
}