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
  
export const parseFuryoSquadMangaDetails = ($: CheerioStatic, mangaId: string): Manga => {
    let titles = [decodeHTMLEntity($('.fs-comic-title').text().trim())]
    const image = $('.comic-cover').attr('src') ?? ""
  
    const panel = $('.fs-comic-text-container')
  
    const status = MangaStatus.UNKNOWN
    const author = $('p[class="fs-comic-label"]:contains("Scénario")', panel).next().text()
    const artist = $('p[class="fs-comic-label"]:contains("Dessins")', panel).next().text()
  
    const arrayTags: Tag[] = []
    const genres = $('p[class="fs-comic-label"]:contains("Genre")', panel).next().text().split(',')
    const type = $('p[class="fs-comic-label"]:contains("Type")', panel).next().text()
    const desc = decodeHTMLEntity($('.fs-comic-description', panel).text().trim())

    let hentai = false

    // Genres
    if (genres.length > 0) {
      for (const item of genres) {
        const label = item.trim()
        const id = label
        arrayTags.push({ id: id, label: label })

        if (['Gore'].includes(label)) {
            hentai = true
        }
      }
    }

    // Type
    arrayTags.push({ id: type, label: type })

    const tagSections: TagSection[] = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.length > 0 ? arrayTags.map(x => createTag(x)) : [] })];
  
    return createManga({
        id: mangaId,
        titles,
        image,
        status,
        artist,
        author,
        tags: tagSections,
        desc,
        hentai
    })
}


//////////////////////////
/////    CHAPTERS    /////
//////////////////////////

export const parseFuryoSquadChapters = ($: CheerioStatic, mangaId: string): Chapter[] => {
    const allChapters = $('.fs-chapter-list')
    const chapters: Chapter[] = []
    
    for (let chapter of $('.element.desktop', allChapters).toArray()) {
        const id: string = $('a', chapter).eq(1).attr('href') ?? ''
        const name: string = $('.title', chapter).text() ?? '' + " : " + $('.name', chapter).text() ?? ''
        const chapNum: number = Number(name.split(' ').pop())
        const time: Date = parseDate($('.meta_r', chapter).text())
    
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

export const parseFuryoSquadChapterDetails = ($: CheerioStatic, mangaId: string, chapterId: string): ChapterDetails => {
    const pages: string[] = []
    const allItems = $('img', '.fs-reader-page').toArray()
  
    for(let item of allItems) {
        let page = $(item).attr('src')?.trim()
    
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
  
    for (const item of $('.group').toArray()) {
        let url = $('.title a', item).attr('href')?.split("/")[4]
        let image = ""
        let title = decodeHTMLEntity($('.title', item).text())
        let subtitle = decodeHTMLEntity($('.element .title a', item).text().trim())
        
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


/////////////////////////////////////
/////    LAST MANGAS UPDATED    /////
/////////////////////////////////////

const parseLatestManga = ($: CheerioStatic): MangaTile[] => {
    const latestManga: MangaTile[] = []
  
    for (const item of $('table tbody tr').toArray()) {
        let url = $('.fs-comic-title a', item).attr('href')?.split("/").pop()
        let image = $('.fs-chap-img', item).attr('src')
        let title = decodeHTMLEntity($('.fs-comic-title', item).text())
        let subtitle = $('.fs-chapter', item).text() + " : " + $('.fs-chap-name', item).text()
    
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
/////    MANGAS ONGOING    /////
////////////////////////////////

const parseOngoingManga = ($: CheerioStatic): MangaTile[] => {
    const ongoingManga: MangaTile[] = []
    const panel = $('#fs-en-cours')
  
    for (const item of $('.fs-card-container.desktop .grid-item-container', panel).toArray()) {
        let url = $('.fs-comic-title a', item).attr('href')?.split("/").pop()
        let image = $('.fs-chap-img', item).attr('src')
        let title = decodeHTMLEntity($('.fs-comic-title', item).text())
        let subtitle = ''
    
        if (typeof url === 'undefined' || typeof image === 'undefined') 
            continue
    
        ongoingManga.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle }),
        }))
    }
  
    return ongoingManga
}

/////////////////////////////////
/////    MANGAS FINISHED    /////
/////////////////////////////////

const parseFinishedManga = ($: CheerioStatic): MangaTile[] => {
    const finishedManga: MangaTile[] = []
    const panel = $('#fs-termines')
  
    for (const item of $('.fs-card-container.desktop .grid-item-container', panel).toArray()) {
        let url = $('.fs-comic-title a', item).attr('href')?.split("/").pop()
        let image = $('.fs-chap-img', item).attr('src')
        let title = decodeHTMLEntity($('.fs-comic-title', item).text())
        let subtitle = ''
    
        if (typeof url === 'undefined' || typeof image === 'undefined') 
            continue
    
        finishedManga.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle }),
        }))
    }
  
    return finishedManga
}

////////////////////////////////
/////    MANGAS STOPPED    /////
////////////////////////////////

const parseStoppedManga = ($: CheerioStatic): MangaTile[] => {
    const stoppedManga: MangaTile[] = []
    const panel = $('#fs-stoppes')
  
    for (const item of $('.fs-card-container.desktop .grid-item-container', panel).toArray()) {
        let url = $('.fs-comic-title a', item).attr('href')?.split("/").pop()
        let image = $('.fs-chap-img', item).attr('src')
        let title = decodeHTMLEntity($('.fs-comic-title', item).text())
        let subtitle = ''
    
        if (typeof url === 'undefined' || typeof image === 'undefined') 
            continue
    
        stoppedManga.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle }),
        }))
    }
  
    return stoppedManga
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

////////////////////////////////
/////    MANGAS SECTION    /////
////////////////////////////////

export const parseMangasSections = ($: CheerioStatic, sections: HomeSection[], sectionCallback: (section: HomeSection) => void): void => {
    for (const section of sections) sectionCallback(section)
    const ongoingManga: MangaTile[] = parseOngoingManga($)
    const finishedManga: MangaTile[] = parseFinishedManga($)
    const stoppedManga: MangaTile[] = parseStoppedManga($)

    sections[0].items = ongoingManga
    sections[1].items = finishedManga
    sections[2].items = stoppedManga

    for (const section of sections) sectionCallback(section)
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
    if (str.length == 0) {
        let date = new Date()
        return new Date(date.getFullYear(), date.getMonth(), date.getDate())
    }

    switch (str.trim()) {
        case "Aujourd'hui":
        let today = new Date()
        return new Date(today.getFullYear(), today.getMonth(), today.getDate())
        
        case "Hier":
        let yesterday = new Date()
        return new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()-1)

        default:
        let date = str.split("/")
        return new Date(parseInt(date[2]), parseInt(date[1])-1, parseInt(date[0]))
    }
}