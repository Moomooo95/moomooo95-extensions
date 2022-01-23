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

export const parseScantradMangaDetails = ($: CheerioStatic, mangaId: string): Manga => {
    const panel = $('.ct-top')

    const titles = [
        decodeHTMLEntity($('.titre', panel).clone().children().remove().end().text().trim()),
        decodeHTMLEntity($('.info .sub-i:contains("Nom alternatif :")', panel).text())
    ]
    const image = $('.ctt-img img', panel).attr('src') ?? ''
    const author = ($('.titre .titre-sub', '.ct-top').text().trim().split(/ (.+)/)[1] ?? '').split(",")[0] ?? "Unknown"
    const artist = ($('.titre .titre-sub', '.ct-top').text().trim().split(/ (.+)/)[1] ?? '').split(",")[1] ?? "Unknown"
    const rating = Number($('.mrtb-view', panel).text().trim())

    let status = MangaStatus.UNKNOWN
    switch ($('.info .sub-i:contains("Status :") span', panel).first().text().trim()) {
        case "En Cours":
            status = MangaStatus.ONGOING
            break;
        case "Terminé":
            status = MangaStatus.COMPLETED
            break;
        case "Arrêté":
            status = MangaStatus.ABANDONED
            break;
    }

    const arrayTags: Tag[] = []
    // Genres
    const genres = $('.info .sub-i:contains("Genre :") span', panel).toArray()
    if (genres.length > 0) {
        for (const genre of genres) {
            const label = capitalizeFirstLetter(decodeHTMLEntity($(genre).text().trim()))
            const id = label

            arrayTags.push({ id: id, label: label })
        }
    }
    const tagSections: TagSection[] = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.length > 0 ? arrayTags.map(x => createTag(x)) : [] })];

    const desc = decodeHTMLEntity($('.new-main p').text().trim())

    return createManga({
        id: mangaId,
        titles,
        image,
        author,
        artist,
        rating,
        status,
        tags: tagSections,
        desc,
        hentai: false
    })
}


//////////////////////////
/////    CHAPTERS    /////
//////////////////////////

export const parseScantradChapters = ($: CheerioStatic, mangaId: string): Chapter[] => {
    const chapters: Chapter[] = []

    for (let chapter of $('#chapitres .chapitre').toArray()) {
        const id = ($('.hm-link', chapter).attr('href')?.split('/')[0] == "https:") ? $('.hm-link', chapter).attr('href') ?? '' : "https://scantrad.net" + $('.hm-link', chapter).attr('href') ?? ''
        const name = decodeHTMLEntity($('.chl-titre', chapter).text().trim()) != '' ? decodeHTMLEntity($('.chl-titre', chapter).text().trim()) : undefined
        const chapNum = Number(decodeHTMLEntity($('.chl-titre', chapter).text().trim()).split(' ')[1])
        const time = parseDate($('.chl-date', chapter).text().trim())

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

export const parseScantradChapterDetails = ($: CheerioStatic, mangaId: string, chapterId: string): ChapterDetails => {
    const pages: string[] = []

    for (let item of $('.main .main_img .sc-lel').toArray()) {
        let page = ($('img', item).attr('data-src')?.split('/')[0] == "https:") ? $('img', item).attr('data-src') ?? "" : "https://scan-trad.fr/" + $('img', item).attr('data-src')

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

    for (const item of $('a').toArray()) {
        const url = $(item).attr('href')?.split('/')[1] ?? ''
        const title = decodeHTMLEntity($('.rgr-titre', item).text().trim())
        const image = $('img', item).attr('src') ?? ''
        const subtitle = decodeHTMLEntity($('.rgr-lastChap', item).text().split(':')[1].trim())

        manga.push(createMangaTile({
            id: url,
            image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle })
        }))
    }

    return manga
}


////////////////////////////////
/////    TOP DECOUVERTE    /////
////////////////////////////////

const parseTopDiscoverManga = ($: CheerioStatic): MangaTile[] => {
    const topDiscoverManga: MangaTile[] = []

    for (const item of $('.pp-main .sc-lel').toArray()) {
        const url = $('.ppo-left a', item).attr('href')?.split('/')[1] ?? ''
        const title = decodeHTMLEntity($('.pp-sub', item).text().trim())
        const image = $('.main_img #' + $(item).attr('id') + ' img').attr('data-src') ?? ''

        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue

        topDiscoverManga.push(createMangaTile({
            id: url,
            image,
            title: createIconText({ text: title })
        }))
    }

    return topDiscoverManga
}

//////////////////////////////////////
/////    DERNIERS MANGA SORTI    /////
//////////////////////////////////////

const parseLatestManga = ($: CheerioStatic): MangaTile[] => {
    const latestManga: MangaTile[] = []

    for (const item of $('.home #home-chapter .home-manga').toArray()) {
        const url = $('.hmi-titre', item).attr('href')
        const title = decodeHTMLEntity($('.hmi-titre', item).text().trim())
        const image = $('.hm-image img', item).attr('data-src') ?? ''
        const subtitle = decodeHTMLEntity($('.hmi-sub', item).text().trim())

        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue

        latestManga.push(createMangaTile({
            id: url,
            image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle }),
        }))
    }

    return latestManga
}

