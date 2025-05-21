import {
    Chapter,
    ChapterDetails,
    Tag,
    SourceManga,
    PartialSourceManga,
    TagSection,
} from '@paperback/types'

import { CheerioAPI, BasicAcceptedElems } from 'cheerio'

import { MangaReader } from './base'
import { decodeHtmlEntity, parseDate, getImageUrl } from '../helper'


export const parseMangaDetails = async ($: CheerioAPI, mangaId: string, data: MangaReader): Promise<SourceManga> => {
    const titles = [decodeHtmlEntity($('.postbody .entry-title').text().trim())]   
    const image = getImageUrl($, $('.postbody .thumb img'))
    const author = $(`${data.author_artist_selector}:contains(${data.author_manga_selector}) :last-child`).text().trim()
    const artist = $(`${data.author_artist_selector}:contains(${data.artist_manga_selector}) :last-child`).text().trim()
    const description = decodeHtmlEntity($(data.description_selector).text().trim())
    const rating = $('.postbody .rating .num').text() 

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
        "viewer": (data.viewer)($, categories)
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

export const parseChapters = ($: CheerioAPI, mangaId: string, data: MangaReader): Chapter[] => {
    const chapters: Chapter[] = []

    for (const chapter of $(data.chapter_selector).toArray()) {
        if ($('span.chapternum', chapter).text().trim() == "") continue

        const chapterId = $('a', chapter).attr('href')?.trim().replace(new RegExp(`${data.base_url+ "/"}`, 'g'), '').replace('/', '') ?? ""
        let title = $('span.chapternum', chapter).text().split(/(\d+) /)[2]?.trim().replace('-', '').trim() ?? undefined

        let chapNum = 0
        let match_num = chapterId.match(/-(\d+(?:-\d+)?)/)
        if (match_num) {
            chapNum = Number(match_num[1]?.replace('-', '.'))
        } else {
            title = $('span.chapternum', chapter).text().trim()
        }

        const date = parseDate($('span.chapterdate', chapter).text().trim(), data.date_format, data.date_lang)
        
        chapters.push(App.createChapter({
            id: chapterId,
            name: title,
            langCode: data.lang_code,
            chapNum: isNaN(chapNum) ? 0 : chapNum,
            time: date
        }))
    }

    if (chapters.length == 0) {
        throw new Error(`Couldn't find any chapters for mangaId: ${mangaId}!`)
    }

    return chapters
}

export const parseChapterDetails = async ($: CheerioAPI, mangaId: string, chapterId: string, data: MangaReader): Promise<ChapterDetails> => {
    const pages: string[] = []

    let images = $(data.chapter_details_selector).toArray()

    if (images.length > 1) {
        images.map((page: BasicAcceptedElems<any>) => pages.push(getImageUrl($, page)))
    } else {
        images = JSON.parse(/ts_reader.run\((.[^;]+)\)/.exec($('html').html() ?? '')![1]!).sources[0].images
        images.map((page: string) => pages.push(page))
    }
    
    const chapterDetails = App.createChapterDetails({
        id: chapterId,
        mangaId: mangaId,
        pages: pages
    })

    return chapterDetails
}

export const parseSearchResults = ($: CheerioAPI, data: MangaReader): PartialSourceManga[] => {
    const mangaItems: PartialSourceManga[] = []
    const collectedIds: string[] = []

    for (const manga of $(data.search_selector).toArray()) {
        const id: string = $('a', manga).attr('href')?.split('/')[4] ?? ''
        const image: string = getImageUrl($, $('img', manga))
        const title: string = decodeHtmlEntity($('a', manga).attr('title') ?? '')
        const subtitle: string = decodeHtmlEntity($('.epxs', manga).text().trim())

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

export const parseSearchTags = ($: CheerioAPI): TagSection[] => {
    const arrayGenres: Tag[] = []
    const arrayStatus: Tag[] = []
    const arrayType: Tag[] = []
    const arrayOrderBy: Tag[] = []

    // Genres
    for (let item of $('form.filters li:has([id*=genre])').toArray()) {
        let id = `${$('input', item).attr('name')}=${$('input', item).attr('value')}`
        let label = decodeHtmlEntity($('label', item).text().trim())

        arrayGenres.push({ id, label })
    }
    // Status
    for (let item of $('form.filters li:has([id*=anime_status])').toArray()) {
        let id = `${$('input', item).attr('name')}=${$('input', item).attr('value')}`
        let label = decodeHtmlEntity($('label', item).text().trim())

        arrayStatus.push({ id, label })
    }
    // Type
    for (let item of $('form.filters li:has([id*=type])').toArray()) {
        let id = `${$('input', item).attr('name')}=${$('input', item).attr('value')}`
        let label = decodeHtmlEntity($('label', item).text().trim())

        arrayType.push({ id, label })
    }
    // Trier par
    for (let item of $('form.filters li:has([id*=sort_by])').toArray()) {
        let id = `${$('input', item).attr('name')}=${$('input', item).attr('value')}`
        let label = decodeHtmlEntity($('label', item).text().trim())

        arrayOrderBy.push({ id, label })
    }

    return [
        App.createTagSection({ id: '0', label: "Genres", tags: arrayGenres.map(x => App.createTag(x)) }),
        App.createTagSection({ id: '1', label: "Status", tags: arrayStatus.map(x => App.createTag(x)) }),
        App.createTagSection({ id: '2', label: "Type", tags: arrayType.map(x => App.createTag(x)) }),
        App.createTagSection({ id: '3', label: "Trier par", tags: arrayOrderBy.map(x => App.createTag(x)) })
    ]
}
