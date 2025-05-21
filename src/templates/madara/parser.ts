import {
    Chapter,
    ChapterDetails,
    Tag,
    SourceManga,
    PartialSourceManga,
    TagSection,
    SearchField,
} from '@paperback/types'

import { CheerioAPI } from 'cheerio'

import { Madara } from './base'
import { decodeHtmlEntity, parseDate, getImageUrl } from '../helper'


export const parseMangaDetails = async ($: CheerioAPI, mangaId: string, data: Madara): Promise<SourceManga> => {
    const otherstitles = $(data.otherstitle_selector).text().trim().split(',').map(e => e.trim())
    const titles = [decodeHtmlEntity($(data.title_selector).clone().children().remove().end().text().trim())].concat(otherstitles)
    const image = getImageUrl($, $(data.image_selector))
    const author = $(data.author_selector).text().trim() || "N/A"
    const artist = $(data.artist_selector).text().trim() || "N/A"
    const desc = decodeHtmlEntity($(data.description_selector).text().trim())
    const rating = Number($(data.rating_selector).text().trim())

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
        "badge": $(data.badges_selector).text().trim()
    }

    return App.createSourceManga({
        id: mangaId,
        mangaInfo: App.createMangaInfo({
            image,
            artist,
            author,
            desc,
            status,
            hentai: nsfw,
            titles,
            rating,
            tags: tagSections,
            additionalInfo
        })
    })
}

export const parseChapters = ($: CheerioAPI, mangaId: string, data: Madara): Chapter[] => {
    const chapters: Chapter[] = []

    for (const chapter of $(data.chapters_selector).toArray()) {
        if ($('a', chapter).text().trim() == "") continue

        const chapterId = $("a", chapter).attr('href')?.trim().replace(new RegExp(`${data.base_url+ "/"}|${data.source_path+ "/"}`, 'g'), '') ?? ""
        let title = $('a', chapter).text().trim().split('-')[1]?.trim()
        
        let volNum = 0
        let chapNum = 0
        let match_num = chapterId.match(/(?:v\w*-(\d+)-?)?(?:c\w*-(\d+(?:-\d+)?))/)
        if (match_num) {
            volNum = Number(match_num[1]) 
            chapNum = Number(match_num[2]?.replace('-', '.'))
        } else {
            title = $('a', chapter).text().trim()
        }
        
        const date = parseDate($(data.chapters_date_selector, chapter).text().trim(), data.date_format, data.date_lang)

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

export const parseChapterDetails = async ($: CheerioAPI, mangaId: string, chapterId: string, data: Madara): Promise<ChapterDetails> => {
    const pages: string[] = []

    for (const page of $(data.chapter_pictures_selector).toArray()) {
        pages.push(getImageUrl($, page))
    }
    
    const chapterDetails = App.createChapterDetails({
        id: chapterId,
        mangaId,
        pages
    })

    return chapterDetails
}

export const parseSearchResults = ($: CheerioAPI, data: Madara): PartialSourceManga[] => {
    const mangaItems: PartialSourceManga[] = []
    const collectedIds: string[] = []

    for (const manga of $(data.search_selector).toArray()) {
        const mangaId: string = $('h3 a', manga).attr('href')?.split('/')[4] ?? ''
        const image: string = getImageUrl($, $('img', manga))
        const title: string = decodeHtmlEntity($('h3 a', manga).text()) ?? ''
        const subtitle: string = decodeHtmlEntity($('.latest-chap .chapter a', manga).text())

        if (!mangaId || !title || collectedIds.includes(mangaId)) continue

        mangaItems.push(App.createPartialSourceManga({
            image,
            title,
            mangaId,
            subtitle
        }))
        
        collectedIds.push(mangaId)
    }

    return mangaItems
}

export const parseSearchTags = ($: CheerioAPI, data: Madara): TagSection[] => {
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
        
        const raw = decodeHtmlEntity($(item).text().trim())
        let label = data.genres_conditions_name_list.find(item => item.default === raw)?.new ?? raw

        arrayGenresConditions.push({ id, label })
    }
    // Adult Content
    for (let item of $('#search-advanced .form-group:has([name*=adult]) option').toArray()) {
        let id = `${$(item).parent().attr('name')}=${$(item).attr('value')}`

        const raw = decodeHtmlEntity($(item).text().trim())
        let label = data.adult_content_name_list.find(item => item.default === raw)?.new ?? raw

        arrayAdultContent.push({ id, label })
    }
    // Statut
    for (let item of $('#search-advanced .checkbox-inline:has([name*=statu])').toArray()) {
        const id = `${$('input', item).attr('name')}=${$('input', item).attr('value')}`

        const raw = $('label', item).text().trim()
        const cleaned = raw.toLowerCase().replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
        const label = data.status_name_list.find(entry => entry.default.includes(cleaned))?.new ?? raw
        
        arrayStatutManga.push({ id, label })
    }

    return [
        App.createTagSection({ id: '0', label: "Genres", tags: arrayGenres.map(x => App.createTag(x)) }),
        App.createTagSection({ id: '1', label: "Condition sur les genres", tags: arrayGenresConditions.map(x => App.createTag(x)) }),
        App.createTagSection({ id: '2', label: "Contenu pour adulte", tags: arrayAdultContent.map(x => App.createTag(x)) }),
        App.createTagSection({ id: '3', label: "Statut", tags: arrayStatutManga.map(x => App.createTag(x)) })
    ]
}

export const parseSearchFields = ($: CheerioAPI, data: Madara): SearchField[] => {
    const searchFields: SearchField[] = []

    for (let item of $('#search-advanced .form-group input[type=text]').toArray()) {
        const id = $(item).attr('name')
        
        const raw = $(item).attr('placeholder')?.trim()
        const name = data.search_fileds_name_list.find(item => item.default === raw)?.new ?? raw

        if (id && name) {
            searchFields.push(
                App.createSearchField({
                    id,
                    name,
                    placeholder : name
                })
            )

        }
    }

    return searchFields
}

export const parseHomePageSections = ($: CheerioAPI, data: Madara): PartialSourceManga[] => {
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

export const parseViewMoreItems = ($: CheerioAPI, data: Madara): PartialSourceManga[] => {
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
