import {
    Chapter,
    ChapterDetails,
    Tag,
    SourceManga,
    PartialSourceManga,
    TagSection,
    SearchField,
} from '@paperback/types'

import { Madara } from './Madara'
import { decodeHtmlEntity, parseDate, getImageUrl } from '../TemplateHelper'


export const parseMangaDetails = async ($: CheerioStatic, mangaId: string, data: Madara): Promise<SourceManga> => {
    const titles = [decodeHtmlEntity($('div.post-title h1').text().trim())]   
    const image = getImageUrl($, $('div.summary_image img'))
    const author = $('[href*=manga-aut],[href*=auteur],[href*=author]').text().trim()
    const artist = $('[href*=manga-art],[href*=artiste],[href*=artist]').text().trim()
    const description = decodeHtmlEntity($(data.description_selector).text().trim())
    const rating = $('.post-total-rating .total_votes').attr('value')

    const categories: Tag[] = []
    for (const tag of $(data.genres_selector).toArray()) {
        const id = $(tag).attr('href')?.split('/')[4]
        const label = $(tag).text().trim()

        if (!id || !label) continue
        categories.push({ id: id, label: label })
    }
    const tagSections: TagSection[] = [App.createTagSection({ id: '0', label: 'genres', tags: categories.map(x => App.createTag(x)) })]

    const status = (data.status)($)
    const nsfw = (data.nsfw)($, categories)

    const additionalInfo: Record<string, string> = {
        "viewer": (data.viewer)($, categories),
        "badge": $('span.manga-title-badges').text().trim()
    }

    return App.createSourceManga({
        id: mangaId,
        mangaInfo: App.createMangaInfo({
            image: image,
            artist: artist,
            author: author,
            desc: description,
            status: status,
            hentai: nsfw,
            titles: titles,
            rating: Number(rating),
            tags: tagSections,
            additionalInfo: additionalInfo
        })
    })
}

export const parseChapters = ($: CheerioStatic, mangaId: string, data: Madara): Chapter[] => {
    const chapters: Chapter[] = []

    for (const chapter of $(data.chapter_selector).toArray()) {
        if ($('a', chapter).text().trim() == "") continue

        const chapterId = $("a", chapter).attr('href')?.trim().replace(new RegExp(`${data.base_url+ "/"}|${data.source_path+ "/"}`, 'g'), '')
        let title = $('a', chapter).text().trim().split('-')[1]?.trim()
        
        let volNum = 0
        let chapNum = 0
        let match_num = chapterId.match(/(?:v\w*-(\d+)-?)?(?:c\w*-(\d+(?:-\d+)?))/)
        if (match_num) {
            volNum = Number(match_num[1]) 
            chapNum = Number(match_num[2].replace('-', '.'))
        } else {
            title = $('a', chapter).text().trim()
        }
        
        const date = parseDate($('span.chapter-release-date', chapter).text().trim(), data.date_format, data.date_lang)

        chapters.push(App.createChapter({
            id: chapterId,
            name: title,
            langCode: data.lang_code,
            volume: isNaN(volNum) ? 0 : volNum,
            chapNum: isNaN(chapNum) ? 0 : chapNum,
            time: date
        }))
    }

    if (chapters.length == 0) {
        throw new Error(`Couldn't find any chapters for mangaId: ${mangaId}!`)
    }

    return chapters
}

export const parseChapterDetails = async ($: CheerioStatic, mangaId: string, chapterId: string, data: Madara): Promise<ChapterDetails> => {
    const pages: string[] = []

    for (const page of $(data.chapter_details_selector).toArray()) {
        pages.push(getImageUrl($, page))
    }
    
    const chapterDetails = App.createChapterDetails({
        id: chapterId,
        mangaId: mangaId,
        pages: pages
    })

    return chapterDetails
}

export const parseSearchResults = ($: CheerioStatic, data: Madara): PartialSourceManga[] => {
    const mangaItems: PartialSourceManga[] = []
    const collectedIds: string[] = []

    for (const manga of $(data.search_selector).toArray()) {
        const id: string = $('h3 a', manga).attr('href')?.split('/')[4] ?? ''
        const image: string = getImageUrl($, $('img', manga))
        const title: string = decodeHtmlEntity($('h3 a', manga).text()) ?? ''
        const subtitle: string = decodeHtmlEntity($('.latest-chap .chapter a', manga).text())

        if (!id || !title || collectedIds.includes(id)) continue

        mangaItems.push(App.createPartialSourceManga({
            image: image,
            title: title,
            mangaId: id,
            subtitle: subtitle
        }))
        
        collectedIds.push(id)
    }

    return mangaItems
}

