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
    const image = $('.summary_image img', panel).attr('data-src') ?? ""
    const rating = Number($('.post-total-rating .score', panel).text().trim())
    const arrayTags: Tag[] = []

    
    let author = $('.post-content_item:contains("Author(s)") .summary-content', panel).text().trim() ?? "Unknown"
    let artist = $('.post-content_item:contains("Artist(s)") .summary-content', panel).text().trim() ?? "Unknown"
    let hentai = false

    let views = convertNbViews(($('.post-content_item:contains("Rank") .summary-content', panel).text().trim().match(/(\d+\.?\d*\w?) /gm) ?? '')[0].trim() ?? '')
    let otherTitles = $('.post-content_item:contains("Alternative") .summary-content', panel).text().trim().split('/')
    for (let title of otherTitles) {
        titles.push(decodeHTMLEntity(title.trim()))
    }

    const tags = $('.post-content_item:contains("Genre(s)") .summary-content a', panel).toArray()
    for (const tag of tags) {
        const label = $(tag).text()
        const id = $(tag).attr('href')?.split("/").slice(-2, -1)[0] ?? label
        if (['Hentai'].includes(label) || ['Erotique'].includes(label) || ['Mature'].includes(label)) {
            hentai = true
        }
        arrayTags.push({ id: id, label: label })
    }
    const tagSections: TagSection[] = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.length > 0 ? arrayTags.map(x => createTag(x)) : [] })];
    
    let status = MangaStatus.UNKNOWN
    switch ($('.post-content_item:contains("Status") .summary-content', panel).text().trim()) {
        case "Terminé":
        status = MangaStatus.COMPLETED
        break;
        case "En cours":
        status = MangaStatus.ONGOING
        break;
    }

    let summary = decodeHTMLEntity($('.container .summary__content').text().trim())

    return createManga({
        id: mangaId,
        titles,
        image,
        author,
        artist,
        rating,
        views,
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
    const allChapters = $('.main .wp-manga-chapter')
    const chapters: Chapter[] = []

    for (let chapter of allChapters.toArray()) {
        const id = $('a', chapter).attr('href') ?? ''
        const name = $('a', chapter).text().trim()
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

export const parseCrunchyScanChapterDetails = (data: string, mangaId: string, chapterId: string): ChapterDetails => {
    const pages: string[] = []

    for(let item of JSON.parse(data)) {
        let page = encodeURI(item)

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
        const url = $('.asp_res_url', item).attr('href')?.split('/').slice(-2, -1)[0] ?? ''
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
        let url = $('h3 a', item).attr('href')?.split("/").slice(-2, -1)[0]
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
        let url = $('h4 a', item).attr('href')?.split("/").slice(-2, -1)[0]
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
        let url = $('h4 a', item).attr('href')?.split("/").slice(-2, -1)[0]
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