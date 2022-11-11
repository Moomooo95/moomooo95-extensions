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

    const titles = [decodeHTMLEntity($('h2', panel).text().trim())].concat($('h5:contains("Noms associés :")', panel).parent().clone().children().remove().end().text().split(',').map(el => el.trim()).filter(el => el != ""))
    const image = getURLImage($, $('.projet-image').toArray()[0])
    const author = $('a[href*=auteur]', panel).eq(0).text().trim() ?? undefined
    const artist = $('a[href*=auteur]', panel).eq(1).text().trim() ?? undefined
    const views = Number($('.cat-links').text().split(' ')[0])
    const desc = decodeHTMLEntity($('.sContent').text().trim())
    let hentai = false

    // Genres
    const arrayTags: Tag[] = []
    for (const genre of $('a[href*=tag]', panel).toArray()) {
        const id = $(genre).attr("href")?.split('/')[4]! // id of tag is incorrect because need 'int' id but there is 'string' id 
        const label = decodeHTMLEntity($(genre).text().trim())

        if (['Adulte'].includes(label) || ['Mature'].includes(label)) {
            hentai = true
        }

        arrayTags.push({ id, label })
    }
    const tagSections: TagSection[] = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.map(x => createTag(x)) })];

    let status = MangaStatus.UNKNOWN
    switch ($('h5:contains("Statut VF :")', panel).next().text().trim()) {
        case "En cours":
        case "VA rattrapée":
            status = MangaStatus.ONGOING
            break;
        case "Terminé":
        case "One Shot":
            status = MangaStatus.COMPLETED
            break;
        case "Abandonné":
        case "Licencié":
            status = MangaStatus.ABANDONED
            break;
        case "En pause":
        case "En attente d'une suite VO":
            status = MangaStatus.HIATUS
            break;
    }

    return createManga({
        id: mangaId,
        titles,
        image,
        author,
        artist,
        views,
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
    const chapters: Chapter[] = []

    for (let chapter of $('.chapter-list .links-projects li').toArray()) {
        chapters.push(createChapter({
            id: $('.buttons .btnlel', chapter).eq(1).attr('href')!,
            mangaId,
            name: decodeHTMLEntity($('.chapter-name', chapter).text().trim()) != '' ? decodeHTMLEntity($('.chapter-name', chapter).text().trim()) : undefined,
            langCode: LanguageCode.FRENCH,
            chapNum: Number($('.chapter-number', chapter).text().replace(/#/g, '').trim()),
            volume: !isNaN(Number($(chapter).parent().parent().children('h2').text().split(' ')[1])) ? Number($(chapter).parent().parent().children('h2').text().split(' ')[1]) : undefined,
            time: new Date($('.name-chapter span', chapter).eq(2).text().split('-').reverse().join('-').trim())
        }))
    }

    return chapters
}

//////////////////////////////////
/////    CHAPTERS DETAILS    /////
//////////////////////////////////

export const parseScantradUnionChapterDetails = ($: CheerioStatic, mangaId: string, chapterId: string): ChapterDetails => {
    const pages: string[] = []

    for (let item of $('.manga-image-link img').toArray()) {
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
        manga.push(
            createMangaTile({
                id: $('.thumb-link', item).attr('href')?.split('/')[4] ?? '',
                image: getURLImage($, item),
                title: createIconText({
                    text: decodeHTMLEntity($('.index-post-header', item).text().trim())
                })
            })
        )
    }

    return manga
}

//////////////////////////////////////
/////    DERNIERS MANGA SORTI    /////
//////////////////////////////////////

const parseLatestManga = ($: CheerioStatic): MangaTile[] => {
    const latestManga: MangaTile[] = []

    for (const item of $('.majflow #dernierschapitres.dernieresmaj .colonne').toArray()) {
        const id = $('.carteinfos .text-truncate', item).attr('href')?.split('/')[4]
        const title = decodeHTMLEntity($('.carteinfos .text-truncate', item).text().trim())
        const image = getURLImage($, item)
        const subtitle = decodeHTMLEntity($('.carteinfos .numerochapitre', item).text().trim())

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

////////////////////////////////
/////    SERIES FORWARD    /////
////////////////////////////////

const parseForwardManga = ($: CheerioStatic): MangaTile[] => {
    const forwardManga: MangaTile[] = []

    for (const item of $('#content #carousel-90 .slick-slide').toArray()) {
        const id = $('.wcp-content-wrap .rpc-title', item).text().trim().toLowerCase().replace(/ /g, '-')
        const title = decodeHTMLEntity($('.wcp-content-wrap .rpc-title', item).text().trim())
        const image = getURLImage($, item)

        if (typeof id === 'undefined' || typeof image === 'undefined')
            continue

        forwardManga.push(createMangaTile({
            id,
            image,
            title: createIconText({ text: title }),
        }))
    }

    return forwardManga
}

//////////////////////////////
/////    HOME SECTION    /////
//////////////////////////////

export const parseHomeSections = ($: CheerioStatic, sections: HomeSection[], sectionCallback: (section: HomeSection) => void): void => {
    for (const section of sections) sectionCallback(section)

    sections[0].items = parseLatestManga($)
    sections[1].items = parseForwardManga($)

    for (const section of sections) sectionCallback(section)
}

//////////////////////
/////    TAGS    /////
//////////////////////

export const parseTags = ($: CheerioStatic): TagSection[] => {
    const arrayTags: Tag[] = []
    const arrayTeams: Tag[] = []

    // Genres
    for (let item of $('.asp_gochosen').eq(1).children().toArray()) {
        arrayTags.push({
            id : $(item).attr('value')!,
            label : decodeHTMLEntity($(item).text().trim())
        })
    }
    // Teams
    for (let item of $('.asp_gochosen').eq(0).children().toArray()) {
        arrayTeams.push({
            id : $(item).attr('value')! + "-Teams",
            label : decodeHTMLEntity($(item).text().trim())
        })
    }

    return [
        createTagSection({ id: '0', label: 'Genres', tags: arrayTags.map(x => createTag(x)) }),
        createTagSection({ id: '1', label: 'Teams', tags: arrayTeams.map(x => createTag(x)) })
    ]
}

/////////////////////////////////
/////    CHECK LAST PAGE    /////
/////////////////////////////////

export const isLastPage = ($: CheerioStatic): boolean => {
    return $('title').text().includes('Page introuvable')
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

    for (const item of $('#dernierschapitres.dernieresmaj .colonne').toArray()) {
        let id = ($('.carteinfos a', item).eq(1).attr('href') ?? '').split('/')[4]
        let mangaTime = parseDate($('.carteinfos .datechapitre', item).text().trim().split(' ').slice(-2).join(' '))

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

function getURLImage($: CheerioStatic, item: CheerioElement) {
    if ($('img', item).get(0) == undefined) {
        return ""
    }

    let all_attrs = Object.keys($('img', item).get(0).attribs).map(name => ({ name, value: $('img', item).get(0).attribs[name] }))
    let all_attrs_srcset = all_attrs.filter(el => el.name.includes('srcset'))
    let all_attrs_src = all_attrs.filter(el => el.name.includes('src') && !el.name.includes('srcset') && !el.value.includes('data:image/svg+xml'))

    let image = ""
    if (all_attrs_srcset.length) {
        let all_srcset = all_attrs_srcset.map(el => el.value.split(',').sort(function (a: string, b: string) { return /\d+[w]/.exec(a)![0] < /\d+[w]/.exec(b)![0] })[0])
        image = all_srcset
            .filter(function (element, index, self) { return index === self.indexOf(element) })
        // .sort(function(a, b) { return /\d+[w]/.exec(a)![0] > /\d+[w]/.exec(b)![0] })
        [0].trim()
            .split(' ')[0].trim()
    } else {
        let all_src = all_attrs_src.map(el => el.value)
        image = all_src[0]
    }

    return encodeURI(image.replace(/-[1,3](\w){2}x(\w){3}[.]{1}/gm, '.').replace(/-[75]+x(\w)+[.]{1}/gm, '.'))
}