export const parseSearchTags = ($: CheerioStatic): TagSection[] => {
    const arrayGenres: Tag[] = []
    const arrayGenresConditions: Tag[] = []
    const arrayAdultContent: Tag[] = []
    const arrayStatutManga: Tag[] = []

    // Genres
    for (let item of $('#search-advanced .checkbox-group div:has([name*=genre])').toArray()) {
        let id = `${$('input', item).attr('name')}=${$('input', item).attr('value')}`
        let label = decodeHtmlEntity($('label', item).text().trim())

        arrayGenres.push({ id, label })
    }
    // Genres Conditions
    for (let item of $('#search-advanced .form-group:has([name*=op]) option').toArray()) {
        let id = `${$(item).parent().attr('name')}=${$(item).attr('value')}`
        let label = decodeHtmlEntity($(item).text().trim())

        arrayGenresConditions.push({ id, label })
    }
    // Adult Content
    for (let item of $('#search-advanced .form-group:has([name*=adult]) option').toArray()) {
        let id = `${$(item).parent().attr('name')}=${$(item).attr('value')}`
        let label = decodeHtmlEntity($(item).text().trim())

        arrayAdultContent.push({ id, label })
    }
    // Statut
    for (let item of $('#search-advanced .checkbox-inline:has([name*=statu])').toArray()) {
        let id = `${$('input', item).attr('name')}=${$('input', item).attr('value')}`
        let label = decodeHtmlEntity($('label', item).text().trim().replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, ''))

        arrayStatutManga.push({ id, label })
    }

    return [
        App.createTagSection({ id: '0', label: "Genres", tags: arrayGenres.map(x => App.createTag(x)) }),
        App.createTagSection({ id: '1', label: "Condition sur les genres", tags: arrayGenresConditions.map(x => App.createTag(x)) }),
        App.createTagSection({ id: '2', label: "Contenu pour adulte", tags: arrayAdultContent.map(x => App.createTag(x)) }),
        App.createTagSection({ id: '3', label: "Statut", tags: arrayStatutManga.map(x => App.createTag(x)) })
    ]
}

export const parseSearchFields = ($: CheerioStatic): SearchField[] => {
    const searchFields: SearchField[] = []

    for (let item of $('#search-advanced .form-group input[type=text]').toArray()) {
        searchFields.push(App.createSearchField({ id: $(item).attr('name'), name: $(item).attr('placeholder'), placeholder: $(item).attr('placeholder') }))
    }

    return searchFields
}

export const parseHomePageSections = ($: CheerioStatic, data: Madara): PartialSourceManga[] => {
    const mangaItems: PartialSourceManga[] = []
    const collectedIds: string[] = []

    for (const manga of $(data.search_selector).toArray()) {
        const id: string = $('h3 a', manga).attr('href')?.split('/')[4] ?? ''
        const image: string = getImageUrl($, $('img', manga))
        const title: string = decodeHtmlEntity($('h3 a', manga).text()) ?? ''
        const subtitle: string = decodeHtmlEntity($('.latest-chap .chapter a', manga).text())

        if (!id || !title || collectedIds.includes(id)) continue

        mangaItems.push(App.createPartialSourceManga({
            image: image,
            title: title,
            mangaId: id,
            subtitle: subtitle
        }))
        
        collectedIds.push(id)
    }

    return mangaItems
}

export const parseViewMoreItems = ($: CheerioStatic, data: Madara): PartialSourceManga[] => {
    const mangaItems: PartialSourceManga[] = []
    const collectedIds: string[] = []

    for (const manga of $("div.page-item-detail").toArray()) {
        const id: string = $(data.base_id_selector, manga).attr('href')?.split('/')[4] ?? ''
        const image: string = getImageUrl($, $('img', manga))
        const title: string = decodeHtmlEntity($(data.base_id_selector, manga).text()) ?? ''

        if (!id || !title || collectedIds.includes(id)) continue

        mangaItems.push(App.createPartialSourceManga({
            image: image,
            title: title,
            mangaId: id
        }))
        
        collectedIds.push(id)
    }

    return mangaItems
}
