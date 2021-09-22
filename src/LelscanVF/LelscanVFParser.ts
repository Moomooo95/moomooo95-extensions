import { Chapter, ChapterDetails, HomeSection, LanguageCode, Manga, MangaStatus, MangaTile, MangaUpdates, PagedResults, SearchRequest, TagSection } from "paperback-extensions-common";
import { parseJsonText } from "typescript";


///////////////////////////////
/////                     /////
/////    Manga Details    /////
/////                     /////
///////////////////////////////

export const parseLelscanVFMangaDetails = ($: CheerioStatic, mangaId: string): Manga => {
    const title = $('.widget-title').eq(0).text().trim().replace(/(\r\n|\n|\r)/gm, "")
    const image = "https:" + $('.img-responsive').attr('src')
    
    const status = $('dt:contains("Statut")').next().text().trim().replace(/(\r\n|\n|\r)/gm, "") == 'Ongoing' ? MangaStatus.ONGOING : MangaStatus.COMPLETED

    // Others Titles
    let titles = [title]
    let othersTitles = $('dt:contains("Autres noms")').next().text().trim().replace(/(\r\n|\n|\r)/gm, "").split(',') ?? ''
    for (let title of othersTitles)
    {   
        titles.push(title.trim())
    }
    
    const author = $('dt:contains("Auteur(s)")').next().text().trim().replace(/(\r\n|\n|\r)/gm, "") ?? ''
    const artist = $('dt:contains("Artist(s)")').next().text().trim().replace(/(\r\n|\n|\r)/gm, "") ?? ''

    // Tags
    const tagSections: TagSection[] = [createTagSection({ id: '0', label: 'genres', tags: [] })]
    let tags = $('.tag-links') ?? ''
    let genres = new Array()
    tags = tags.children().each(function (){ genres.push($("this").text()) })
    tagSections[0].tags = genres.map((elem: string) => createTag({ id: elem, label: elem }))

    let hentai = (genres.includes('Adulte')) ? true : false;

    const views = Number($('dt:contains("Vues")').next().text().trim().replace(/(\r\n|\n|\r)/gm, ""))

    const rating = Number($('dt:contains("Note")').next().children().text().trim().replace(/(\r\n|\n|\r)/gm, "").substr(11,3)) ?? ''

    const summary = $('.well').children('p').text().trim().replace(/^\s+|\s+$/g, '')


    return createManga({
        id: mangaId,
        titles,
        image,
        rating: Number(rating),
        status,
        author,
        artist,
        tags: tagSections,
        views,
        desc: summary,
        hentai
      })
}


//////////////////////////
/////                /////
/////    Chapters    /////
/////                /////
//////////////////////////

