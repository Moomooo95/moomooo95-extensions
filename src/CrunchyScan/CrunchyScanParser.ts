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

export const parseCrunchyScanDetails = ($: CheerioStatic, mangaId: string): Manga => {
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
    let item = $('.summary-heading h5', info).text().trim()
    let val = $('.summary-content', info).text().trim()

    switch (item) {
        case "Rank":
        let nb_views = (val.match(/(\d+\.?\d*\w?) /gm) ?? "")[0].trim()
        const views = convertNbViews(nb_views)
        break;
        case "Alternative":
        let otherTitles = val.split('/')
        for (let title of otherTitles) {
            titles.push(decodeHTMLEntity(title.trim()))
        }
        break;
        case "Author(s)":
        author = val
        break;
        case "Artist(s)":
        artist = val
        break;
        case "Genre(s)":
        const tags = $('.summary-content .genres-content a', info).toArray()
        for (const tag of tags) {
            const label = $(tag).text()
            const id = $(tag).attr('href')?.split("/").pop() ?? label
            if (['Hentai'].includes(label) || ['Erotique'].includes(label) || ['Mature'].includes(label)) {
            hentai = true
            }
            arrayTags.push({ id: id, label: label })
        }
        break;
        case "Status":
        switch (val) {
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
    let summary = decodeHTMLEntity($('.container .summary__content').text().trim())

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

export const parseCrunchyScanChapters = ($: CheerioStatic, mangaId: string): Chapter[] => {
    const allChapters = $('option')
    const chapters: Chapter[] = []

    for (let chapter of allChapters.toArray().reverse()) {
        const id = $(chapter).attr('data-redirect') ?? ''
        const name = $(chapter).text().trim()
        const chapNum = Number( (name.match(/(\d+)(\.?)(\d*)/gm) ?? '')[0] )
        const time = new Date()

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

export const parseCrunchyScanChapterDetails = ($: CheerioStatic, mangaId: string, chapterId: string): ChapterDetails => {
    const pages: string[] = []
    const allItems = $('.page-break.no-gaps img').toArray()

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
  
    for (const item of $('.item').toArray()) {
        const url = $('.asp_res_url', item).attr('href')?.split('/').pop() ?? ''
        const title = $('.asp_res_url', item).text().trim() ?? '' 
        const image = $('.asp_image', item).attr("data-src") ?? ''
        const subtitle = ''
    
        manga.push(createMangaTile({
            id : url,
            image,
            title: createIconText({ text: title }),
            subtitleText : createIconText({ text: subtitle })
        }))
    }
  
    return manga
}


////////////////////////////////
/////    LATEST UPDATED    /////
////////////////////////////////

const parseLatestUpdatedManga = ($: CheerioStatic): MangaTile[] => {
    const latestUpdatedManga: MangaTile[] = []
  
    for (const item of $('.page-content-listing.item-default .page-item-detail.manga').toArray()) {
        let url = $('h3 a', item).attr('href')?.split("/").pop()
        let image = ($('img', item).attr('data-src') ?? "")
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

/////////////////////////////
/////    MOST VIEWED    /////
/////////////////////////////

const parseMostViewedManga = ($: CheerioStatic): MangaTile[] => {
    const mostViewedManga: MangaTile[] = []
  
    for (const item of $('.wrap #manga-slider-3 .slider__item').toArray()) {
        let url = $('h4 a', item).attr('href')?.split("/").pop()
        let image = ($('img', item).attr('src') ?? "")
        let title = $('h4 a', item).text().trim()
        let subtitle = ''
    
        if (typeof url === 'undefined' || typeof image === 'undefined') 
            continue
    
        mostViewedManga.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle })
        }))
    }
  
    return mostViewedManga
}

///////////////////////////////
/////    RANDOM MANGAS    /////
///////////////////////////////

const parseRandomManga = ($: CheerioStatic): MangaTile[] => {
    const randomManga: MangaTile[] = []
  
    for (const item of $('.wrap #manga-popular-slider-3 .slider__item').toArray()) {
        let url = $('h4 a', item).attr('href')?.split("/").pop()
        let image = ($('img', item).attr('src') ?? "")
        let title = $('h4 a', item).text().trim()
        let subtitle = $('.chapter-item .chapter', item).eq(0).text().trim()
    
        if (typeof url === 'undefined' || typeof image === 'undefined') 
            continue
  
        randomManga.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle })
        }))
    }
  
    return randomManga
}

//////////////////////////////
/////    HOME SECTION    /////
//////////////////////////////

export const parseHomeSections = ($: CheerioStatic, sections: HomeSection[], sectionCallback: (section: HomeSection) => void): void => {
    for (const section of sections) sectionCallback(section)
    const latestUpdatedManga: MangaTile[] = parseLatestUpdatedManga($)
    const mostViewedManga: MangaTile[] = parseMostViewedManga($)
    const randomManga: MangaTile[] = parseRandomManga($)
  
    sections[0].items = latestUpdatedManga
    sections[1].items = mostViewedManga
    sections[2].items = randomManga
  
    for (const section of sections) sectionCallback(section)
}

///////////////////////////
/////    VIEW MORE    /////
///////////////////////////

export const parseViewMore = ($: CheerioStatic): MangaTile[] => {
    const viewMore: MangaTile[] = []
  
    for (const item of $('.page-content-listing.item-default .page-item-detail.manga').toArray()) {
        let url = $('h3 a', item).attr('href')?.split("/").pop()
        let image = $('img', item).attr('data-src')
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
    return $('.page-content-listing.item-default .page-item-detail.manga').length == 0
}


//////////////////////
/////    TAGS    /////
//////////////////////

export const parseTags = ($: CheerioStatic): TagSection[] => {
    const arrayTags: Tag[] = []
  
    for (let item of $('.row.genres li').toArray()) {
      let id = $('a', item).attr('href')?.split('/').pop() ?? ''
      let label = $('a', item).text().trim().replace(/(\s+)\([^()]+\)/gm, '')
      let nb_manga = ($('a', item).text().trim().match(/(\d+)/gm) ?? "")[0]
      
      if (parseInt(nb_manga) > 0)
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
        new Date()
        
    return new Date(str)
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