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
    Tag,
    TagSection 
} from "paperback-extensions-common";

import { 
    parseJsonText
} from "typescript";




///////////////////////////////
/////    Manga Details    /////
///////////////////////////////

export const parseReaperScansDetails = ($: CheerioStatic, mangaId: string): Manga => {
    
  const titles = [$('.entry-title').text().trim()]
  const image = $('.info-left-margin img').attr('src') ?? ""

  

  let follows = Number($('.bmc').text().trim().replace(/[^\d]/g, ""))
  
  let rating = Number($('.num').text().trim())
  
  const multipleInfo = $('.tsinfo.bixbox .imptdt').toArray()

  let status = MangaStatus.ONGOING
  let author = "Unknown"
  let artist = undefined
  let lastUpdate = undefined
    
  for (let info of multipleInfo)
  {
    let item = ($(info).html() ?? "").split("<i>")[0].trim()
    let val = $('i', info).text().trim()

    switch (item) {
      case "Statut":
        status = val == "Terminée" ? MangaStatus.COMPLETED : MangaStatus.ONGOING
        break;
      case "Auteur(e)":
        author = val
        break;
      case "Artiste":
        artist = val
        break;
      case "Mis à jour le":
        lastUpdate = val
        break;
      default:
        break;
    }
  }

  let hentai = false

  const arrayTags: Tag[] = []
    
  // Tags 
  const tags = $('.info-desc.bixbox .mgen a').toArray()
  for (const tag of tags) {
    const label = $(tag).text()
    const id = $(tag).first().attr('href')?.split("/")[4] ?? label

    if (['Mature'].includes(label)) {
        hentai = true;
    }

    arrayTags.push({ id: id, label: label })
  }

  const tagSections: TagSection[] = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.length > 0 ? arrayTags.map(x => createTag(x)) : [] })];

  let summary = decodeHTMLEntity($('.entry-content-single').text())



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
      desc: summary,
      hentai : false
  })
}


//////////////////////////
/////                /////
/////    Chapters    /////
/////                /////
//////////////////////////

