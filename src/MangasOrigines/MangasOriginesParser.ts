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
    const image = $('img', panel).attr('data-src') ?? ""
    const rating = Number($('.post-total-rating .score', panel).text().trim())
    const arrayTags: Tag[] = []

    let status = MangaStatus.UNKNOWN
    let author = "Unknown"
    let artist = undefined
    let hentai = false
    
    const infoContent = $('.post-content_item', panel).toArray()
    for (let info of infoContent) {
      let item = $('.summary-heading', info).text().trim().split(' ')[1]
      let val = $('.summary-content', info).text().trim()

      switch (item) {
        case "Rang":
          let nb_views = (val.match(/(\d+\.?\d*\w?) /gm) ?? "")[0].trim()
          const views = convertNbViews(nb_views)
          break;
        case "Alternatif":
          let otherTitles = val.split(',')
          for (let title of otherTitles) {
              titles.push(decodeHTMLEntity(title.trim()))
          }
          break;
        case "Auteur(s)":
          author = val
          break;
        case "Artiste(s)":
          artist = val
          break;
        case "Genre(s)":
          const tags = $('.summary-content .genres-content a', info).toArray()
          for (const tag of tags) {
            const label = $(tag).text()
            const id = $(tag).attr('href')?.split("/")[4] ?? label
            if (['Adulte'].includes(label) || ['Hentai'].includes(label) || ['Sexe'].includes(label) || ['Uncensored'].includes(label)) {
              hentai = true
            }
            arrayTags.push({ id: id, label: label })
          }
          break;
        case "STATUS":
          switch (val.split(" ")[0].trim()) {
            case "Terminé":
              status = MangaStatus.COMPLETED
              break;
            case "En cours":
              status = MangaStatus.ONGOING
              break;
          }
          break;
      }
    }

    const tagSections: TagSection[] = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.length > 0 ? arrayTags.map(x => createTag(x)) : [] })];
    let summary = decodeHTMLEntity($('.container .summary__content.show-more').text().trim())

    return createManga({
        id: mangaId,
        titles,
        image,
        author,
        artist,
        rating,
        status,
        tags: tagSections,
        desc: summary,
        hentai
    })
}


///////////////////////////////
/////    CHAPTERS LIST    /////
///////////////////////////////

