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
    const image = $('.summary_image img', panel).attr('data-src') ?? ''
    const author = $('.post-content_item:contains("Author(s)") .summary-content', panel).text().trim() ?? undefined
    const artist = $('.post-content_item:contains("Artist(s)") .summary-content', panel).text().trim() ?? undefined
    const rating = Number($('.post-total-rating .score', panel).text().trim())
    const views = convertNbViews($('.post-content_item:contains("Rank") .summary-content', panel).text().trim().match(/(\d+\.?\d*\w?) /gm)![0]?.trim() ?? '')
    let hentai = false

    for (let title of $('.post-content_item:contains("Alternative") .summary-content', panel).text().trim().split('/')) {
        titles.push(decodeHTMLEntity(title.trim()))
    }

    const arrayTags: Tag[] = []
    for (const tag of $('a[href*=manga-genre]', panel).toArray()) {
        const label = $(tag).text()
        const id = $(tag).attr('href')?.split("/").slice(-2, -1)[0] ?? label
        if (['Hentai'].includes(label) || ['Erotique'].includes(label) || ['Mature'].includes(label)) {
            hentai = true
        }
        arrayTags.push({ id, label })
    }
    const tags: TagSection[] = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.length > 0 ? arrayTags.map(x => createTag(x)) : [] })];

    let status = MangaStatus.UNKNOWN
    switch ($('.post-content_item:contains("Status") .summary-content', panel).text().trim()) {
        case "Terminé":
            status = MangaStatus.COMPLETED
            break;
        case "En cours":
            status = MangaStatus.ONGOING
            break;
    }

    let desc = decodeHTMLEntity($('.container .summary__content').text().trim())

    return createManga({
        id: mangaId,
        titles,
        image,
        author,
        artist,
        rating,
        views,
        status,
        tags,
        desc,
        hentai
    })
}

///////////////////////////////
/////    CHAPTERS LIST    /////
///////////////////////////////

export const parseCrunchyScanChapters = ($: CheerioStatic, mangaId: string): Chapter[] => {
    const chapters: Chapter[] = []

    for (let chapter of $('.main .wp-manga-chapter').toArray()) {
        const id = $('a', chapter).attr('href') + "?style=list" ?? ''
        const name = $('a', chapter).text().trim().split('-')[1]?.trim()
        const chapNum = Number($('a', chapter).text().trim().split('-')[0]?.trim().split(' ')[1]?.trim())
        const time = parseDate($('.chapter-release-date i', chapter).text().trim())

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

    for (let item of JSON.parse(data)) {
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

export const parseSearch = ($: CheerioStatic): MangaTile[] => {
    const manga: MangaTile[] = []

    for (const item of $('.row .c-tabs-item__content').toArray()) {
        const id = $('h3 a', item).attr('href')?.split('/')[4] ?? ''
        const title = decodeHTMLEntity($('h3 a', item).text()) ?? ''
        const image = getURLImage($, item)
        const subtitle = ''

        if (typeof id === 'undefined' || typeof image === 'undefined')
            continue

        manga.push(createMangaTile({
            id,
            image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle })
        }))
    }

    return manga
}

/////////////////////
/////    HOT    /////
/////////////////////

const parseHotManga = ($: CheerioStatic): MangaTile[] => {
    const hotManga: MangaTile[] = []

    for (const item of $('.wrap #manga-slider-3 .slider__item').toArray()) {
        let id = $('h4 a', item).attr('href')?.split("/").slice(-2, -1)[0]
        let image = encodeURI($('img', item).attr('src') ?? "")
        let title = $('h4 a', item).text().trim()

        if (typeof id === 'undefined' || typeof image === 'undefined')
            continue

        hotManga.push(createMangaTile({
            id,
            image,
            title: createIconText({ text: title })
        }))
    }

    return hotManga
}

////////////////////////////////
/////    LATEST UPDATED    /////
////////////////////////////////

const parseLatestUpdatedManga = ($: CheerioStatic): MangaTile[] => {
    const latestUpdatedManga: MangaTile[] = []

    for (const item of $('.page-content-listing.item-default .page-item-detail.manga').toArray()) {
        let id = $('h3 a', item).attr('href')?.split("/").slice(-2, -1)[0]
        let image = getURLImage($, item)
        let title = decodeHTMLEntity($('h3 a', item).text().trim())
        let subtitle = $('.chapter-item .chapter.font-meta', item).eq(0).text().trim()

        if (typeof id === 'undefined' || typeof image === 'undefined')
            continue

        latestUpdatedManga.push(createMangaTile({
            id,
            image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle })
        }))
    }

    return latestUpdatedManga
}

