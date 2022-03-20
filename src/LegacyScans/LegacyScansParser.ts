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
  
  export const parseLegacyScansMangaDetails = ($: CheerioStatic, mangaId: string): Manga => {
    const panell = $('.thumbook')
    const image = $('img', panell).attr('src') ?? ""
    const follows = Number($('.bmc').text().trim().replace(/[^\d]/g, ""))
    const rating = Number($('.num').text().trim())
    let status = MangaStatus.UNKNOWN
    switch ($('.thumbook .imptdt i').text().trim()) {
        case "Completed":
            status = MangaStatus.COMPLETED
            break;
        case "Ongoing":
            status = MangaStatus.ONGOING
            break;
    }

    const panelr = $('.infox')
    const titles = [decodeHTMLEntity($('.entry-title', panelr).text().trim())]
    const author = $('b:contains("Auteur")', panelr).next().text().trim() ?? "Unknown"
    const artist = $('b:contains("Artiste")', panelr).next().text().trim() ?? "Unknown"
    const lastUpdate = new Date($('b:contains("Mis à jour le")', panelr).next().text().trim())

    const arrayTags: Tag[] = []
    // Tags 
    const tags = $('b:contains("Genre")', panelr).next().find('a').toArray()
    for (const tag of tags) {
      const id = $(tag).attr('href')?.split("/").slice(-2, -1)[0] ?? ''
      const label = capitalizeFirstLetter(decodeHTMLEntity($(tag).text()))

      arrayTags.push({ id: id, label: label })
    }
    const tagSections: TagSection[] = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.length > 0 ? arrayTags.map(x => createTag(x)) : [] })];

    let desc = decodeHTMLEntity($('.entry-content-single', panelr).text())

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
  /////    CHAPTERS    /////
  //////////////////////////
  
  export const parseLegacyScansChapters = ($: CheerioStatic, mangaId: string): Chapter[] => {
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
  
  
  /////////////////////////////////
  /////    CHAPTER DETAILS    /////
  /////////////////////////////////
  
  export const parseLegacyScansChapterDetails = ($: CheerioStatic, mangaId: string, chapterId: string): ChapterDetails => {
    const pages: string[] = []
  
    for (let page of JSON.parse($('.wrapper > script:nth-child(4)').text().slice(14, -2)).sources[0].images) {
  
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
  
    for (const item of $('.listupd .bsx').toArray()) {
      let url = $('a', item).attr('href')?.split("/").slice(-2, -1)[0]
      let image = $('img', item).attr('src')?.replace(/-(\d){2,}x(\d){2,}/gm, '')
      let title = decodeHTMLEntity($('.bigor .tt', item).text().trim())
      let subtitle = decodeHTMLEntity($('.bigor .adds .epxs', item).text().trim())
  
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
  
  
  ////////////////////////////////
  /////    LATEST UPDATES    /////
  ////////////////////////////////
  
  const parseLatestUpdatesManga = ($: CheerioStatic): MangaTile[] => {
    const latestUpdatesManga: MangaTile[] = []
  
    for (const item of $('.bixbox .listupd .utao.styletwo .uta').toArray()) {
        let url = $('a', item).attr('href')?.split("/").slice(-2, -1)[0]
        let image = $('img', item).attr('src')?.replace(/-(\d){2,}x(\d){2,}/gm, '')
        let title = decodeHTMLEntity($('.luf h4', item).text())
        let subtitle = decodeHTMLEntity($('.luf ul li', item).first().find("a").text())
    
        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue
    
        latestUpdatesManga.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle }),
        }))
    }
  
    return latestUpdatesManga
  }
  
  ///////////////////////////////
  /////    POPULAR TODAY    /////
  ///////////////////////////////
  
  const parsePopularTodayManga = ($: CheerioStatic): MangaTile[] => {
    const popularTodayManga: MangaTile[] = []
  
    for (const item of $('.bixbox.hothome .listupd .bsx').toArray()) {
        let url = $('a', item).attr('href')?.split("/").slice(-2, -1)[0]
        let image = $('img', item).attr('src')?.replace(/-(\d){2,}x(\d){2,}/gm, '')
        let title = decodeHTMLEntity($('.bigor .tt', item).text().trim())
        let subtitle = decodeHTMLEntity($('.bigor .adds .epxs', item).text().trim())
    
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
  
  //////////////////////////////
  /////    POPULAR WEEK    /////
  //////////////////////////////
  
  const parsePopularWeekManga = ($: CheerioStatic): MangaTile[] => {
    const popularWeekManga: MangaTile[] = []
  
    for (const item of $('#sidebar .wpop-weekly li').toArray()) {
        let url = $('a', item).attr('href')?.split("/").slice(-2, -1)[0]
        let image = $('img', item).attr('src')?.replace(/-(\d){2,}x(\d){2,}/gm, '')
        let title = decodeHTMLEntity($('.leftseries h2', item).text().trim())
    
        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue
  
        popularWeekManga.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title })
        }))
    }
  
    return popularWeekManga
  }

  ////////////////////////////////
  /////    POPULAR MONTHS    /////
  ////////////////////////////////
  
  const parsePopularMonthManga = ($: CheerioStatic): MangaTile[] => {
    const popularMonthsManga: MangaTile[] = []
  
    for (const item of $('#sidebar .wpop-monthly li').toArray()) {
        let url = $('a', item).attr('href')?.split("/").slice(-2, -1)[0]
        let image = $('img', item).attr('src')?.replace(/-(\d){2,}x(\d){2,}/gm, '')
        let title = decodeHTMLEntity($('.leftseries h2', item).text().trim())
    
        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue
  
        popularMonthsManga.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title })
        }))
    }
  
    return popularMonthsManga
  }

  /////////////////////////////
  /////    POPULAR ALL    /////
  /////////////////////////////
  
  const parsePopularAllManga = ($: CheerioStatic): MangaTile[] => {
    const popularAllManga: MangaTile[] = []
  
    for (const item of $('#sidebar .wpop-alltime li').toArray()) {
        let url = $('a', item).attr('href')?.split("/").slice(-2, -1)[0]
        let image = $('img', item).attr('src')?.replace(/-(\d){2,}x(\d){2,}/gm, '')
        let title = decodeHTMLEntity($('.leftseries h2', item).text().trim())
    
        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue
  
        popularAllManga.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title })
        }))
    }
  
    return popularAllManga
  }
  
  //////////////////////////////
  /////    HOME SECTION    /////
  //////////////////////////////
  
  export const parseHomeSections = ($: CheerioStatic, sections: HomeSection[], sectionCallback: (section: HomeSection) => void): void => {
    for (const section of sections) sectionCallback(section)
    const latestUpdatesManga: MangaTile[] = parseLatestUpdatesManga($)
    const popularTodayManga: MangaTile[] = parsePopularTodayManga($)
    const popularWeekManga: MangaTile[] = parsePopularWeekManga($)
    const popularMonthManga: MangaTile[] = parsePopularMonthManga($)
    const popularAllManga: MangaTile[] = parsePopularAllManga($)

  
    sections[0].items = latestUpdatesManga
    sections[1].items = popularTodayManga
    sections[2].items = popularWeekManga
    sections[3].items = popularMonthManga
    sections[4].items = popularAllManga
  
    for (const section of sections) sectionCallback(section)
  }
  
  
  //////////////////////
  /////    TAGS    /////
  //////////////////////
  
  export const parseTags = ($: CheerioStatic): TagSection[] => {
    const arrayTags: Tag[] = []
  
    for (var item of $('.taxindex li').toArray()) {
        let id = $('a', item).attr('href')?.split('/').slice(-2,-1)[0] ?? ''
        let label = capitalizeFirstLetter(decodeHTMLEntity($('span', item).text())) ?? ''

        arrayTags.push({ id: id, label: label })
    }
    const tagSections: TagSection[] = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.map(x => createTag(x)) })]
  
    return tagSections
  }
  
  /////////////////////////////////
  /////    CHECK LAST PAGE    /////
  /////////////////////////////////
  
  export const isLastPage = ($: CheerioStatic): boolean => {
    return $('.hpage .r').length == 0
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

    for (const item of $('.bixbox .listupd .utao.styletwo .uta').toArray()) {
      let id = $('a', item).attr('href')?.split("/").slice(-2, -1)[0] ?? ''
      let mangaTime = parseDate(decodeHTMLEntity(($('.luf ul li', item).first().find("span").text() ?? '').trim().split('Il y a ')[1] ?? ""))
  
      if (mangaTime != null && mangaTime > time)
        if (ids.includes(id))
          manga.push(id)
        else loadMore = false
    }
  
    return {
      ids: manga,
      loadMore
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
    return null
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