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
        const label = capitalizeFirstLetter(decodeHTMLEntity($(tag).text()))

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
    const chapters: Chapter[] = []

    for (const chapter of $('#chapterlist li').toArray()) {
        const id = $('a', chapter).attr('href') ?? ''
        const name = decodeHTMLEntity($('.chapternum', chapter).text().trim()) != '' ? decodeHTMLEntity($('.chapternum', chapter).text().trim()) : undefined
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

    for (const item of $($.parseHTML($('noscript').text())).children().toArray()) {
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
        const image = decodeHTMLEntity($('img', item).attr("src") ?? '')
        const subtitle = decodeHTMLEntity($('.epxs', item).text().trim())

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
        const title = decodeHTMLEntity($('.name', item).text())

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
/////    LAST UPDATED     /////
///////////////////////////////

const parseLastUpdate = ($: CheerioStatic): MangaTile[] => {
    const lastUpdate: MangaTile[] = []

    for (const item of $('.postbody .listupd .bs.styletere').children().toArray()) {
        const url = $('a', item).attr('href')?.split("/")[3].replace(/-chap.*/, "") ?? 'undefined'
        const image = $('img', item).attr('src')
        const title = decodeHTMLEntity($('.tt', item).text().trim())
        const subtitle = decodeHTMLEntity($('.adds .epxs', item).text().trim())

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

///////////////////////////////
/////    POPULAR MANGA    /////
///////////////////////////////

const parsePopularManga = ($: CheerioStatic): MangaTile[] => {
    const popularManga: MangaTile[] = []

    for (const item of $('.hotslid .bs').toArray()) {
        const url = $('a', item).attr('href')?.split("/")[4]
        const image = $('img', item).attr('src')
        const title = decodeHTMLEntity($('.tt', item).text().trim())
        const subtitle = decodeHTMLEntity($('.adds .epxs', item).text().trim())

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

//////////////////////////////
/////    HOME SECTION    /////
//////////////////////////////

export const parseHomeSections = ($: CheerioStatic, sections: HomeSection[], sectionCallback: (section: HomeSection) => void): void => {
    for (const section of sections) sectionCallback(section)

    const hotManga: MangaTile[] = parseHotManga($)
    const lastUpdate: MangaTile[] = parseLastUpdate($)
    const popularManga: MangaTile[] = parsePopularManga($)

    sections[0].items = hotManga
    sections[1].items = lastUpdate
    sections[2].items = popularManga

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
        let title = decodeHTMLEntity($('a', item).first().attr('title') ?? '')
        let subtitle = decodeHTMLEntity($('.epxs', item).text())

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

    for (const item of $('.postbody .listupd').eq(1).find('.utao.styletwo').toArray()) {
        let id = ($('a', item).attr('href') ?? '').split("/")[3].replace(/-chap.*/, "") ?? ''
        let mangaTime = parseDate((($('.epxdate', item).text() ?? '').match(/^(\d){1,2} (\w)+ /gm) ?? '')[0].trim())

        if (mangaTime > time)
            if (ids.includes(id))
                manga.push(id)
            else loadMore = false
    }

    return {
        ids: manga,
        loadMore,
    }
}


//////////////////////
/////    TAGS    /////
//////////////////////

export const parseTags = ($: CheerioStatic): TagSection[] => {
    const arrayTags: Tag[] = []

    for (let item of $('.advancedsearch .dropdown-menu.c4.genrez li').toArray()) {
        let id = $('input', item).attr('value') ?? ''
        let label = capitalizeFirstLetter(decodeHTMLEntity($('label', item).text().trim()))

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
        let date = new Date()
        return new Date(date.getFullYear(), date.getMonth(), date.getDate())
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