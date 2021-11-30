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

export const parseReaperScansDetails = ($: CheerioStatic, mangaId: string): Manga => {
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
    const label = $(tag).text()

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
    hentai: false
  })
}


//////////////////////////
/////    Chapters    /////
//////////////////////////

export const parseReaperScansChapters = ($: CheerioStatic, mangaId: string): Chapter[] => {
  const allChapters = $('#chapterlist')
  const chapters: Chapter[] = []
  
  for (let chapter of $('li', allChapters).toArray()) {
    const id: string = $('a', chapter).attr('href') ?? ''
    const name: string = $('.chapternum', chapter).text()
    const chapNum: number = Number( $('.chapternum', chapter).text().split(' ')[1] )
    const time: Date = new Date(parseDateChap($('.chapterdate', chapter).text().trim()))

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
  const allItems = $($.parseHTML($('noscript').text())).children().toArray()

  for(let item of allItems) {
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
    const title = $('a', item).attr('title') ?? ''
    const image = $('img', item).attr("src") ?? ''
    const subtitle = $('.epxs', item).text()


    manga.push(createMangaTile({
      id,
      image,
      title: createIconText({ text: title }),
      subtitleText : createIconText({ text: subtitle })
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
    let title = $('.name', item).text()
    let subtitle = ""
    
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

///////////////////////////////////
/////    POPULAR MANGA DAY    /////
///////////////////////////////////

const parsePopularMangaToday = ($: CheerioStatic): MangaTile[] => {
  const popularMangaToday: MangaTile[] = []

  for (const item of $('.hotslid .bs').toArray()) {
    let url = $('a', item).first().attr('href')?.split("/")[4]
    let image = $('img', item).attr('src')
    let title = $('a', item).first().attr('title') ?? ''
    let subtitle = $('.epxs', item).text()
    
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
    let title = $('.leftseries h2 a', item).text()
    let subtitle = ""
    
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

/////////////////////////////////////
/////    POPULAR MANGA MONTH    /////
/////////////////////////////////////

const parsePopularMangaMonth = ($: CheerioStatic): MangaTile[] => {
  const popularMangaMonth: MangaTile[] = []

  for (const item of $('.wpop-monthly li').toArray()) {
    let url = $('a', item).first().attr('href')?.split("/")[4]
    let image = $('img', item).attr('src')
    let title = $('.leftseries h2 a', item).text()
    let subtitle = ""
    
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

////////////////////////////////////////////
/////    POPULAR MANGA ALL THE TIME    /////
////////////////////////////////////////////

const parsePopularMangaAllTime = ($: CheerioStatic): MangaTile[] => {
  const popularMangaAllTime: MangaTile[] = []

  for (const item of $('.wpop-alltime li').toArray()) {
    let url = $('a', item).first().attr('href')?.split("/")[4]
    let image = $('img', item).attr('src')
    let title = $('.leftseries h2 a', item).text()
    let subtitle = ""
    
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

/////////////////////////////////
/////    LATEST PROJECTS    /////
/////////////////////////////////

const parseLastProjects = ($: CheerioStatic): MangaTile[] => {
  const lastProjects: MangaTile[] = []

  for (const item of $('.postbody .listupd').eq(0).children().toArray()) {
    let url = $('a', item).first().attr('href')?.split("/")[3].split("-").slice(0, -1).join("-") ?? 'undefined'
    let image = $('img', item).attr('src')
    let title = $('a', item).first().attr('title')?.split(" ").slice(0, -1).join(" ") ?? ''
    let subtitle = $('.epxs', item).text()

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

////////////////////////////////
/////    LAST RELEASES     /////
////////////////////////////////

const parseLastUpdate = ($: CheerioStatic): MangaTile[] => {
  const lastUpdate: MangaTile[] = []

  for (const item of $('.postbody .listupd').eq(1).children().toArray()) {
    let url = $('a', item).first().attr('href')?.split("/")[4]
    let image = $('img', item).attr('src')
    let title = $('a', item).first().attr('title') ?? ''
    let subtitle = $('a', item).eq(2).text()
    
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

//////////////////////////////
/////    NEW PROJECTS    /////
//////////////////////////////

const parseNewProjects = ($: CheerioStatic): MangaTile[] => {
  const newProjects: MangaTile[] = []

  for (const item of $('.section .serieslist').eq(3).find('li').toArray()) {
    let url = $('a', item).first().attr('href')?.split("/")[4]
    let image = $('img', item).attr('src')
    let title = $('h2', item).text()
    let subtitle = ''
    
    if (typeof url === 'undefined' || typeof image === 'undefined') 
      continue

    newProjects.push(createMangaTile({
      id: url,
      image: image,
      title: createIconText({ text: title }),
      subtitleText: createIconText({ text: subtitle })
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
    let title = $('a', item).first().attr('title') ?? ''
    let subtitle = $('.epxs', item).text()
    
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
    let label = $('label', item).text()
    arrayTags.push({ id: id, label: label })
  }
  const tagSections: TagSection[] = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.map(x => createTag(x)) })]

  return tagSections
}


/////////////////////////////////
/////    ADDED FUNCTIONS    /////
/////////////////////////////////

function decodeHTMLEntity(str: string) {
  return str.replace(/&#(\d+);/g, function (match, dec) {
      return String.fromCharCode(dec);
  })
}


export function parseDateChap(str: string) {
  str = str.trim()
  if (str.length == 0)
  {
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

export function parseDate(str: string) {
  str = str.trim()
  if (str.length == 0)
  {
    let date = new Date()
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }
  
  switch (str.split(' ').pop()) {
    case "minutes":
      let minutes = new Date()
      return new Date(minutes.getFullYear(), minutes.getMonth(), minutes.getDate(), minutes.getHours(), minutes.getMinutes()-parseInt(str.split(' ')[0]))
    case "heures":
      let hours = new Date()
      return new Date(hours.getFullYear(), hours.getMonth(), hours.getDate(), hours.getHours()-parseInt(str.split(' ')[0]))
    case "jours":
      let day = new Date()
      return new Date(day.getFullYear(), day.getMonth(), day.getDate()-parseInt(str.split(' ')[0]))
    case "semaines":
      let week = new Date()
      return new Date(week.getFullYear(), week.getMonth(), week.getDate()-(7*parseInt(str.split(' ')[0])))
    case "mois":
      let month = new Date()
      return new Date(month.getFullYear(), month.getMonth()-parseInt(str.split(' ')[0]), month.getDate()-1)
    default:
      return new Date()
  }
}