////////////////////////////////
/////    TOUS LES MANGA    /////
////////////////////////////////

const parseAllManga = ($: CheerioStatic): MangaTile[] => {
    const allManga: MangaTile[] = []

    for (const item of $('.new-manga .manga').toArray()) {
        const url = $('.manga_img a', item).attr('href')?.split('/')[1] ?? ''
        const title = decodeHTMLEntity($('.manga_right .mr-info .mri-top', item).text().trim())
        const image = $('.manga_img img', item).attr('data-src') ?? ''
        const subtitle = "Chapitre " + decodeHTMLEntity($('.manga_right .mr-info .mri-bot', item).text().replace(/^Dernier chapitre :/gm, '').trim())

        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue

        allManga.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle }),
        }))
    }

    return allManga
}

//////////////////////////////
/////    HOME SECTION    /////
//////////////////////////////

export const parseHomeSections = ($: CheerioStatic, sections: HomeSection[], sectionCallback: (section: HomeSection) => void): void => {
    for (const section of sections) sectionCallback(section)
    const topDiscoverManga: MangaTile[] = parseTopDiscoverManga($)
    const latestManga: MangaTile[] = parseLatestManga($)

    sections[0].items = topDiscoverManga
    sections[1].items = latestManga

    for (const section of sections) sectionCallback(section)
}

//////////////////////////////////
/////    HOME SECTION TWO    /////
//////////////////////////////////

export const parseMangaSectionOthers = ($: CheerioStatic, sections: HomeSection[], sectionCallback: (section: HomeSection) => void): void => {
    for (const section of sections) sectionCallback(section)
    const allManga: MangaTile[] = parseAllManga($)

    sections[0].items = allManga

    for (const section of sections) sectionCallback(section)
}

///////////////////////////
/////    VIEW MORE    /////
///////////////////////////

export const parseViewMore = ($: CheerioStatic, section: string): MangaTile[] => {
    switch (section) {
        case 'latest_updates':
            return parseLatestManga($)
        default:
            return []
    }
}

/////////////////////////////////
/////    CHECK LAST PAGE    /////
/////////////////////////////////

export const isLastPage = ($: CheerioStatic): boolean => {
    return $('.home #home-chapter .home-manga').length == 0
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

    for (const item of $('.home #home-chapter .home-manga').toArray()) {
        let id = ($('.hm-info .hmi-sub', item).attr('href') ?? '').split('/').slice(-2, -1)[0]
        let mangaTime = parseDate($('.hmr-date', item).clone().children().remove().end().text().trim())

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


/////////////////////////////////
/////    ADDED FUNCTIONS    /////
/////////////////////////////////

function decodeHTMLEntity(str: string) {
    return str.replace(/&#(\d+);/g, function (match, dec) {
        return String.fromCharCode(dec);
    })
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