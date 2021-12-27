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

export const parsePerfScantradMangaDetails = ($: CheerioStatic, mangaId: string): Manga => {
    const panel = $('.css-15qcq2r.e1jf7yel9')

    const titles = [
        decodeHTMLEntity($('.css-1xo73o4.e1jf7yel5', panel).text().trim())
    ]
    const image = $('.e1jf7yel7.css-1jarxog.e1je4q6n0', panel).attr('src')?.trim() ?? ''
    const author = $('.css-ccu866.e1dq2ku12:contains("Author")').next().next().text() ?? "Unknown"
    const artist = $('.css-ccu866.e1dq2ku12:contains("Artist")').next().next().text() ?? "Unknown"

    let status = MangaStatus.UNKNOWN
    switch ($('.css-15575wy.e1jf7yel0', panel).text().split('•')[1].trim()) {
        case "En Cours":
            status = MangaStatus.ONGOING
            break;
        case "Abandonné":
            status = MangaStatus.ABANDONED
            break;
    }

    const arrayTags: Tag[] = []
    // Genres
    const genres = $('.css-1cls7c6.eibv1gc1', panel).toArray()
    if (genres.length > 0) {
        for (const genre of genres) {
            const label = $('p', genre).text().trim()
            const id = label

            arrayTags.push({ id: id, label: label })
        }
    }
    const tagSections: TagSection[] = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.length > 0 ? arrayTags.map(x => createTag(x)) : [] })];

    const desc = decodeHTMLEntity($('.css-fo0pm6.e1jf7yel3').text().trim())

    return createManga({
        id: mangaId,
        titles,
        image,
        author,
        artist,
        rating: Number(undefined),
        status,
        tags: tagSections,
        desc,
        hentai: false
    })
}


//////////////////////////
/////    CHAPTERS    /////
//////////////////////////

export const parsePerfScantradChapters = ($: CheerioStatic, mangaId: string): Chapter[] => {
    const allChapters = $('.css-1pfv033.e1ba5g7u0')
    const chapters: Chapter[] = []

    for (let chapter of allChapters.toArray()) {
        const id = $(chapter).attr('href') ?? ''
        const name = $('.css-1lrrmqm.e1ba5g7u2', chapter).text().trim() ?? ''
        const chapNum = Number(name.trim().split(' ')[1])

        chapters.push(createChapter({
            id,
            mangaId,
            name,
            langCode: LanguageCode.FRENCH,
            chapNum,
            time: new Date()
        }))
    }

    return chapters
}


//////////////////////////////////
/////    CHAPTERS DETAILS    /////
//////////////////////////////////

export const parsePerfScantradChapterDetails = ($: CheerioStatic, mangaId: string, chapterId: string): ChapterDetails => {
    const pages: string[] = JSON.parse($('#__NEXT_DATA__').html() ?? '').props.pageProps.pages

    return createChapterDetails({
        id: chapterId,
        mangaId: mangaId,
        pages,
        longStrip: false
    })
}

///////////////////////////////////
/////    RECOMMENDED MANGA    /////
///////////////////////////////////

const parseRecommendedManga = ($: CheerioStatic): MangaTile[] => {
    const recommendedManga: MangaTile[] = []
    const allItems = JSON.parse(($('#__NEXT_DATA__').html() ?? '').replace(/"\s+/g,'"').replace(/\s+"/g,'"')).props.pageProps.featured

    for (const item of allItems) {
        const url = item.series_id
        const title = item.title
        const image = item.cover_art.source

        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue

        recommendedManga.push(createMangaTile({
            id: url,
            image,
            title: createIconText({ text: title })
        }))
    }

    return recommendedManga
}

//////////////////////////////////////
/////    DERNIERS MANGA SORTI    /////
//////////////////////////////////////

const parseLatestManga = ($: CheerioStatic): MangaTile[] => {
    const latestManga: MangaTile[] = []
    const allItems = JSON.parse(($('#__NEXT_DATA__').html() ?? '').replace(/"\s+/g,'"').replace(/\s+"/g,'"')).props.pageProps.latests

    for (const item of allItems) {
        const url = item['0'].series_id
        const title = item['0'].title
        const image = item['0'].cover_art.source
        const subtitle = "Chapitre " + item['1'].number


        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue

        latestManga.push(createMangaTile({
            id: url,
            image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle })
        }))
    }

    return latestManga
}

////////////////////////////////
/////    TOUS LES MANGA    /////
////////////////////////////////

const parseAllManga = ($: CheerioStatic): MangaTile[] => {
    const allManga: MangaTile[] = []
    const allItems = JSON.parse(($('#__NEXT_DATA__').html() ?? '').replace(/"\s+/g,'"').replace(/\s+"/g,'"')).props.pageProps.series

    for (const item of allItems) {
        const url = item.series_id
        const title = item.title
        const image = item.cover_art.source


        console.log('"'+image+'"')

        allManga.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title })
        }))
    }

    return allManga
}

//////////////////////////////
/////    HOME SECTION    /////
//////////////////////////////

export const parseHomeSections = ($: CheerioStatic, sections: HomeSection[], sectionCallback: (section: HomeSection) => void): void => {
    for (const section of sections) sectionCallback(section)
    const recommendedManga: MangaTile[] = parseRecommendedManga($)
    const latestManga: MangaTile[] = parseLatestManga($)
    const allManga: MangaTile[] = parseAllManga($)

    sections[0].items = recommendedManga
    sections[1].items = latestManga
    sections[2].items = allManga

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