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

export const parseScanMangaDetails = ($: CheerioStatic, mangaId: string): Manga => {
  let titles = [decodeHTMLEntity($('.h2_titre.h2_titre_shonen').text().trim())]
  const image = $('.image_manga img').attr('src') ?? ""

  const panel = $('.contenu_fiche_technique')

  let status = MangaStatus.UNKNOWN
  switch ($('dt:contains("Statut")', panel).next().text().trim()) {
    case "Ongoing":
      status = MangaStatus.ONGOING
      break;
    case "Completed":
      status = MangaStatus.COMPLETED
      break;
  }

  let othersTitles = $('dt:contains("Autres noms")', panel).next().text().trim().split(',')
  for (let title of othersTitles) {   
      titles.push(decodeHTMLEntity(title.trim()))
  }
  const author = $('dt:contains("Auteur(s)")', panel).next().text().trim() != "" ? $('dt:contains("Auteur(s)")', panel).next().text().trim() : "Unknown"
  const artist = $('dt:contains("Artist(s)")', panel).next().text().trim() != "" ? $('dt:contains("Artist(s)")', panel).next().text().trim() : "Unknown"

  const arrayTags: Tag[] = []
  // Categories
  if ($('dt:contains("Catégories")', panel).length > 0)
  {
    const categories = $('dt:contains("Catégories")', panel).next().text().trim().split(',') ?? ""
    for (const category of categories) {
      const label = category.trim()
      const id = category.replace(" ", "-").toLowerCase().trim() ?? label

      arrayTags.push({ id: id, label: label })
    }
  }
  // Tags
  if ($('dt:contains("Tags")', panel).length > 0)
  {
    const tags = $('dt:contains("Tags")', panel).next().text().trim().split('\n') ?? ""
    for (const tag of tags) {
      const label = tag.trim()
      const id = tag.replace(" ", "-").toLowerCase().trim() ?? label

      if (!arrayTags.includes({ id: id, label: label })) {
        arrayTags.push({ id: id, label: label })
      }
    }
  }
  const tagSections: TagSection[] = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.length > 0 ? arrayTags.map(x => createTag(x)) : [] })];

  const views = Number($('dt:contains("Vues")', panel).next().text().trim())
  const rating = Number($('dt:contains("Note")', panel).next().children().text().trim().substr(11,3)) ?? ''  
  const desc = decodeHTMLEntity($('.texte_synopsis_manga').text().trim())

  return createManga({
    id: mangaId,
    titles,
    image,
    rating: Number(rating),
    status,
    artist,
    author,
    tags: tagSections,
    views,
    desc,
    hentai: false
  })
}


//////////////////////////
/////    CHAPTERS    /////
//////////////////////////

export const parseScanMangaChapters = ($: CheerioStatic, mangaId: string): Chapter[] => {
  const allChapters = $('.h2_ensemble')
  const chapters: Chapter[] = []
  
  for (let chapter of $('.chapitre', allChapters).toArray()) {
    const id: string = $('a', chapter).first().attr('href') ?? ''
    const name: string = $('a', chapter).first().text() ?? ''
    const chapNum: number = Number( name.split(' ').pop() )
    const time: Date = new Date()

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


/////////////////////////////////
/////    CHAPTER DETAILS    /////
/////////////////////////////////

export const parseScanMangaChapterDetails = ($: CheerioStatic, mangaId: string, chapterId: string): ChapterDetails => {
  const pages: string[] = []
  const allItems = $('#lel img').toArray()

  for(let item of allItems) {
    let page = $(item).attr('src')?.trim()

    if (typeof page === 'undefined')
      continue;

    pages.push(page);
    break;
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

  for (const item of $('.media').toArray()) {
    let url = $('h5 a', item).attr('href')?.split("/")[4]
    let image = ($('img', item).attr('src') ?? '').split("/")[0] == "https:" ? $('img', item).attr('src') ?? "" : "https:" + $('img', item).attr('src') ?? ""
    let title = decodeHTMLEntity($('h5', item).text())
    let subtitle = decodeHTMLEntity($('a', item).eq(2).text().trim())
    
    if (typeof url === 'undefined' || typeof image === 'undefined') 
      continue

    manga.push(createMangaTile({
      id: url,
      image: image,
      title: createIconText({ text: title }),
      subtitleText: createIconText({ text: subtitle }),
    }))
  }

  return manga
}


//////////////////////////////////////
/////    LAST MANGAS RELEASED    /////
//////////////////////////////////////

const parseLatestManga = ($: CheerioStatic): MangaTile[] => {
  const latestManga: MangaTile[] = []

  for (const item of $('#content_news .listing').toArray()) {
    let url = $('.left .nom_manga', item).attr('href')?.split("/")[3]
    let image = $('img', item).attr('src')
    let title = decodeHTMLEntity($('.left .nom_manga', item).text().trim())
    let subtitle = $('.left .lel_tchapt', item).text().trim()

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

//////////////////////////////
/////    HOME SECTION    /////
//////////////////////////////

export const parseHomeSections = ($: CheerioStatic, sections: HomeSection[], sectionCallback: (section: HomeSection) => void): void => {
  for (const section of sections) sectionCallback(section)
  const latestManga: MangaTile[] = parseLatestManga($)

  sections[0].items = latestManga

  for (const section of sections) sectionCallback(section)
}



/////////////////////////////////
/////    CHECK LAST PAGE    /////
/////////////////////////////////

export const isLastPage = ($: CheerioStatic): boolean => {
  return $('.pagination li').last().hasClass('disabled')
}


/////////////////////////////////
/////    ADDED FUNCTIONS    /////
/////////////////////////////////

function decodeHTMLEntity(str: string) {
  return str.replace(/&#(\d+);/g, function (match, dec) {
      return String.fromCharCode(dec);
  })
}