export const parseLelscanVFChapters = ($: CheerioStatic, mangaId: string): Chapter[] => {
  const allChapters = $('.chapters')
  const chapters: Chapter[] = []
  
  for (let chapter of $('li', allChapters).toArray()) {
    const id: string = $('a', chapter).attr('href') ?? ''
    const name: string = "Chapitre " + $('a', chapter).text().split(" ").pop() ?? ''
    const chapNum: number = Number( id.split('/').pop() )
    const time: Date = new Date($('.date-chapter-title-rtl', chapter).text() ?? '')
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

export const parseLelscanVFChapterDetails = ($: CheerioStatic, mangaId: string, chapterId: string): ChapterDetails => {
  const pages: string[] = []
  const allItems = $('img', '.viewer-cnt #all').toArray()
  for(let item of allItems)
  {
    let page = $(item).attr('data-src')?.trim().split("/")[0] == "https:" ? $(item).attr('data-src')?.trim() : 'http:' + $(item).attr('data-src')?.trim()
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

export const parseSearch = ($: CheerioStatic, data: string): MangaTile[] => {
  const manga: MangaTile[] = []

  // const panel = $('autocomplete-suggestions')
  // const items = $('.autocomplete-suggestion', panel).toArray();
  // for (const item of items) {
  //   const id = $(item).text().replaceAll(/[^a-zA-Z0-9 ]/g, "").replaceAll(" ", "-") ?? ''
  //   const title = $(item).text()
  //   const image = "https://lelscan-vf.co/uploads/manga/" + id + "/cover/cover_250x350.jpg" ?? ''

  //   manga.push(createMangaTile({
  //     id,
  //     image,
  //     title: createIconText({ text: title }),
  //   }))
  // }

  const items = $('.objectBox-string').toArray();
  for (const item of items) {
    const id = $(item).text().replaceAll(/[^a-zA-Z0-9 ]/g, "").replaceAll(" ", "-") ?? ''
    const title = $(item).text()
    const image = "https://lelscan-vf.co/uploads/manga/" + id + "/cover/cover_250x350.jpg" ?? ''

    console.log(id)

    manga.push(createMangaTile({
      id,
      image,
      title: createIconText({ text: title }),
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

  for (const item of $('.mangalist .manga-item').toArray()) {
    let url = $('a', item).first().attr('href')?.split("/")[4]
    let image = "https://lelscan-vf.co/uploads/manga/" + url + "/cover/cover_250x350.jpg"
    let title = $('a', item).first().text()
    let subtitle = "Chapitre " + $('a', item).eq(1).text().replace(/[^\d]/g, "")
    
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


              /////////////////////////////////
              /////    MANGA POPULAIRE    /////
              /////////////////////////////////

const parsePopularManga = ($: CheerioStatic): MangaTile[] => {
  const popularManga: MangaTile[] = []

  for (const item of $('.hot-thumbnails li').toArray()) {
    let url = $('a', item).first().attr('href')?.split("/")[4]
    let image = "https:" + $('img', item).attr('src')
    let title = $('a', item).first().text()
    let subtitle = "Chapitre " + $('p', item).text().replace(/[^\d]/g, "")

    // console.log(url + " " + image + " " + title + " " + subtitle)

    // Credit to @GameFuzzy
    // Checks for when no id or image found
    if (typeof url === 'undefined' || typeof image === 'undefined') 
      continue

    popularManga.push(createMangaTile({
      id: url,
      image: image,
      title: createIconText({ text: title }),
      subtitleText: createIconText({ text: subtitle })
    }))
  }

  return popularManga
}


              ///////////////////////////
              /////    TOP MANGA    /////
              ///////////////////////////

const parseTopManga = ($: CheerioStatic): MangaTile[] => {
  const topManga: MangaTile[] = []

  for (const item of $('body li').toArray()) {
    let url = $('a', item).first().attr('href')?.split("/")[4]
    let image = "https://lelscan-vf.co/uploads/manga/" + url + "/cover/cover_250x350.jpg"
    let title = $('strong', item).text()
    let subtitle = $('a', item).eq(2).text()
    
    // console.log(url + " " + image + " " + title + " " + subtitle)

    // Credit to @GameFuzzy
    // Checks for when no id or image found
    if (typeof url === 'undefined' || typeof image === 'undefined') 
      continue

    topManga.push(createMangaTile({
      id: url,
      image: image,
      title: createIconText({ text: title }),
      subtitleText: createIconText({ text: subtitle })
    }))
  }

  return topManga
}


    //////////////////////////////
    /////    HOME SECTION    /////
    //////////////////////////////

export const parseHomeSections = ($: CheerioStatic, sections: HomeSection[], sectionCallback: (section: HomeSection) => void): void => {
  for (const section of sections) sectionCallback(section)
  const latestManga: MangaTile[] = parseLatestManga($)
  const popularManga: MangaTile[] = parsePopularManga($)

  sections[0].items = latestManga
  sections[1].items = popularManga

  // Perform the callbacks again now that the home page sections are filled with data
  for (const section of sections) sectionCallback(section)
}


    ///////////////////////////////////
    /////    SECTION TOP MANGA    /////
    ///////////////////////////////////

export const parseMangaSectionTiles = ($: CheerioStatic, sections: HomeSection[], sectionCallback: (section: HomeSection) => void): void => {
  for (const section of sections) sectionCallback(section)

  sections[0].items = parseTopManga($)

  // Perform the callbacks again now that the home page sections are filled with data
  for (const section of sections) sectionCallback(section)
}


    ///////////////////////////
    /////    VIEW MORE    /////
    ///////////////////////////

export const parseViewMore = ($: CheerioStatic, section: String): MangaTile[] => {
  switch (section) {
    case 'latest_updates':
      return parseLatestManga($)
    case 'popular_manga':
      return parsePopularManga($)
    case 'top_manga':
      return parseTopManga($)
    default:
      return []
  }
}



//////////////////////
/////    TAGS    /////
//////////////////////

export const parseTags = ($: CheerioStatic): TagSection[] | null => {
    let items = $('.tag-links').children().clone().toArray()
    const genres = createTagSection({
      id: 'genre',
      label: 'Genre',
      tags: []
    })
    for (let item of items) {
      let label = $(item).text()
      genres.tags.push(createTag({ id: label, label: label }))
    }
    return [genres]
}