import {
    Chapter,
    ChapterDetails,
    Tag,
    SourceManga,
    PartialSourceManga,
    TagSection,
} from '@paperback/types'

import { CheerioAPI } from 'cheerio'

import { API_DOMAIN } from './PhenixScans'
import { decodeHtmlEntity } from '../templates/helper'


export const parseMangaDetails = async (json: any, mangaId: string): Promise<SourceManga> => {
    const manga = json.manga

    const titles = [manga.title]
    const image = `${API_DOMAIN}/${manga.coverImage}`
    const desc = manga.synopsis ?? "Aucune synopsis disponible."
    const rating = Number(manga.averageRating)

    const categories: Tag[] = []
    for (const genre of manga.genres) {
        const id = genre._id
        const label = genre.name

        if (!id || !label) continue
        categories.push({ id, label })
    }
    const tagSections: TagSection[] = [App.createTagSection({ id: '0', label: 'genres', tags: categories.map(x => App.createTag(x)) })]

    let status = "N/A"
    switch (manga.status) {
        case "Ongoing":
            status = "En cours"
            break
        case "Completed":
            status = "Terminé"
            break
        case "Hiatus":
            status = "En pause"
            break
    }

    const additionalInfo: Record<string, string> = {
        "viewer": manga.views,
        "type": manga.type
    }

    return App.createSourceManga({
        id: mangaId,
        mangaInfo: App.createMangaInfo({
            image,
            artist: "N/A",
            author: "N/A",
            desc,
            status,
            hentai: false,
            titles,
            rating,
            tags: tagSections,
            additionalInfo
        })
    })
}

export const parseChapters = (json: any, mangaId: string): Chapter[] => {
    const chapters: Chapter[] = []

    for (const chapter of json.chapters) {
        chapters.push(App.createChapter({
            id: String(chapter.number),
            langCode: "FR",
            chapNum: Number(chapter.number),
            time: new Date(chapter.createdAt)
        }))
    }

    if (chapters.length == 0) {
        throw new Error(`Couldn't find any chapters for mangaId: ${mangaId}!`)
    }

    return chapters
}

export const parseChapterDetails = async (json: any, mangaId: string, chapterId: string): Promise<ChapterDetails> => {
    return App.createChapterDetails({
        id: chapterId,
        mangaId,
        pages: json.chapter.images.map((image: string) => `${API_DOMAIN}/${image}`)
    })
}

export const parseMangaResults = (json: any): PartialSourceManga[] => {
    const mangaItems: PartialSourceManga[] = []
    const collectedIds: string[] = []

    for (const manga of json.mangas) {
        if (manga.slug == "unknown") continue

        const mangaId: string = manga.slug
        const image: string = `${API_DOMAIN}/${manga.coverImage}`
        const title: string = manga.title
        const subtitle: string = ""

        if (!mangaId || !title || collectedIds.includes(mangaId)) continue

        mangaItems.push(App.createPartialSourceManga({
            mangaId,
            image,
            title,
            subtitle
        }))

        collectedIds.push(mangaId)
    }
    return mangaItems
}

export const parseSearchTags = (json: any, $: CheerioAPI): TagSection[] => {
    const arrayTagsSection: TagSection[] = []

    // Genres
    const arrayGenres: Tag[] = []
    for (let item of json.genres) {
        arrayGenres.push({
            id: `genre=${item._id}`,
            label: item.name
        })
    }
    arrayTagsSection.push(
        App.createTagSection({ id: '0', label: "Genres", tags: arrayGenres.map(x => App.createTag(x)) })
    )

    // Type, Status and Sort By
    let idFilters = ["", "type", "status", "sort"]
    for (let index = 1 ; index < 4 ; index++) {
        const arrayFilters: Tag[] = []

        for (let item of $(`.manga-list__filter-group:nth(${index}) .manga-list__select option`).toArray()) {
            const id = `&${idFilters[index]}=${$(item).attr('value')}`
            const label = decodeHtmlEntity($(item).text().trim())

            if (!id || !label) continue

            arrayFilters.push({ id, label})
        }

        arrayTagsSection.push(
            App.createTagSection({ id: String(index), label: $(`.manga-list__filter-group:nth(${index}) .manga-list__filter-label`).text().trim(), tags: arrayFilters.map(x => App.createTag(x)) })
        )        
    }

    return arrayTagsSection
}