export const parseReaperScansChapters = ($: CheerioStatic, mangaId: string): Chapter[] => {
  const allChapters = $('#chapterlist')
  const chapters: Chapter[] = []
  
  for (let chapter of $('li', allChapters).toArray()) {
    const id: string = $('a', chapter).attr('href') ?? ''
    const name: string = $('.chapternum', chapter).text()
    const chapNum: number = Number( $('.chapternum', chapter).text().split(' ')[1] )
    const time: Date = new Date(parseDate($('.chapterdate', chapter).text()))

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

export const parseReaperScansChapterDetails = ($: CheerioStatic, mangaId: string, chapterId: string): ChapterDetails => {
  const pages: string[] = []
  const allItems = $('#readerarea img').toArray()

  for(let item of allItems)
  {
      let page = $(item).attr('src')
      console.log("page = " + page)

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

export const parseSearch = ($: CheerioStatic): MangaTile[] => {
  const manga: MangaTile[] = []

  for (const item of $('.listupd .bs').toArray()) {
      const url = $('a', item).attr('href')?.split('/')[4] ?? ''
      const title = $('a', item).attr('title') ?? ''
         
      const image = $('img', item).attr("src") ?? ''
      const subtitle = $('.epxs', item).text()
  
  
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

const parseHotManga = ($: CheerioStatic): MangaTile[] => {
  const hotManga: MangaTile[] = []

  for (const item of $('.swiper-wrapper .swiper-slide').toArray()) {
    let url = $('a', item).first().attr('href')?.split("/")[4]
    let image = ($('.bigbanner', item).attr('style') ?? "").split('\'')[1]
    let title = $('.name', item).text()
    let subtitle = ""
    
    console.log(url + " " + image + " " + title + " " + subtitle)

    // Credit to @GameFuzzy
    // Checks for when no id or image found
    if (typeof url === 'undefined' || typeof image === 'undefined') 
      continue

      hotManga.push(createMangaTile({
      id: url,
      image: image,
      title: createIconText({ text: title }),
      subtitleText: createIconText({ text: subtitle }),
    }))
  }

  return hotManga
}


              //////////////////////////////////////
              /////    MANGA POPULAIRE JOUR    /////
              //////////////////////////////////////

const parsePopularMangaToday = ($: CheerioStatic): MangaTile[] => {
  const popularMangaToday: MangaTile[] = []

  for (const item of $('.hotslid .bs').toArray()) {
    let url = $('a', item).first().attr('href')?.split("/")[4]
    let image = $('img', item).attr('src')
    let title = $('a', item).first().attr('title') ?? ''
    let subtitle = $('.epxs', item).text()

    //console.log(url + " " + image + " " + title + " " + subtitle)

    // Credit to @GameFuzzy
    // Checks for when no id or image found
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


              /////////////////////////////////////////
              /////    MANGA POPULAIRE SEMAINE    /////
              /////////////////////////////////////////

const parsePopularMangaWeek = ($: CheerioStatic): MangaTile[] => {
  const popularMangaWeek: MangaTile[] = []

  for (const item of $('.wpop-weekly li').toArray()) {
    let url = $('a', item).first().attr('href')?.split("/")[4]
    let image = $('img', item).attr('src')
    let title = $('.leftseries h2 a', item).text()
    let subtitle = ""

    console.log(url + " " + image + " " + title + " " + subtitle)

    // Credit to @GameFuzzy
    // Checks for when no id or image found
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


              //////////////////////////////////////
              /////    MANGA POPULAIRE MOIS    /////
              //////////////////////////////////////

const parsePopularMangaMonth = ($: CheerioStatic): MangaTile[] => {
  const popularMangaMonth: MangaTile[] = []

  for (const item of $('.wpop-monthly li').toArray()) {
    let url = $('a', item).first().attr('href')?.split("/")[4]
    let image = $('img', item).attr('src')
    let title = $('.leftseries h2 a', item).text()
    let subtitle = ""

    console.log(url + " " + image + " " + title + " " + subtitle)

    // Credit to @GameFuzzy
    // Checks for when no id or image found
    if (typeof url === 'undefined' || typeof image === 'undefined') 
      continue

      popularMangaMonth.push(createMangaTile({
      id: url,
      image: image,
      title: createIconText({ text: title }),
      subtitleText: createIconText({ text: subtitle })
    }))
  }

  return popularMangaMonth
}


              //////////////////////////////////////
              /////    MANGA POPULAIRE MOIS    /////
              //////////////////////////////////////

const parsePopularMangaAllTime = ($: CheerioStatic): MangaTile[] => {
  const popularMangaAllTime: MangaTile[] = []

  for (const item of $('.wpop-alltime li').toArray()) {
    let url = $('a', item).first().attr('href')?.split("/")[4]
    let image = $('img', item).attr('src')
    let title = $('.leftseries h2 a', item).text()
    let subtitle = ""

    console.log(url + " " + image + " " + title + " " + subtitle)

    // Credit to @GameFuzzy
    // Checks for when no id or image found
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


              //////////////////////////////////
              /////    DERNIERS PROJETS    /////
              //////////////////////////////////

const parseLastProjects = ($: CheerioStatic): MangaTile[] => {
  const LastProjects: MangaTile[] = []

  for (const item of $('.postbody .listupd').eq(0).children().toArray()) {
    let url = $('a', item).first().attr('href')?.split("/")[3].split("-").slice(0, -1).join("-") ?? 'undefined'
    let image = $('img', item).attr('src')
    let title = $('a', item).first().attr('title')?.split(" ").slice(0, -1).join(" ") ?? ''
    let subtitle = $('.epxs', item).text()

    console.log(url + " " + image + " " + title + " " + subtitle)

    // Credit to @GameFuzzy
    // Checks for when no id or image found
    if (typeof url === 'undefined' || typeof image === 'undefined') 
      continue

      LastProjects.push(createMangaTile({
      id: url,
      image: image,
      title: createIconText({ text: title }),
      subtitleText: createIconText({ text: subtitle })
    }))
  }

  return LastProjects
}


              ///////////////////////////////////
              /////    DERNIERES SORTIES    /////
              ///////////////////////////////////

const parseLastUpdate = ($: CheerioStatic): MangaTile[] => {
  const LastUpdate: MangaTile[] = []

  for (const item of $('.postbody .listupd').eq(1).children().toArray()) {
    let url = $('a', item).first().attr('href')?.split("/")[4]
    let image = $('img', item).attr('src')
    let title = $('a', item).first().attr('title') ?? ''
    let subtitle = $('a', item).eq(2).text()

    console.log(url + " " + image + " " + title + " " + subtitle)

    // Credit to @GameFuzzy
    // Checks for when no id or image found
    if (typeof url === 'undefined' || typeof image === 'undefined') 
      continue

      LastUpdate.push(createMangaTile({
      id: url,
      image: image,
      title: createIconText({ text: title }),
      subtitleText: createIconText({ text: subtitle })
    }))
  }

  return LastUpdate
}


              ///////////////////////////////////
              /////    DERNIERES SORTIES    /////
              ///////////////////////////////////

const parseNewProjects = ($: CheerioStatic): MangaTile[] => {
  const NewProjects: MangaTile[] = []

  for (const item of $('.section .serieslist').eq(3).find('li').toArray()) {
    let url = $('a', item).first().attr('href')?.split("/")[4]
    let image = $('img', item).attr('src')
    let title = $('h2', item).text()
    let subtitle = ''

    console.log(url + " " + image + " " + title + " " + subtitle)

    // Credit to @GameFuzzy
    // Checks for when no id or image found
    if (typeof url === 'undefined' || typeof image === 'undefined') 
      continue

      NewProjects.push(createMangaTile({
      id: url,
      image: image,
      title: createIconText({ text: title }),
      subtitleText: createIconText({ text: subtitle })
    }))
  }

  return NewProjects
}
    //////////////////////////////
    /////    HOME SECTION    /////
    //////////////////////////////

export const parseHomeSections = ($: CheerioStatic, sections: HomeSection[], sectionCallback: (section: HomeSection) => void): void => {
  for (const section of sections) sectionCallback(section)
  const hotManga: MangaTile[] = parseHotManga($)
  const popularMangaToday: MangaTile[] = parsePopularMangaToday($)
  const popularMangaWeek: MangaTile[] = parsePopularMangaWeek($) 
  const popularMangaMonth: MangaTile[] = parsePopularMangaMonth($) 
  const popularMangaAllTime: MangaTile[] = parsePopularMangaAllTime($) 
  const LastProjects: MangaTile[] = parseLastProjects($) 
  const LastUpdate: MangaTile[] = parseLastUpdate($) 
  const NewProjects: MangaTile[] = parseNewProjects($) 

  sections[0].items = hotManga
  sections[1].items = popularMangaToday
  sections[2].items = popularMangaWeek
  sections[3].items = popularMangaMonth
  sections[4].items = popularMangaAllTime
  sections[5].items = LastProjects
  sections[6].items = LastUpdate
  sections[7].items = NewProjects

  // Perform the callbacks again now that the home page sections are filled with data
  for (const section of sections) sectionCallback(section)
}


///////////////////////////
/////    VIEW MORE    /////
///////////////////////////

export const parseViewMore = ($: CheerioStatic): MangaTile[] => {
  const ViewMore: MangaTile[] = []

  for (const item of $('.postbody .listupd').eq(0).children().toArray()) {
    let url = $('a', item).first().attr('href')?.split("/")[4] ?? 'undefined'
    let image = $('img', item).attr('src')
    let title = $('a', item).first().attr('title') ?? ''
    let subtitle = $('.epxs', item).text()

    console.log(url + " " + image + " " + title + " " + subtitle)

    // Credit to @GameFuzzy
    // Checks for when no id or image found
    if (typeof url === 'undefined' || typeof image === 'undefined') 
      continue

      ViewMore.push(createMangaTile({
      id: url,
      image: image,
      title: createIconText({ text: title }),
      subtitleText: createIconText({ text: subtitle })
    }))
  }

  return ViewMore
}


////////////////////////////
/////    isLastPage    /////
////////////////////////////

export const isLastPage = ($: CheerioStatic, section: String): boolean => {
  switch (section) {
    case 'latest_projects':
      return (($('.next.page-numbers').length == 0) ? true : false)
    case 'latest_updated':
      return (($('.r i').length == 0) ? true : false)
    default:
      return false
      break;
  }
}


//////////////////////
/////    TAGS    /////
//////////////////////

export const parseTags = ($: CheerioStatic): TagSection[] | null => {
  
  const arrayTags: Tag[] = []

  for (let item of $('.dropdown-menu.c4.genrez li').toArray()) {
    let label = $('label', item).text()
    arrayTags.push({ id: label, label: label })
  }
  
  const tagSections: TagSection[] = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.map(x => createTag(x)) })]

  return tagSections
}


function decodeHTMLEntity(str: string) {
  return str.replace(/&#(\d+);/g, function (match, dec) {
      return String.fromCharCode(dec);
  })
}

function parseDate(str: string) {

  let year = str.split(" ")[2]

  let months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
  let month = months.findIndex((element) => element == str.split(" ")[0]).toString()
  
  let day = str.split(" ")[1].replace(",", "")

  return new Date(parseInt(year), parseInt(month), parseInt(day))
}