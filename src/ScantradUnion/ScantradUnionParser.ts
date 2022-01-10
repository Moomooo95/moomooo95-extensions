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

export const parseScantradUnionMangaDetails = ($: CheerioStatic, mangaId: string): Manga => {
    const panel = $('.projet-description')

    const titles = [
        decodeHTMLEntity($('h2', panel).text().trim()),
        decodeHTMLEntity($('h5:contains("Noms associés :")', panel).parent().clone().children().remove().end().text().replace(/,/g, '').trim())
    ]
    const image = $('.projet-image img').attr('src')?.split('?')[0] ?? ''
    const author = $('h5:contains("Auteur(s) & Artiste(s) :")', panel).next().text().trim() ?? "Unknown"
    const artist = $('h5:contains("Auteur(s) & Artiste(s) :")', panel).next().text().trim() ?? "Unknown"
    const rating = Number(undefined)

    let status = MangaStatus.UNKNOWN
    switch ($('h5:contains("Statut VF :")', panel).next().text().trim()) {
        case "En cours":
            status = MangaStatus.ONGOING
            break;
        case "Terminé":
            status = MangaStatus.COMPLETED
            break;
        case "Arrêté":
            status = MangaStatus.ABANDONED
            break;
    }

    let hentai = false
    const arrayTags: Tag[] = []
    // Genres
    const genres = $('h5:contains("Genres :")', panel).nextAll("a").toArray()
    if (genres.length > 0) {
        for (const genre of genres) {
            const id = $(genre).attr("href")?.split('/')[4] ?? ''
            const label = $(genre).text().trim()

            if (['Adulte'].includes(label) || ['Mature'].includes(label)) {
                hentai = true
            }

            arrayTags.push({ id: id, label: label })
        }
    }
    const tagSections: TagSection[] = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.length > 0 ? arrayTags.map(x => createTag(x)) : [] })];

    const desc = decodeHTMLEntity($('.sContent').text().trim())

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
        hentai
    })
}


//////////////////////////
/////    CHAPTERS    /////
//////////////////////////

export const parseScantradUnionChapters = ($: CheerioStatic, mangaId: string): Chapter[] => {
    const allChapters = $('.chapter-list .links-projects li')
    const chapters: Chapter[] = []

    for (let chapter of allChapters.toArray()) {
        const id = $('.buttons .btnlel', chapter).eq(1).attr('href') ?? ''
        const name = decodeHTMLEntity($('.chapter-name', chapter).text().trim())
        const chapNum = Number($('.chapter-number', chapter).text().replace(/#/g, '').trim())
        const volume = Number($(chapter).parent().parent().children('h2').text().split(' ')[1])
        const time = new Date($('.name-chapter span', chapter).eq(2).text().split('-').reverse().join('-').trim())

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


//////////////////////////////////
/////    CHAPTERS DETAILS    /////
//////////////////////////////////

export const parseScantradUnionChapterDetails = ($: CheerioStatic, mangaId: string, chapterId: string): ChapterDetails => {
    const pages: string[] = []
    const allItems = $('.manga-image-link img').toArray()

    for (let item of allItems) {
        let page = encodeURI($(item).attr('data-src') == undefined ? $(item).attr('src') ?? '' : $(item).attr('data-src') ?? '')

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

    for (const item of $('article').toArray()) {
        const url = $('.thumb-link', item).attr('href')?.split('/')[4] ?? ''
        const title = $('.index-post-header', item).text().trim()
        const image = $('.wp-post-image', item).attr('src') ?? ''

        manga.push(createMangaTile({
            id: url,
            image,
            title: createIconText({ text: title })
        }))
    }

    return manga
}


////////////////////////////////
/////    SERIES FORWARD    /////
////////////////////////////////

const parseForwardManga = ($: CheerioStatic): MangaTile[] => {
    const forwardManga: MangaTile[] = []

    for (const item of $('#content #carousel-90 .slick-slide').toArray()) {
        const url = $('.wcp-content-wrap .rpc-title', item).text().trim().toLowerCase().replace(/ /g, '-')
        const title = $('.wcp-content-wrap .rpc-title', item).text().trim()
        const image = $('.wcp-img-wrap img', item).attr('src') ?? ''

        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue

        forwardManga.push(createMangaTile({
            id: url,
            image,
            title: createIconText({ text: title }),
        }))
    }

    return forwardManga
}

//////////////////////////////////////
/////    DERNIERS MANGA SORTI    /////
//////////////////////////////////////

const parseLatestManga = ($: CheerioStatic): MangaTile[] => {
    const latestManga: MangaTile[] = []

    for (const item of $('.majflow #dernierschapitres.dernieresmaj .colonne').toArray()) {
        const url = $('.carteinfos .text-truncate', item).attr('href')?.split('/')[4]
        const title = $('.carteinfos .text-truncate', item).text().trim()
        const image = $('.carteimage img', item).attr('src') ?? ''
        const subtitle = $('.carteinfos .numerochapitre', item).text().trim()

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

//////////////////////////////
/////    HOME SECTION    /////
//////////////////////////////

export const parseHomeSections = ($: CheerioStatic, sections: HomeSection[], sectionCallback: (section: HomeSection) => void): void => {
    for (const section of sections) sectionCallback(section)
    const forwardManga: MangaTile[] = parseForwardManga($)
    const latestManga: MangaTile[] = parseLatestManga($)

    sections[0].items = forwardManga
    sections[1].items = latestManga

    for (const section of sections) sectionCallback(section)
}


//////////////////////
/////    TAGS    /////
//////////////////////

export const parseTags = ($: CheerioStatic): TagSection[] => {
    const arrayTags: Tag[] = []

    for (let item of $('.asp_gochosen').eq(1).children().toArray()) {
        let id = $(item).text().trim().toLowerCase().replace(/ /g, '-')
        let label = $(item).text().trim()

        arrayTags.push({ id: id, label: label })
    }
    const tagSections: TagSection[] = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.map(x => createTag(x)) })]

    return tagSections
}

/////////////////////////////////
/////    CHECK LAST PAGE    /////
/////////////////////////////////

export const isLastPage = ($: CheerioStatic): boolean => {
    return $('li:contains("Page suivante")').length == 0
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

    let date = str.trim().split(' ')
    let date_today = new Date()
    switch (date[1]) {
        case "minute":
        case "minutes":
            return new Date(date_today.getFullYear(), date_today.getMonth(), date_today.getDate(), date_today.getHours(), date_today.getMinutes() - parseInt(date[0]))
        case "heure":
        case "heures":
            return new Date(date_today.getFullYear(), date_today.getMonth(), date_today.getDate(), date_today.getHours() - parseInt(date[0]))
        case "jour":
        case "jours":
            return new Date(date_today.getFullYear(), date_today.getMonth(), date_today.getDate() - parseInt(date[0]))
        case "semaine":
        case "semaines":
            return new Date(date_today.getFullYear(), date_today.getMonth(), date_today.getDate() - (parseInt(date[0]) * 7))
        case "mois":
            return new Date(date_today.getFullYear(), date_today.getMonth() - parseInt(date[0]), date_today.getDate())
        case "année":
        case "années":
            return new Date(date_today.getFullYear() - parseInt(date[0]), date_today.getMonth(), date_today.getDate())
    }
    return date_today
}
