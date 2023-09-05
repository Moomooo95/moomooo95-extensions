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

const LELSCANVF_DOMAIN = "https://lelscanvf.cc/";

///////////////////////////////
/////    MANGA DETAILS    /////
///////////////////////////////

export const parseLelscanVFMangaDetails = ($: CheerioStatic, mangaId: string): Manga => {
    const panel = $('.dl-horizontal')

    const titles = [decodeHTMLEntity($('.widget-title').first().text().trim())]
    const image = `${LELSCANVF_DOMAIN}/uploads/manga/${mangaId}/cover/cover_250x350.jpg`
    const author = $('a[href*=author]').text().trim()
    const artist = $('a[href*=artist]').text().trim()

    const rating = Number($('#item-rating').attr('data-score')) ?? ''
    const views = Number($('dt:contains("Vues")', panel).next().text().trim())

    let othersTitles = $('dt:contains("Autres noms")', panel).next().text().trim().split(',')
    for (let title of othersTitles) {
        titles.push(decodeHTMLEntity(title.trim()))
    }

    let status = MangaStatus.UNKNOWN
    switch ($('dt:contains("Statut")', panel).next().text().trim()) {
        case "Ongoing":
            status = MangaStatus.ONGOING
            break;
        case "Complete":
            status = MangaStatus.COMPLETED
            break;
    }

    const arrayTags: Tag[] = []
    const tags = $('a[href*=tag]').toArray()
    for (const tag of tags) {
        const label = $(tag).text()
        const id = $(tag).attr('href')?.split('/').pop()

        if (typeof id === 'undefined')
            continue

        arrayTags.push({ id, label })
    }
    const tagSections: TagSection[] = [
        createTagSection({ id: '0', label: 'tags', tags: arrayTags.length > 0 ? arrayTags.map(x => createTag(x)) : [] }),
    ];

    const desc = decodeHTMLEntity($('.well p').text().trim())

    return createManga({
        id: mangaId,
        titles,
        image,
        rating,
        status,
        artist,
        author,
        tags: tagSections,
        views,
        desc,
        hentai: false
    })
}


//////////////////////////
/////    CHAPTERS    /////
//////////////////////////

export const parseLelscanVFChapters = ($: CheerioStatic, mangaId: string): Chapter[] => {
    const chapters: Chapter[] = []

    for (let chapter of $('.chapters li:not(.volume)').toArray()) {
        const id = $('a', chapter).attr('href') ?? ''
        const name = decodeHTMLEntity($('em', chapter).text().trim()) ?? undefined
        const chapNum = Number(id.split('/').pop())
        const time = new Date($('.date-chapter-title-rtl', chapter).text().replace('.', ',') ?? undefined)

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

export const parseLelscanVFChapterDetails = ($: CheerioStatic, mangaId: string, chapterId: string): ChapterDetails => {
    const pages: string[] = []

    for (let item of $('#all img').toArray()) {
        let page = $(item).attr('data-src')?.trim().split("/")[0] == "https:" ? $(item).attr('data-src')?.trim() : 'https:' + $(item).attr('data-src')?.trim()

        if (typeof page === 'undefined')
            continue;

        pages.push(page);
    }

    return createChapterDetails({
        id: chapterId,
        mangaId,
        pages,
        longStrip: false
    })
}

///////////////////////
/////    SEARCH   /////
///////////////////////

export const parseSearch = ($: CheerioStatic): MangaTile[] => {
    const manga: MangaTile[] = []

    for (const item of $('.media').toArray()) {
        let id = $('h5 a', item).attr('href')?.split("/")[4]
        let image = `${LELSCANVF_DOMAIN}/uploads/manga/${id}/cover/cover_250x350.jpg`
        let title = decodeHTMLEntity($('h5', item).text())
        let subtitle = `Chapitre ${$('a', item).eq(2).attr('href')?.split('/').pop()}`

        if (typeof id === 'undefined')
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


//////////////////////////////////////
/////    LAST MANGAS RELEASED    /////
//////////////////////////////////////

const parseLatestManga = ($: CheerioStatic): MangaTile[] => {
    const latestManga: MangaTile[] = []

    for (const item of $('.mangalist .manga-item').toArray()) {
        let id = $('h3 a', item).attr('href')?.split("/")[4]
        let image = `${LELSCANVF_DOMAIN}/uploads/manga/${id}/cover/cover_250x350.jpg`
        let title = decodeHTMLEntity($('h3 a', item).text())
        let subtitle = `Chapitre ${$('h6 a', item).attr('href')?.split('/').pop()}`

        if (typeof id === 'undefined')
            continue

        latestManga.push(createMangaTile({
            id,
            image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle })
        }))
    }

    return latestManga
}

////////////////////////////////
/////    POPULAR MANGAS    /////
////////////////////////////////

const parsePopularManga = ($: CheerioStatic): MangaTile[] => {
    const popularManga: MangaTile[] = []

    for (const item of $('.hot-thumbnails li').toArray()) {
        let id = $('.manga-name a', item).attr('href')?.split("/")[4]
        let image = `${LELSCANVF_DOMAIN}/uploads/manga/${id}/cover/cover_250x350.jpg`
        let title = decodeHTMLEntity($('.manga-name a', item).text())
        let subtitle = `Chapitre ${$('.thumbnail', item).attr('href')?.split('/').pop()}`

        if (typeof id === 'undefined')
            continue

        popularManga.push(createMangaTile({
            id,
            image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle })
        }))
    }

    return popularManga
}

