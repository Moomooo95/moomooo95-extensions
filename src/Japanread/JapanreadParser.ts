import {
    ChapterDetails,
    HomeSection,
    Manga,
    MangaStatus,
    MangaTile,
    Tag,
    TagSection
} from "paperback-extensions-common";

const JAPANREAD_DOMAIN = "https://www.japanread.cc";

///////////////////////////////
/////    MANGA DETAILS    /////
///////////////////////////////

export const parseJapanreadMangaDetails = ($: CheerioStatic, mangaId: string): Manga => {
    const panel = $('.card.card-manga')

    const titles = [decodeHTMLEntity($('.card-header.h3').text().trim())]
    const image = $('.card.card-manga img', panel).first().attr('src') ?? ""
    const author = $('div.font-weight-bold:contains("Auteur(s) :")', panel).next().text().trim() ?? "Unknown"
    const artist = $('div.font-weight-bold:contains("Artiste(s) :")', panel).next().text().trim() ?? "Unknown"

    const rating = Number($('div.font-weight-bold:contains("Note :")', panel).next().find('.js_avg').text().trim())
    const views = Number($('div.font-weight-bold:contains("Stats :")', panel).next().find('li').eq(0).text().trim().replace(/,/g, ''))
    const follows = Number($('div.font-weight-bold:contains("Stats :")', panel).next().find('li').eq(1).text().trim().replace(/,/g, ''))
    let hentai = false


    let otherTitles = $('div.font-weight-bold:contains("Nom alternatif :")', panel).next().text().trim().split(';')
    for (let title of otherTitles) {
        titles.push(decodeHTMLEntity(title.trim()))
    }

    const arrayTags: Tag[] = []
    const tags = $('div.font-weight-bold:contains("Catégories :")', panel).next().find('span').toArray()
    for (const tag of tags) {
        var label = capitalizeFirstLetter(decodeHTMLEntity($(tag).text()))
        var id = $(tag).parent().attr('href')?.split("=").pop() ?? label
        if (['Hentai'].includes(label) || ['Adulte'].includes(label)) {
            hentai = true
        }
        arrayTags.push({ id: id, label: label })
    }
    const tagSections: TagSection[] = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.length > 0 ? arrayTags.map(x => createTag(x)) : [] })];

    let status = MangaStatus.UNKNOWN
    switch ($('div.font-weight-bold:contains("Statut :")', panel).next().text().trim()) {
        case "Terminé":
            status = MangaStatus.COMPLETED
            break;
        case "En cours":
            status = MangaStatus.ONGOING
            break;
    }

    let desc = decodeHTMLEntity($('div.font-weight-bold:contains("Description :")', panel).next().text().trim())

    return createManga({
        id: mangaId,
        titles,
        image,
        rating: Number(rating),
        status,
        artist,
        author,
        tags: tagSections,
        views,
        follows,
        desc,
        hentai
    })
}


/////////////////////////////////
/////    CHAPTER DETAILS    /////
/////////////////////////////////

export const parseJapanreadChapterDetails = (data: string, mangaId: string, chapterId: string, id: string): ChapterDetails => {
    const pages: string[] = []

    for (let item of JSON.parse(data).page_array) {
        let page = encodeURI(`${JAPANREAD_DOMAIN}/images/mangas/chapters/${id}/${item}`)

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

    for (const item of $('#manga-container div.col-lg-6').toArray()) {
        let url = ($('.text-truncate a', item).attr('href') ?? '').split('/').pop()
        let image = $('.large_logo img', item).attr('src') ?? ''
        let title = decodeHTMLEntity($('.text-truncate a', item).text().trim())

        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue

        manga.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title })
        }))
    }

    return manga
}


///////////////////////////////////////
/////    LASTEST UPDATED MANGA    /////
///////////////////////////////////////

export const parseLatestUpdatedManga = ($: CheerioStatic): MangaTile[] => {
    const latestUpdatedManga: MangaTile[] = []

    for (const item of $('.table-responsive tbody .manga').toArray()) {
        let url = $('.ellipsis a', item).attr('href')?.split("/").pop()
        let image = $('.img-fluid', item).attr('src') ?? ''
        let title = decodeHTMLEntity($('.ellipsis a', item).text().trim())
        let subtitle = decodeHTMLEntity($(item).next().children('td').eq(1).children('.text-truncate').text().trim().replace(/\n/gm, ' '))

        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue

        latestUpdatedManga.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle }),
        }))
    }

    return latestUpdatedManga
}

