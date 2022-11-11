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

export const parseMangaScantradDetails = ($: CheerioStatic, mangaId: string): Manga => {
    const panel = $('.profile-manga  .summary_content')

    const titles = [decodeHTMLEntity($('.site-content .post-title h1').text().trim())]
    const image = getURLImage($, $('.site-content .summary_image').toArray()[0])
    const author = $('a[href*=author]', panel).text().trim()
    const artist = $('a[href*=artist]', panel).text().trim()

    const rating = Number($('.post-total-rating .score', panel).text().trim())
    const follows = Number($('.post-status .manga-action .add-bookmark .action_detail', panel).text().trim().replace(/[^\d]/g, ""))
    let hentai = false

    const otherTitles = $('.post-content_item .summary-heading:contains("Alternative")', panel).next().text().trim().split(',')
    for (let title of otherTitles) {
        titles.push(decodeHTMLEntity(title.trim()))
    }

    const arrayTags: Tag[] = []
    const tags = $('a[href*=manga-genre]', panel).toArray()
    for (const tag of tags) {
        const label = decodeHTMLEntity($(tag).text())
        const id = $(tag).attr('href')?.split("/")[4]
        if (['Adulte'].includes(label) || ['Mature'].includes(label) || ['Hentai'].includes(label)) {
            hentai = true
        }
        if (typeof id === 'undefined')
            continue
        arrayTags.push({ id: id, label: label })
    }
    const tagSections: TagSection[] = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.length > 0 ? arrayTags.map(x => createTag(x)) : [] })];

    let status = MangaStatus.UNKNOWN
    switch ($('.post-content_item .summary-heading:contains("Statut")', panel).next().text().trim()) {
        case "Terminé":
            status = MangaStatus.COMPLETED
            break;
        case "En Cours":
            status = MangaStatus.ONGOING
            break;
        case "En Pause":
            status = MangaStatus.HIATUS
            break;
        case "Annulé":
            status = MangaStatus.UNKNOWN
            break;
    }

    const desc = decodeHTMLEntity($('.description-summary p').text().trim())

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
        desc,
        hentai
    })
}


//////////////////////////
/////    CHAPTERS    /////
//////////////////////////

export const parseMangaScantradChapters = ($: CheerioStatic, mangaId: string): Chapter[] => {
    const chapters: Chapter[] = []

    for (let chapter of $('ul .wp-manga-chapter').toArray()) {
        let id = $('a', chapter).attr('href') ?? ''
        let name = $('a', chapter).text().trim().split('-')[1] ?? undefined
        let chapNum = Number((($('a', chapter).text().trim().match(/(Ch(\s?)[.](\s?)(\d)+)|(Chap(\s?)[.](\s?)(\d)+)|(Chapitre\s{1}(\d)+)|(Chapter\s{1}(\d)+)|(Episode\s{1}(\d)+)/gm) ?? "")[0].match(/\d+/gm) ?? "")[0])
        let time = parseDate($('.chapter-release-date', chapter).text().trim())

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

export const parseMangaScantradChapterDetails = ($: CheerioStatic, mangaId: string, chapterId: string): ChapterDetails => {
    const pages: string[] = []

    for (let item of $('.entry-content .reading-content .page-break img').toArray()) {
        let page = $(item).attr('data-src')?.trim()

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

    for (const item of $('.c-tabs-item .row.c-tabs-item__content').toArray()) {
        let id = $('.tab-thumb.c-image-hover a', item).attr('href')?.split("/")[4] ?? ''
        let image = getURLImage($, item)
        let title = decodeHTMLEntity(($('.tab-summary .post-title h3', item).text().trim()))
        let subtitle = decodeHTMLEntity($('.tab-meta .meta-item.latest-chap a', item).text().trim())

        manga.push(createMangaTile({
            id,
            image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle })
        }))
    }

    return manga
}


/////////////////////////////////
/////    LATEST UPDATED     /////
/////////////////////////////////

const parseLastUpdated = ($: CheerioStatic): MangaTile[] => {
    const lastUpdated: MangaTile[] = []

    for (const item of $('#loop-content .page-item-detail').toArray()) {
        let id = $('h3 a', item).attr('href')?.split("/")[4]
        let image = getURLImage($, item)
        let title = decodeHTMLEntity($('h3 a', item).text().trim())
        let subtitle = decodeHTMLEntity($('.chapter-item .chapter a', item).first().text().trim())

        if (typeof id === 'undefined' || typeof image === 'undefined')
            continue

        lastUpdated.push(createMangaTile({
            id,
            image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle })
        }))
    }

    return lastUpdated
}

///////////////////////////////
/////    POPULAR MANGA    /////
///////////////////////////////

