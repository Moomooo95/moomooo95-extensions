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


///////////////////////////////
/////                     /////
/////    Manga Details    /////
/////                     /////
///////////////////////////////

export const parseLeCercleDuScanMangaDetails = ($: CheerioStatic, mangaId: string): Manga => {
    
    const titles = [$('.large.comic .title').text().trim()]
    const image = $('.thumbnail img').attr('src') ?? ""
    const summary = $('.large.comic .info').text().trim().substr(10).replace(/^\s+|\s+$/g, '')

    return createManga({
        id: mangaId,
        titles,
        image,
        rating: Number(null),
        status: MangaStatus.ONGOING,
        desc: summary,
        hentai : false
    })
}


//////////////////////////
/////                /////
/////    Chapters    /////
/////                /////
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
/////                        /////
/////    Chapters Details    /////
/////                        /////
//////////////////////////////////

export const parseLeCercleDuScanChapterDetails = ($: CheerioStatic, mangaId: string, chapterId: string): ChapterDetails => {
    const pages: string[] = []
    const allItems = $('.inner img').toArray()

    for(let item of allItems)
    {
        let page = $(item).attr('src')?.trim()
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
/////              /////
/////    Search    /////
/////              /////
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
/////            /////
/////    HOME    /////
/////            /////
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
    const image = ''
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


export const parseViewMore = ($: CheerioStatic, section: String): MangaTile[] => {
    switch (section) {
        case 'latest_updates':
            return parseLatestManga($)
        case 'all_manga':
            return parseAllManga($)
        default:
            return []
    }   
}

export const isLastPage = ($: CheerioStatic): boolean => {
    let total = ($('.next a').first().attr("href") ?? "").split('/')[4];
    let current = (parseInt(($('.next a').eq(1).attr("href") ?? "").split('/')[4]) - 1).toString();

    if (current) {
        total = (/(\d+)/g.exec(total) ?? [''])[0]
        return (+total) === (+current)
    }

    return true
}