export const parseMangasOriginesChapters = ($: CheerioStatic, mangaId: string): Chapter[] => {
  const allChapters = $('.wp-manga-chapter')
  const chapters: Chapter[] = []
  
  for (let chapter of allChapters.toArray()) {
    const id: string = $('a', chapter).first().attr('href') + "?style=list" ?? ''
    const name: string = $('a', chapter).first().text().trim()
    const chapNum: number = Number( (name.match(/(\d+)(\.?)(\d*)/gm) ?? '')[0] )
    const time: Date = parseDate($('.chapter-release-date i', chapter).text())

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

export const parseMangasOriginesChapterDetails = ($: CheerioStatic, mangaId: string, chapterId: string): ChapterDetails => {
  const pages: string[] = []
  const allItems = $('.container .reading-content img').toArray()

  for(let item of allItems) {
    let page = $(item).attr('data-src')?.trim()

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

  for (const item of $('.row .c-tabs-item__content').toArray()) {
    const url = $('h3 a', item).attr('href')?.split('/')[4] ?? ''
    const title = $('h3 a', item).text() ?? '' 
    const image = $('img', item).attr("data-src") ?? ''
    const subtitle = $('.latest-chap .chapter a', item).text()

    manga.push(createMangaTile({
      id : url,
      image,
      title: createIconText({ text: title }),
      subtitleText : createIconText({ text: subtitle })
    }))
  }

  return manga
}


///////////////////////////
/////    🔥 HOT 🔥    /////
///////////////////////////

const parseHotManga = ($: CheerioStatic): MangaTile[] => {
  const hotManga: MangaTile[] = []

  for (const item of $('.container .manga-slider .slider__container .slider__item').toArray()) {
    let url = $('h4 a', item).attr('href')?.split("/")[4]
    let image = $('img', item).attr('src')
    let title = $('h4', item).text().trim()
    let subtitle = ""

    if (typeof url === 'undefined' || typeof image === 'undefined') 
      continue

    hotManga.push(createMangaTile({
      id: url,
      image: image,
      title: createIconText({ text: title }),
      subtitleText: createIconText({ text: subtitle })
    }))
  }

  return hotManga
}

///////////////////////////////
/////    POPULAR TODAY    /////
///////////////////////////////

const parsePopularTodayManga = ($: CheerioStatic): MangaTile[] => {
  const popularTodayManga: MangaTile[] = []

  for (const item of $('.widget-content .popular-item-wrap').toArray()) {
    let url = $('h5 a', item).attr('href')?.split("/")[4]
    let image = ($('img', item).attr('data-src') ?? "").replace("75x106", "193x278")
    let title = $('h5 a', item).text().trim()
    let subtitle = $('.chapter-item .chapter.font-meta', item).eq(0).text().trim()

    if (typeof url === 'undefined' || typeof image === 'undefined') 
      continue

    popularTodayManga.push(createMangaTile({
      id: url,
      image: image,
      title: createIconText({ text: title }),
      subtitleText: createIconText({ text: subtitle })
    }))
  }

  return popularTodayManga
}

////////////////////////////////
/////    LATEST UPDATED    /////
////////////////////////////////

const parseLatestUpdatedManga = ($: CheerioStatic): MangaTile[] => {
  const latestUpdatedManga: MangaTile[] = []

  for (const item of $('.page-content-listing.item-default .page-item-detail.manga').toArray()) {
    let url = $('h3 a', item).attr('href')?.split("/")[4]
    let image = ($('img', item).attr('data-src') ?? "").replace("110x150", "193x278")
    let title = $('h3 a', item).text().trim()
    let subtitle = $('.chapter-item .chapter.font-meta', item).eq(0).text().trim()

    if (typeof url === 'undefined' || typeof image === 'undefined') 
      continue

    latestUpdatedManga.push(createMangaTile({
      id: url,
      image: image,
      title: createIconText({ text: title }),
      subtitleText: createIconText({ text: subtitle })
    }))
  }

  return latestUpdatedManga
}

/////////////////////////
/////    NOVELTY    /////
/////////////////////////

const parseNoveltyManga = ($: CheerioStatic): MangaTile[] => {
  const noveltyManga: MangaTile[] = []

  for (const item of $('#manga-popular-slider-2 .slider__container .slider__item').toArray()) {
    let url = $('h4 a', item).attr('href')?.split("/")[4]
    let image = $('img', item).attr('src')
    let title = $('h4 a', item).text().trim()
    let subtitle = $('.chapter-item .chapter', item).eq(0).text().trim()

    if (typeof url === 'undefined' || typeof image === 'undefined') 
      continue

    noveltyManga.push(createMangaTile({
      id: url,
      image: image,
      title: createIconText({ text: title }),
      subtitleText: createIconText({ text: subtitle })
    }))
  }

  return noveltyManga
}

//////////////////////////////
/////    HOME SECTION    /////
//////////////////////////////

export const parseHomeSections = ($: CheerioStatic, sections: HomeSection[], sectionCallback: (section: HomeSection) => void): void => {
  for (const section of sections) sectionCallback(section)
  const hotManga: MangaTile[] = parseHotManga($)
  const popularTodayManga: MangaTile[] = parsePopularTodayManga($)
  const latestUpdatedManga: MangaTile[] = parseLatestUpdatedManga($)
  const noveltyManga: MangaTile[] = parseNoveltyManga($)

  sections[0].items = hotManga
  sections[1].items = popularTodayManga
  sections[2].items = latestUpdatedManga
  sections[3].items = noveltyManga

  for (const section of sections) sectionCallback(section)
}

///////////////////////////
/////    VIEW MORE    /////
///////////////////////////

export const parseViewMore = ($: CheerioStatic): MangaTile[] => {
  const viewMore: MangaTile[] = []

  for (const item of $('.page-content-listing.item-default .page-item-detail.manga').toArray()) {
    let url = $('h3 a', item).attr('href')?.split("/")[4]
    let image = $('.img-responsive', item).attr('data-src')
    let title = $('h3 a', item).text().trim()
    let subtitle = $('.chapter-item .chapter', item).eq(0).text().trim()

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

export const isLastPage = ($: CheerioStatic): boolean => {
  return $('.error-404.not-found').length !=0
}


//////////////////////
/////    TAGS    /////
//////////////////////

export const parseTags = ($: CheerioStatic): TagSection[] => {
  const arrayTags: Tag[] = []

  for (let item of $('.search-advanced-form .checkbox').toArray()) {
    let id = $('input', item).attr('value') ?? ''
    let label = $('label', item).text().trim()
    
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

export function parseDate(str: string) {
  str = str.trim()
  if (str.length == 0)
  {
    let date = new Date()
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }
    
  let date = str.split(" ") 
  let year = date[2]
  let months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
  let month = months.findIndex((element) => element == date[1]).toString()
  let day = date[0]

  return new Date(parseInt(year), parseInt(month), parseInt(day))
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
