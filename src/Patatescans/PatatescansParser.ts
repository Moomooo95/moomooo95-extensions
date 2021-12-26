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

export const parsePatatescansDetails = ($: CheerioStatic, mangaId: string): Manga => {
    const panelL = $('.info-left')   
    
    const image = $('.thumb img', panelL).attr('src') ?? ''
    const status = ($('.tsinfo.bixbox .imptdt:contains("Status") i', panelL).text().trim() == "Ongoing") ? MangaStatus.ONGOING : MangaStatus.UNKNOWN
    const author = $('.tsinfo.bixbox .imptdt:contains("Auteur") i', panelL).text().trim() ?? "Unknown"
    const artist = $('.tsinfo.bixbox .imptdt:contains("Artiste") i', panelL).text().trim() ?? "Unknown"
    const rating = Number($('.rating .num', panelL).text().trim())
    const follows = Number($('.bmc', panelL).text().trim().replace(/[^\d]/g, ""))
    const lastUpdate = new Date($('.tsinfo.bixbox .imptdt:contains("Mis à jour le") i time', panelL).attr('datetime') ?? '')

    const panelR = $('.info-right')

    const titles = [decodeHTMLEntity($('.entry-title', panelR).text().trim())]
    const othersTitles = $('.alternative', panelR).text().trim().split(',')
    for (const title of othersTitles) {   
        titles.push(decodeHTMLEntity(title.trim()))
    }
    const arrayTags: Tag[] = []
    const tags = $('.info-desc.bixbox .mgen a', panelR).toArray()
    let hentai = false
    for (const tag of tags) {
        const id = $(tag).first().attr('href')?.split("/")[4] ?? ''
        const label = $(tag).text()

        if (['Dépravé'].includes(label) || ['Hentai'].includes(label)) {
            hentai = true
        }

        arrayTags.push({ id: id, label: label })
    }
    const tagSections: TagSection[] = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.length > 0 ? arrayTags.map(x => createTag(x)) : [] })];
    const desc = decodeHTMLEntity($('.entry-content-single', panelR).text().trim())

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
        hentai
    })
}


//////////////////////////
/////    Chapters    /////
//////////////////////////

export const parsePatatescansChapters = ($: CheerioStatic, mangaId: string): Chapter[] => {
    const allChapters = $('#chapterlist li')
    const chapters: Chapter[] = []

    for (const chapter of allChapters.toArray()) {
        const id = $('a', chapter).attr('href') ?? ''
        const name = $('.chapternum', chapter).text().trim()
        const chapNum = Number($('.chapternum', chapter).text().split(' ')[1].trim())
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


//////////////////////////////////
/////    Chapters Details    /////
//////////////////////////////////

export const parsePatatescansChapterDetails = ($: CheerioStatic, mangaId: string, chapterId: string): ChapterDetails => {
    const pages: string[] = []
    const allItems = $($.parseHTML($('noscript').text())).children().toArray()

    for (const item of allItems) {
        const page = $(item).attr('src')

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
        const subtitle = $('.epxs', item).text().trim()

        manga.push(createMangaTile({
            id,
            image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle })
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
        const url = $('a', item).first().attr('href')?.split("/")[4]
        const image = ($('.bigbanner', item).attr('style') ?? "").split('\'')[1]
        const title = $('.name', item).text()

        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue

        hotManga.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title })
        }))
    }

    return hotManga
}

///////////////////////////////
/////    POPULAR MANGA    /////
///////////////////////////////

const parsePopularManga = ($: CheerioStatic): MangaTile[] => {
    const popularManga: MangaTile[] = []

    for (const item of $('.hotslid .bs').toArray()) {
        const url = $('a', item).attr('href')?.split("/")[4]
        const image = $('img', item).attr('src')
        const title = $('.tt', item).text().trim()
        const subtitle = $('.adds .epxs', item).text().trim()

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

///////////////////////////////
/////    LAST UPDATED     /////
///////////////////////////////

const parseLastUpdate = ($: CheerioStatic): MangaTile[] => {
    const lastUpdate: MangaTile[] = []

    for (const item of $('.postbody .listupd .bs.styletere').children().toArray()) {
        const url = $('a', item).attr('href')?.split("/")[3].replace(/-chapitre.*/, "") ?? 'undefined'
        const image = $('img', item).attr('src')
        const title = $('.tt', item).text().trim()
        const subtitle = $('.adds .epxs', item).text().trim()

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
/////    HOME SECTION    /////
//////////////////////////////

export const parseHomeSections = ($: CheerioStatic, sections: HomeSection[], sectionCallback: (section: HomeSection) => void): void => {
    for (const section of sections) sectionCallback(section)

    const hotManga: MangaTile[] = parseHotManga($)
    const popularManga: MangaTile[] = parsePopularManga($)
    const lastUpdate: MangaTile[] = parseLastUpdate($)

    sections[0].items = hotManga
    sections[1].items = popularManga
    sections[2].items = lastUpdate

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

    for (let item of $('.advancedsearch .dropdown-menu.c4.genrez li').toArray()) {
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


export function parseDateChap(str: string) {
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

export function parseDate(str: string) {
    str = str.trim()
    if (str.length == 0) {
        let date = new Date()
        return new Date(date.getFullYear(), date.getMonth(), date.getDate())
    }

    switch (str.split(' ').pop()) {
        case "minutes":
            let minutes = new Date()
            return new Date(minutes.getFullYear(), minutes.getMonth(), minutes.getDate(), minutes.getHours(), minutes.getMinutes() - parseInt(str.split(' ')[0]))
        case "heures":
            let hours = new Date()
            return new Date(hours.getFullYear(), hours.getMonth(), hours.getDate(), hours.getHours() - parseInt(str.split(' ')[0]))
        case "jours":
            let day = new Date()
            return new Date(day.getFullYear(), day.getMonth(), day.getDate() - parseInt(str.split(' ')[0]))
        case "semaines":
            let week = new Date()
            return new Date(week.getFullYear(), week.getMonth(), week.getDate() - (7 * parseInt(str.split(' ')[0])))
        case "mois":
            let month = new Date()
            return new Date(month.getFullYear(), month.getMonth() - parseInt(str.split(' ')[0]), month.getDate() - 1)
        default:
            return new Date()
    }
}