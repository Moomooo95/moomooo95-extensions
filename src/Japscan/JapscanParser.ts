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

const JAPSCAN_DOMAIN = "https://www.japscan.me";

///////////////////////////////
/////    MANGA DETAILS    /////
///////////////////////////////

export const parseJapscanMangaDetails = ($: CheerioStatic, mangaId: string): Manga => {
    const panel = $('#main>.card').first()

    let titles = [decodeHTMLEntity($('h1', panel).text().trim().split(/ (.+)/)[1] ?? "")]
    const image = `${JAPSCAN_DOMAIN}${$('img', panel).attr('src')}`
    const author = $('span:contains("Auteur(s)")', panel).parent().clone().children().remove().end().text().trim() ?? "Unknown"
    const artist = $('span:contains("Artiste(s):")', panel).parent().clone().children().remove().end().text().trim() ?? "Unknown"
   
    let status = MangaStatus.UNKNOWN
    switch ($('span:contains("Statut:")', panel).parent().clone().children().remove().end().text().trim()) {
      case "En Cours":
        status = MangaStatus.ONGOING
        break;
      case "Terminé":
        status = MangaStatus.COMPLETED
        break;
    }
  
    let othersTitles = $('span:contains("Nom(s) Alternatif(s):")', panel).parent().find('a').toArray()
    for (let title of othersTitles) {   
        titles.push(decodeHTMLEntity($(title).text()))
    }

    const arrayTags: Tag[] = []
    // Genres
    const genres = $('span:contains("Genre(s):")', panel).parent().clone().children().remove().end().text().trim().split(",")
    if (genres.length > 0)
    {
      for (const genre of genres) {
        const label = genre.trim()
        const id = genre.trim().replace(" ", "-").toLowerCase().trim() ?? label

        arrayTags.push({ id: id, label: label })
    }
    }
    const tagSections: TagSection[] = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.length > 0 ? arrayTags.map(x => createTag(x)) : [] })];
  
    const desc = decodeHTMLEntity($('div:contains("Synopsis:")', panel).next().text().trim())
  
    return createManga({
        id: mangaId,
        titles,
        image,
        status,
        artist,
        author,
        tags: tagSections,
        rating: Number(undefined),
        desc,
        hentai: false
    })
}

//////////////////////////
/////    CHAPTERS    /////
//////////////////////////

export const parseJapscanChapters = ($: CheerioStatic, mangaId: string): Chapter[] => {
    const chapters: Chapter[] = []

    for (let chapter of $('#chapters_list .chapters_list.text-truncate').toArray()) {
        const id = `${JAPSCAN_DOMAIN}${$('a', chapter).attr('href')}`
        const name = decodeHTMLEntity(($('a', chapter).text().split('VF:')[1] ?? '').trim())  ?? ''
        const chapNum = Number(($('a', chapter).attr('href') ?? '').split('/')[3])
        const volume = Number(($(chapter).parent().prev().text().trim().match(/^Volume \d{1,3}/g) ?? ["Nan"])[0]?.split(" ").pop())
        const time = new Date($('span', chapter).text() ?? '')

        if (isNaN(volume)) {
            chapters.push(createChapter({
                id,
                mangaId,
                name,
                langCode: LanguageCode.FRENCH,
                chapNum,
                time
            }))
        }
        else {
            chapters.push(createChapter({
                id,
                mangaId,
                name,
                langCode: LanguageCode.FRENCH,
                chapNum,
                volume,
                time
            }))
        }
    }

    return chapters
}

/////////////////////////////////
/////    CHAPTER DETAILS    /////
/////////////////////////////////