////////////////////////
/////    TRENDS    /////
////////////////////////

const parseTrendsManga = ($: CheerioStatic): MangaTile[] => {
    const trendsManga: MangaTile[] = []

    for (const item of $('#manga-recent-3 .popular-item-wrap').toArray()) {
        let id = $('h5 a', item).attr('href')?.split("/").slice(-2, -1)[0]
        let image = getURLImage($, item).replace('-75x106', '-175x238')
        let title = $('h5 a', item).text().trim()
        let subtitle = $('.chapter-item .chapter.font-meta', item).eq(0).text().trim()

        if (typeof id === 'undefined' || typeof image === 'undefined')
            continue

        trendsManga.push(createMangaTile({
            id,
            image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle })
        }))
    }

    return trendsManga
}

//////////////////////////////
/////    HOME SECTION    /////
//////////////////////////////

export const parseHomeSections = ($: CheerioStatic, sections: HomeSection[], sectionCallback: (section: HomeSection) => void): void => {
    for (const section of sections) sectionCallback(section)
    const hotManga: MangaTile[] = parseHotManga($)
    const latestUpdatedManga: MangaTile[] = parseLatestUpdatedManga($)
    const trendsManga: MangaTile[] = parseTrendsManga($)

    sections[0]!.items = hotManga
    sections[1]!.items = latestUpdatedManga
    sections[2]!.items = trendsManga

    for (const section of sections) sectionCallback(section)
}

///////////////////////////
/////    VIEW MORE    /////
///////////////////////////

