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
    const chapters: Chapter[] = []

    for (let chapter of $('.fs-chapter-list .element.desktop').toArray()) {
        const id = $('a', chapter).eq(1).attr('href') ?? ''
        const name = decodeHTMLEntity($('.name', chapter).text()) != '' ? decodeHTMLEntity($('.name', chapter).text()) : undefined
        const chapNum = Number($('.title', chapter).text().split(' ').pop())
        const volume = !isNaN(Number($(chapter).parent().children('.title').text().trim().split(' ')[1])) ? Number($(chapter).parent().children('.title').text().trim().split(' ')[1]) : undefined
        const time = parseDate($('.meta_r', chapter).text() ?? "")

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

    return chapters
}


/////////////////////////////////
/////    CHAPTER DETAILS    /////
/////////////////////////////////

export const parseFuryoSquadChapterDetails = ($: CheerioStatic, mangaId: string, chapterId: string): ChapterDetails => {
    const pages: string[] = []

    for (let item of $('img', '.fs-reader-page').toArray()) {
        let page = encodeURI($(item).attr('src') ?? "")

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
        let title = decodeHTMLEntity($('.title a', item).eq(0).text().trim())
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
        let url = $('.fs-comic-title a', item).attr('href')?.split("/")[4]
        let image = $('.fs-chap-img', item).attr('src')
        let title = decodeHTMLEntity($('.fs-comic-title', item).text())
        let subtitle = decodeHTMLEntity($('.fs-chapter', item).text() + " : " + $('.fs-chap-name', item).text())

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

    for (const item of $('#fs-en-cours .fs-card-container.desktop .grid-item-container').toArray()) {
        let url = $('.fs-comic-title a', item).attr('href')?.split("/")[4]
        let image = $('.fs-card-img', item).attr('src')
        let title = decodeHTMLEntity($('.fs-comic-title', item).text())

        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue

        ongoingManga.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title })
        }))
    }

    return ongoingManga
}

/////////////////////////////////
/////    MANGAS FINISHED    /////
/////////////////////////////////

const parseFinishedManga = ($: CheerioStatic): MangaTile[] => {
    const finishedManga: MangaTile[] = []

    for (const item of $('#fs-termines .fs-card-container.desktop .grid-item-container').toArray()) {
        let url = $('.fs-comic-title a', item).attr('href')?.split("/")[4]
        let image = $('.fs-card-img', item).attr('src')
        let title = decodeHTMLEntity($('.fs-comic-title', item).text())

        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue

        finishedManga.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title })
        }))
    }

    return finishedManga
}

////////////////////////////////
/////    MANGAS STOPPED    /////
////////////////////////////////

const parseStoppedManga = ($: CheerioStatic): MangaTile[] => {
    const stoppedManga: MangaTile[] = []

    for (const item of $('#fs-stoppes .fs-card-container.desktop .grid-item-container').toArray()) {
        let url = $('.fs-comic-title a', item).attr('href')?.split("/")[4]
        let image = $('.fs-card-img', item).attr('src')
        let title = decodeHTMLEntity($('.fs-comic-title', item).text())

        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue

        stoppedManga.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title })
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

export const parseMangaSectionOthers = ($: CheerioStatic, sections: HomeSection[], sectionCallback: (section: HomeSection) => void): void => {
    for (const section of sections) sectionCallback(section)
    const ongoingManga: MangaTile[] = parseOngoingManga($)
    const finishedManga: MangaTile[] = parseFinishedManga($)
    const stoppedManga: MangaTile[] = parseStoppedManga($)

    sections[0].items = ongoingManga
    sections[1].items = finishedManga
    sections[2].items = stoppedManga

    for (const section of sections) sectionCallback(section)
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

    for (const item of $('table tr').toArray()) {
        let id = ($('.fs-comic-title a', item).attr('href') ?? '').split('/').slice(-2, -1)[0] ?? ''
        let mangaTime = parseDate($('.fs-table-chap-date .fs-chap-date', item).text().trim() ?? '')

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
            return new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate() - 1)

        case "Avant-hier":
            let beforeyesterday = new Date()
            return new Date(beforeyesterday.getFullYear(), beforeyesterday.getMonth(), beforeyesterday.getDate() - 2)

        default:
            let date = ((str.match(/(\d+)(\s)(\w+)/gm) ?? "")[0] ?? "").split(' ')
            let date_today = new Date()
            switch (date[1]) {
                case "jours":
                    return new Date(date_today.getFullYear(), date_today.getMonth(), date_today.getDate() - parseInt(date[0]), date_today.getHours(), date_today.getMinutes())
                case "mois":
                    return new Date(date_today.getFullYear(), date_today.getMonth() - parseInt(date[0]), date_today.getDate(), date_today.getHours(), date_today.getMinutes())
                case "an":
                case "ans":
                    return new Date(date_today.getFullYear() - parseInt(date[0]), date_today.getMonth(), date_today.getDate(), date_today.getHours(), date_today.getMinutes())
            }
    }
    return new Date()
}