///////////////////////////
/////    TOP MANGA    /////
///////////////////////////

const parseTopManga = ($: CheerioStatic): MangaTile[] => {
    const topManga: MangaTile[] = []

    for (const item of $('li').toArray()) {
        let id = $('.media-left a', item).attr('href')?.split("/")[4]
        let image = `${LELSCANVF_DOMAIN}/uploads/manga/${id}/cover/cover_250x350.jpg`
        let title = decodeHTMLEntity($('h5 strong', item).text())
        let subtitle = `Chapitre ${$('.media-body>a', item).attr('href')?.split('/').pop()}`

        if (typeof id === 'undefined')
            continue

        topManga.push(createMangaTile({
            id,
            image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle })
        }))
    }

    return topManga
}

//////////////////////////////
/////    HOME SECTION    /////
//////////////////////////////

export const parseHomeSections = ($: CheerioStatic, sections: HomeSection[], sectionCallback: (section: HomeSection) => void): void => {
    for (const section of sections) sectionCallback(section)

    sections[0].items = parseLatestManga($)
    sections[1].items = parsePopularManga($)

    for (const section of sections) sectionCallback(section)
}

//////////////////////////////////
/////    HOME SECTION TWO    /////
//////////////////////////////////

export const parseMangaSectionOthers = ($: CheerioStatic, sections: HomeSection[], sectionCallback: (section: HomeSection) => void): void => {
    for (const section of sections) sectionCallback(section)

    sections[0].items = parseTopManga($)

    for (const section of sections) sectionCallback(section)
}

//////////////////////
/////    TAGS    /////
//////////////////////

export const parseTags = ($: CheerioStatic): TagSection[] => {
    const arrayTags: Tag[] = []
    for (let item of $('.tag-links a').toArray()) {
        let id = $(item).attr('href')?.split('/').pop()
        let label = $(item).text()

        if (typeof id === 'undefined')
            continue

        arrayTags.push({ id, label })
    }

    const tagSections: TagSection[] = [
        createTagSection({ id: '0', label: 'tags', tags: arrayTags.map(x => createTag(x)) })
    ]

    return tagSections
}

/////////////////////////////////
/////    CHECK LAST PAGE    /////
/////////////////////////////////

export const isLastPage = ($: CheerioStatic): boolean => {
    return $('.pagination li').last().hasClass('disabled')
}

///////////////////////////////
/////    UPDATED MANGA    /////
///////////////////////////////

export interface UpdatedManga {
    ids: string[];
    loadMore: boolean;
}

export const parseUpdatedManga = ($: CheerioStatic, time: Date, ids: string[]): UpdatedManga => {
    let loadMore = true
    const updatedManga: string[] = []

    for (const manga of $('.mangalist .manga-item').toArray()) {
        let id = $('a', manga).first().attr('href')?.split('/')[4]
        let date = parseDate($('.pull-right', manga).text().trim() ?? '')

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

    return {
        ids: updatedManga,
        loadMore
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
            return new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate() - 1)

        default:
            let date = str.split("/")
            return new Date(parseInt(date[2]), parseInt(date[1]) - 1, parseInt(date[0]))
    }
}