export const parseViewMore = ($: CheerioStatic): MangaTile[] => {
    const viewMore: MangaTile[] = []

    for (const item of $('.page-content-listing.item-default .page-item-detail.manga').toArray()) {
        let id = $('h3 a', item).attr('href')?.split("/").slice(-2, -1)[0]
        let image = getURLImage($, item)
        let title = decodeHTMLEntity($('h3 a', item).text().trim())
        let subtitle = $('.chapter-item .chapter', item).eq(0).text().trim()

        if (typeof id === 'undefined' || typeof image === 'undefined')
            continue

        viewMore.push(createMangaTile({
            id,
            image,
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
    const arrayGenres: Tag[] = []
    const arrayGenresConditions: Tag[] = []
    const arrayAdultContent: Tag[] = []
    const arrayStatutManga: Tag[] = []
    const arrayTypeManga: Tag[] = []

    // Genres
    for (let item of $('#search-advanced .checkbox-group .checkbox').toArray()) {
        let id = $('input', item).attr('value') ?? ''
        let label = decodeHTMLEntity($('label', item).text().trim())

        arrayGenres.push({ id, label })
    }
    // Genres Conditions
    for (let item of $('#search-advanced .form-group .form-control').eq(0).children().toArray()) {
        let id = $(item).attr('value') ?? ''
        let label = decodeHTMLEntity($(item).text().trim())

        arrayGenresConditions.push({ id, label })
    }
    // Adult Content
    for (let item of $('#search-advanced .form-group .form-control').eq(2).children().toArray()) {
        let id = $(item).attr('value') ?? ''
        let label = decodeHTMLEntity($(item).text().trim())

        arrayAdultContent.push({ id, label })
    }
    // Statut
    for (let item of $('#search-advanced .form-group').eq(4).children('.checkbox-inline').toArray()) {
        let id = $('input', item).attr('value') ?? ''
        let label = decodeHTMLEntity($('label', item).text().trim())

        arrayStatutManga.push({ id, label })
    }
    // Type
    for (let item of $('#search-advanced .form-group .form-control').eq(3).children().toArray()) {
        let id = $(item).attr('value') ?? ''
        let label = decodeHTMLEntity($(item).text().trim())

        arrayTypeManga.push({ id, label })
    }

    return [
        createTagSection({ id: '0', label: 'Genres', tags: arrayGenres.map(x => createTag(x)) }),
        createTagSection({ id: '1', label: 'Genres Conditions', tags: arrayGenresConditions.map(x => createTag(x)) }),
        createTagSection({ id: '2', label: 'Contenu pour adulte', tags: arrayAdultContent.map(x => createTag(x)) }),
        createTagSection({ id: '3', label: 'Statut', tags: arrayStatutManga.map(x => createTag(x)) }),
        createTagSection({ id: '4', label: 'Type', tags: arrayTypeManga.map(x => createTag(x)) })
    ]
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

    for (const item of $('.page-content-listing.item-default .page-item-detail.manga').toArray()) {
        let id = $('h3 a', item).attr('href')?.split('/').slice(-2, -1)[0]!
        let mangaTime = parseDate($('.post-on.font-meta', item).eq(0).text() ?? '')

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
    return str.replace(/&#(\d+);/g, function (_match, dec) {
        return String.fromCharCode(dec);
    })
}

export function parseDate(str: string) {
    str = str.trim()
    if (str.length == 0) {
        let date = new Date()
        return new Date(date.getFullYear(), date.getMonth(), date.getDate())
    }

    if (/^(\d){1,2} (\D)+ (\d){4}$/.test(str)) {
        let date = str.split(' ')
        let year = date[2]!
        let months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
        let month = months.findIndex((element) => element == date[1]).toString()
        let day = date[0]!

        return new Date(parseInt(year), parseInt(month), parseInt(day))
    }
    else {
        let date = str.split(' ')
        let date_today = new Date()
        switch (date[1]!.slice(0, 2)) {
            case "s":
                return new Date(date_today.getFullYear(), date_today.getMonth(), date_today.getDate(), date_today.getHours(), date_today.getMinutes(), date_today.getSeconds() - parseInt(date[0]!))
            case "mi":
                return new Date(date_today.getFullYear(), date_today.getMonth(), date_today.getDate(), date_today.getHours(), date_today.getMinutes() - parseInt(date[0]!))
            case "he":
                return new Date(date_today.getFullYear(), date_today.getMonth(), date_today.getDate(), date_today.getHours() - parseInt(date[0]!), date_today.getMinutes())
            case "jo":
                return new Date(date_today.getFullYear(), date_today.getMonth(), date_today.getDate() - parseInt(date[0]!), date_today.getHours(), date_today.getMinutes())
            case "se":
                return new Date(date_today.getFullYear(), date_today.getMonth(), date_today.getDate() - (parseInt(date[0]!) * 7), date_today.getHours(), date_today.getMinutes())
            case "mo":
                return new Date(date_today.getFullYear(), date_today.getMonth() - parseInt(date[0]!), date_today.getDate(), date_today.getHours(), date_today.getMinutes())
            case "an":
                return new Date(date_today.getFullYear() - parseInt(date[0]!), date_today.getMonth(), date_today.getDate(), date_today.getHours(), date_today.getMinutes())
        }
        return date_today
    }
}

function convertNbViews(str: string) {
    let views = undefined
    let number = parseInt((str.match(/(\d+\.?\d?)/gm) ?? "")[0]!)
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

function getURLImage($: CheerioStatic, item: CheerioElement) {
    let image = undefined
    if ($('img', item).attr('srcset') != undefined) {
        image = encodeURI((($('img', item).attr('srcset') ?? "").split(',').pop() ?? "").trim().split(' ')[0]!.replace(/-[1,3](\w){2}x(\w){3}[.]{1}/gm, '.'))
    }
    else if ($('img', item).attr('data-srcset') != undefined) {
        image = encodeURI((($('img', item).attr('data-srcset') ?? "").split(',').pop() ?? "").trim().split(' ')[0]!.replace(/-[1,3](\w){2}x(\w){3}[.]{1}/gm, '.'))
    }
    else if ($('img', item).attr('data-src') != undefined) {
        image = encodeURI(($('img', item).attr('data-src') ?? "").trim().replace(/-[1,3](\w){2}x(\w){3}[.]{1}/gm, '.'))
    }
    else {
        image = encodeURI(($('img', item).attr('src') ?? "").trim().replace(/-[75]+x(\w)+[.]{1}/gm, '.'))
    }
    return image
}