export const parseJapscanChapterDetails = (data: any, mangaId: string, chapterId: string): ChapterDetails => {
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
/////    SEARCH    /////
////////////////////////

export const parseSearch = (data: string): MangaTile[] => {
    const manga: MangaTile[] = []
    const items = JSON.parse(data)

    for(let item of items) {
        let id = item.url.split('/')[2]
        let image = `${JAPSCAN_DOMAIN}/imgs/mangas/${id}.jpg`
        let title = decodeHTMLEntity(item.name)

        manga.push(createMangaTile({
            id: id,
            title: createIconText({ text: title }),
            image: image
        }))
    }
  
    return manga
}

//////////////////////////////////////
/////    DERNIERS MANGA SORTI    /////
//////////////////////////////////////

const parseLatestManga = ($: CheerioStatic, num_tab?: number): MangaTile[] => {
    const latestManga: MangaTile[] = []

    if (num_tab == undefined) {
        num_tab = 1
    }

    for (const item of $('#tab-'+ num_tab +' .chapters_list .text-truncate:first-child').toArray()) {
        const id = $('a', item).attr('href')?.split('/')[2] ?? ''
        const title = decodeHTMLEntity($('a', item).text().trim().split(" ").slice(0, -2).join(" "))
        const image = `${JAPSCAN_DOMAIN}/imgs/mangas/${id}.jpg`
        const subtitle = "Chapitre " + (($('a', item).text().trim().match(/\d*[.]?\d+\s{1}VF/gm) ?? '')[0] ?? '').split(/\s{1}/gm)[0]

        if (typeof id === 'undefined' || typeof image === 'undefined') 
            continue

        latestManga.push(createMangaTile({
            id,
            image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle }),
        }))
    }

    return latestManga
}

///////////////////////////
/////    TOP MANGA    /////
///////////////////////////

const parseTopManga = ($: CheerioStatic, period: string): MangaTile[] => {
    const topManga: MangaTile[] = []

    for (const item of $('#'+ period +" li").toArray()) {
        const id = $('a', item).first().attr('href')?.split('/')[2] ?? ''
        const title = decodeHTMLEntity($('a', item).first().text())
        const image = `${JAPSCAN_DOMAIN}/imgs/mangas/${id}.jpg`
        const subtitle = $('a', item).eq(1).text().replace("Chap", "Chapitre")

        if (typeof id === 'undefined' || typeof image === 'undefined') 
            continue

        topManga.push(createMangaTile({
            id,
            image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle }),
        }))
    }

    return topManga
}

//////////////////////////////
/////    HOME SECTION    /////
//////////////////////////////

export const parseHomeSections = ($: CheerioStatic, sections: HomeSection[], sectionCallback: (section: HomeSection) => void): void => {
    for (const section of sections) sectionCallback(section)

    if (sections[0] != undefined && sections[1] != undefined && sections[2] != undefined && sections[3] != undefined) {
        const latestManga: MangaTile[] = parseLatestManga($)
        const topMangaToday: MangaTile[] = parseTopManga($, sections[1].id)
        const topMangaWeek: MangaTile[] = parseTopManga($, sections[2].id)
        const topMangaAllTime: MangaTile[] = parseTopManga($, sections[3].id)
    
        sections[0].items = latestManga
        sections[1].items = topMangaToday
        sections[2].items = topMangaWeek
        sections[3].items = topMangaAllTime
    }
    

    for (const section of sections) sectionCallback(section)
}

///////////////////////////
/////    VIEW MORE    /////
///////////////////////////

export const parseViewMore = ($: CheerioStatic, page: number): MangaTile[] => {
    return parseLatestManga($, page)
}

///////////////////////////////
/////    UPDATED MANGA    /////
///////////////////////////////

export interface UpdatedManga {
    ids: string[];
    loadMore: boolean;
}

export const parseUpdatedManga = ($: CheerioStatic, time: Date, ids: string[]): UpdatedManga => {
    let page = 1
    let loadMore = true
    const updatedManga: string[] = []

    while (page <= 8) {
        for (const item of $('#tab-' + page + ' .chapters_list .text-truncate:first-child').toArray()) {
            let id = $('a', item).attr('href')?.split('/')[2] ?? ''
            let date = new Date()
            date = new Date(date.getFullYear(), date.getMonth(), date.getDate() - (page - 1))
    
            if (typeof id === 'undefined' || typeof date === 'undefined')
                continue
    
            if (date > time) {
                if (ids.includes(id)) {
                    updatedManga.push(id)
                }
            } else {
                loadMore = false
            }
        }
        page++
    }
    

    return {
        ids: updatedManga,
        loadMore,
    }
}

/////////////////////////////////
/////    ADDED FUNCTIONS    /////
/////////////////////////////////

function decodeHTMLEntity(str: string) {
    return str.replace(/&#(\d+);/g, function (_match, dec) {
        return String.fromCharCode(dec);
    })
}