///////////////////////////////////
/////    MOST VIEWED MANGA    /////
///////////////////////////////////

const parseMostViewedManga = ($: CheerioStatic): MangaTile[] => {
    const mostViewedManga: MangaTile[] = []

    for (const item of $('#nav-home li').toArray()) {
        let url = $('.text-truncate .font-weight-bold', item).attr('href')?.split("/").pop()
        let image = ($('.tiny_logo img', item).attr('src') ?? '').replace(/manga_small/g, 'manga_large')
        let title = decodeHTMLEntity($('.text-truncate .font-weight-bold', item).text().trim())
        let subtitle = "👀 " + $('.text-truncate .float-left', item).text().trim()

        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue

        mostViewedManga.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle })
        }))
    }

    return mostViewedManga
}

/////////////////////////////////
/////    TOP RATED MANGA    /////
/////////////////////////////////

const parseTopRatedManga = ($: CheerioStatic): MangaTile[] => {
    const topRatedManga: MangaTile[] = []

    for (const item of $('#nav-profile li').toArray()) {
        let url = $('.text-truncate .font-weight-bold', item).attr('href')?.split("/").pop()
        let image = ($('.tiny_logo img', item).attr('src') ?? '').replace(/manga_small/g, 'manga_large')
        let title = decodeHTMLEntity($('.text-truncate .font-weight-bold', item).text().trim())
        let subtitle = "👀 " + $('.text-truncate .float-left', item).text().trim()

        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue

        topRatedManga.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle })
        }))
    }

    return topRatedManga
}

///////////////////////////////
/////    NOVELTY MANGA    /////
///////////////////////////////

const parseNoveltyManga = ($: CheerioStatic): MangaTile[] => {
    const noveltyManga: MangaTile[] = []

    for (const item of $('.tab-content').eq(1).find('li').toArray()) {
        let url = $('.text-truncate .font-weight-bold', item).attr('href')?.split("/").pop()
        let image = ($('.tiny_logo img', item).attr('src') ?? '').replace(/manga_small/g, 'manga_large')
        let title = decodeHTMLEntity($('.text-truncate .font-weight-bold', item).text().trim())
        let subtitle = decodeHTMLEntity($('.text-truncate .float-left', item).text().trim())

        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue

        noveltyManga.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle })
        }))
    }

    return noveltyManga
}

//////////////////////////////
/////    HOME SECTION    /////
//////////////////////////////

export const parseHomeSections = ($: CheerioStatic, sections: HomeSection[], sectionCallback: (section: HomeSection) => void): void => {
    for (const section of sections) sectionCallback(section)
    const latestUpdatedManga: MangaTile[] = parseLatestUpdatedManga($)
    const mostViewedManga: MangaTile[] = parseMostViewedManga($)
    const topRatedManga: MangaTile[] = parseTopRatedManga($)
    const noveltyManga: MangaTile[] = parseNoveltyManga($)

    sections[0].items = latestUpdatedManga
    sections[1].items = mostViewedManga
    sections[2].items = topRatedManga
    sections[3].items = noveltyManga

    for (const section of sections) sectionCallback(section)
}


//////////////////////
/////    TAGS    /////
//////////////////////

export const parseTags = ($: CheerioStatic): TagSection[] => {
    const arrayTags: Tag[] = []

    for (let item of $('.category_item').toArray()) {
        let id = $(item).attr('value') ?? ''
        let label = capitalizeFirstLetter(decodeHTMLEntity($(item).attr('id') ?? ''))

        arrayTags.push({ id: id, label: label })
    }
    const tagSections: TagSection[] = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.map(x => createTag(x)) })]

    return tagSections
}

/////////////////////////////////
/////    CHECK LAST PAGE    /////
/////////////////////////////////

export const isLastPage = ($: CheerioStatic): boolean => {
    return $('.pagination').length == 0 ? true : $('.pagination li').last().hasClass('disabled')
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

    for (const item of $('.table-responsive tbody .manga').toArray()) {
        let id = ($(item).next().children('td').eq(1).children('.text-truncate').attr('href') ?? '').split('/').pop() ?? ''
        let mangaTime = new Date(($(item).next().children('td').last().find('time').attr('datetime') ?? '').replace(/ CET/g, ''))

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

export function decodeHTMLEntity(str: string) {
    return str.replace(/&#(\d+);/g, function (match, dec) {
        return String.fromCharCode(dec);
    })
}

export function parseDate(str: string) {
    if (str.length == 0) {
        return undefined
    }

    let date = str.trim().split(' ')
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