const parsePopularManga = ($: CheerioStatic): MangaTile[] => {
    const popularManga: MangaTile[] = []

    for (var item of $('#manga-popular-slider-5 .slider__container .slider__item').toArray()) {
        var id = $('.slider__thumb_item a', item).attr('href')?.split("/")[4]
        var image = getURLImage($, item)
        var title = $('.post-title h4', item).text().trim()
        var subtitle = $('.chapter-item .chapter a', item).first().text().trim()

        if (typeof id === 'undefined' || typeof image === 'undefined')
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

//////////////////////////////////////
/////    PROJECTS & PARTNERS     /////
//////////////////////////////////////

const parseProjectsPartners = ($: CheerioStatic): MangaTile[] => {
    const projectsPartners: MangaTile[] = []

    for (const item of $('#block-18 .page-item-detail').toArray()) {
        let id = $('h3 a', item).attr('href')?.split("/")[4]
        let image = getURLImage($, item)
        let title = decodeHTMLEntity($('h3 a', item).text().trim())

        if (typeof id === 'undefined' || typeof image === 'undefined')
            continue

        projectsPartners.push(createMangaTile({
            id,
            image,
            title: createIconText({ text: title })
        }))
    }

    return projectsPartners
}


//////////////////////////////
/////    HOME SECTION    /////
//////////////////////////////

export const parseHomeSections = ($: CheerioStatic, sections: HomeSection[], sectionCallback: (section: HomeSection) => void): void => {
    for (const section of sections) sectionCallback(section)

    sections[0].items = parseLastUpdated($)
    sections[1].items = parsePopularManga($)
    sections[2].items = parseProjectsPartners($)

    for (const section of sections) sectionCallback(section)
}
//////////////////////////////////////////////////// REPRENDRE A PARTIR D'ICI 
///////////////////////////
/////    VIEW MORE    /////
///////////////////////////

export const parseViewMore = ($: CheerioStatic): MangaTile[] => {
    const viewMore: MangaTile[] = []

    for (const item of $('.tab-content-wrap .c-tabs-item__content').toArray()) {
        let id = $('.tab-thumb a', item).attr('href')?.split("/")[4]
        let image = getURLImage($, item)
        let title = ($('.post-title h3', item).text().trim())
        let subtitle = ($('.latest-chap .chapter a', item).text().trim())

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
    return $('.wp-pagenavi .nextpostslink') == undefined 
}


//////////////////////
/////    TAGS    /////
//////////////////////

export const parseTags = ($: CheerioStatic): TagSection[] => {
    const arrayGenres: Tag[] = []
  const arrayGenresConditions: Tag[] = []
  const arrayAdultContent: Tag[] = []
  const arrayStatutManga: Tag[] = []

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
  for (let item of $('#search-advanced .form-group .form-control').eq(4).children().toArray()) {
    let id = $(item).attr('value') ?? ''
    let label = decodeHTMLEntity($(item).text().trim())

    arrayAdultContent.push({ id, label })
  }
  // Statut
  for (let item of $('#search-advanced .form-group').eq(6).children('.checkbox-inline').toArray()) {
    let id = $('input', item).attr('value') ?? ''
    let label = decodeHTMLEntity($('label', item).text().trim().replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, ''))

    arrayStatutManga.push({ id, label })
  }

  return [
    createTagSection({ id: '0', label: 'Genres', tags: arrayGenres.map(x => createTag(x)) }),
    createTagSection({ id: '1', label: 'Genres Conditions', tags: arrayGenresConditions.map(x => createTag(x)) }),
    createTagSection({ id: '2', label: 'Contenu pour adulte', tags: arrayAdultContent.map(x => createTag(x)) }),
    createTagSection({ id: '3', label: 'Statut', tags: arrayStatutManga.map(x => createTag(x)) })
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
    let loadMore = true
    const updatedManga: string[] = []

    for (const item of $('.tab-content-wrap .c-tabs-item__content').toArray()) {
        let id = $('h3 a', item).attr('href')?.split("/")[4]
        let date = parseDate($('.post-on span', item).text() == "" ? $('.post-on a', item).attr('title') ?? '' : $('.post-on span', item).text().trim())

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

    if (/^(\d){4}-(\d){2}-(\d){2}\s{1}(\d){2}:(\d){2}:(\d){2}$/.test(str)) {
        return new Date(str)
    }
    else if (/^(\d){1,2} (\D)+ (\d){4}$/.test(str)) {
        let date = str.split(' ')
        let year = date[2]
        let months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
        let month = months.findIndex((element) => element == date[1]).toString()
        let day = date[0]

        return new Date(parseInt(year), parseInt(month), parseInt(day))
    }
    else {
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
}


function getURLImage($: CheerioStatic, item: CheerioElement) {
    if ($('img', item).get(0) == undefined) {
        return ""
    }

    let all_attrs = Object.keys($('img', item).get(0).attribs).map(name => ({ name, value: $('img', item).get(0).attribs[name] }))
    let all_attrs_srcset = all_attrs.filter(el => el.name.includes('srcset') )
    let all_attrs_src = all_attrs.filter(el => el.name.includes('src') && !el.name.includes('srcset') && !el.value.includes('data:image/svg+xml') )

    let image = ""
    if (all_attrs_srcset.length) {
        let all_srcset = all_attrs_srcset.map(el => el.value.split(',').sort(function(a: string, b: string) { return /\d+[w]/.exec(a)![0] < /\d+[w]/.exec(b)![0] })[0])
        image = all_srcset
            .filter(function(element, index, self) { return index === self.indexOf(element) })
            // .sort(function(a, b) { return /\d+[w]/.exec(a)![0] > /\d+[w]/.exec(b)![0] })
            [0].trim()
            .split(' ')[0].trim()
    } else {
        let all_src = all_attrs_src.map(el => el.value)  
        image = all_src[0]
    }

    return encodeURI(image.replace(/-[1,3](\w){2}x(\w){3}[.]{1}/gm, '.').replace(/-[75]+x(\w)+[.]{1}/gm, '.'))
}