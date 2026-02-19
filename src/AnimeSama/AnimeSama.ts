import {
    BadgeColor,
    Chapter,
    ChapterDetails,
    ContentRating,
    HomeSection,
    PagedResults,
    PartialSourceManga,
    SearchRequest,
    Source,
    SourceInfo,
    SourceIntents,
    SourceManga,
    TagSection,
} from '@paperback/types'

const BASE_URL = 'https://anime-sama.tv'
const CATALOGUE_URL = `${BASE_URL}/catalogue/`
const PAGE_SIZE = 40

export const AnimeSamaInfo: SourceInfo = {
    version: '1.0.4',
    language: 'FR',
    name: 'Anime-Sama (Scans)',
    icon: 'icon.png',
    author: 'hydroft1',
    authorWebsite: 'https://github.com/hydroft1',
    description: 'Extension that pulls mangas from https://anime-sama.tv',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: BASE_URL,
    sourceTags: [
        {
            text: 'FR',
            type: BadgeColor.BLUE,
        },
    ],
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
}

type CatalogueEntry = {
    title: string
    path: string
    image: string
    type: string
    subtitle?: string
}

type CataloguePage = {
    entries: CatalogueEntry[]
    hasNextPage: boolean
}

export class AnimeSama extends Source {
    private scanAvailabilityCache: Record<string, boolean> = {}

    requestManager = App.createRequestManager({
        requestsPerSecond: 4,
        requestTimeout: 20000,
    })

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const mangaUrl = this.normalizeMangaPath(mangaId)
        const response = await this.requestManager.schedule(
            App.createRequest({ url: mangaUrl, method: 'GET' }),
            1,
        )

        const $ = this.cheerio.load(String(response.data))
        const title = this.cleanText($('#titreOeuvre').first().text()) || this.cleanText($('meta[property="og:title"]').attr('content')) || mangaId
        const desc = this.cleanText($('meta[name="description"]').attr('content'))
        const genres = this.extractGenresFromMangaPage($)
        const image =
            this.cleanText($('meta[property="og:image"]').attr('content')) ||
            this.cleanText($('#coverOeuvre').attr('src')) ||
            this.cleanText($('#imgOeuvre').attr('src'))

        const tags = genres.length > 0
            ? [
                App.createTagSection({
                    id: 'genres',
                    label: 'Genres',
                    tags: genres.map((genre) =>
                        App.createTag({
                            id: this.toTagId(genre),
                            label: genre,
                        }),
                    ),
                }),
            ]
            : undefined

        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({
                titles: [title],
                image,
                desc,
                status: 'UNKNOWN',
                tags,
            }),
        })
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const mangaUrl = this.normalizeMangaPath(mangaId)
        const readerUrl = await this.resolveReaderUrl(mangaUrl)
        const readerResponse = await this.requestManager.schedule(
            App.createRequest({ url: readerUrl, method: 'GET' }),
            1,
        )

        const html = String(readerResponse.data)
        const $ = this.cheerio.load(html)
        const oeuvreName = this.getReaderOeuvreName($, html)
        const chapterMap = await this.fetchChapterMap(oeuvreName)

        const chapterCount = Object.keys(chapterMap).length
        const chapterLabels = this.buildChapterLabels(html, chapterCount)
        const langCode = readerUrl.includes('/va') ? 'en' : 'fr'

        const chapters: Chapter[] = []
        for (let i = 1; i <= chapterCount; i++) {
            chapters.push(
                App.createChapter({
                    id: `${i}`,
                    chapNum: i,
                    name: chapterLabels[i - 1] ?? `Chapitre ${i}`,
                    langCode,
                    sortingIndex: i,
                }),
            )
        }

        return chapters
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const mangaUrl = this.normalizeMangaPath(mangaId)
        const readerUrl = await this.resolveReaderUrl(mangaUrl)
        const readerResponse = await this.requestManager.schedule(
            App.createRequest({ url: readerUrl, method: 'GET' }),
            1,
        )

        const html = String(readerResponse.data)
        const $ = this.cheerio.load(html)
        const oeuvreName = this.getReaderOeuvreName($, html)
        const chapterMap = await this.fetchChapterMap(oeuvreName)

        const chapterNumber = Number(chapterId)
        const imageCount = chapterMap[chapterNumber]
        if (!imageCount || Number.isNaN(chapterNumber)) {
            throw new Error(`Chapitre introuvable: ${chapterId}`)
        }

        const encodedOeuvreName = encodeURIComponent(oeuvreName)
        const pages: string[] = []
        for (let i = 1; i <= imageCount; i++) {
            pages.push(`${BASE_URL}/s2/scans/${encodedOeuvreName}/${chapterNumber}/${i}.jpg`)
        }

        return App.createChapterDetails({
            id: chapterId,
            mangaId,
            pages,
        })
    }

    override async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const term = (query.title ?? '').trim()
        const termLower = term.toLowerCase()
        let remotePage = metadata?.remotePage ?? 1
        const results: CatalogueEntry[] = []
        let hasNextPage = false

        // Keep requesting catalogue pages until we have enough scan entries for this response.
        while (results.length < PAGE_SIZE) {
            const pageData = await this.fetchCatalogueEntries(remotePage, term)
            let filteredPage = pageData.entries.filter((entry) => {
                if (!entry.type.toLowerCase().includes('scan')) return false
                if (!termLower) return true
                return entry.title.toLowerCase().includes(termLower)
            })

            if (termLower) {
                filteredPage = await this.filterEntriesWithRealScans(filteredPage)
            }
            results.push(...filteredPage)

            hasNextPage = pageData.hasNextPage
            if (!hasNextPage) break
            remotePage++
        }

        const pageItems = results.slice(0, PAGE_SIZE)
        const partials: PartialSourceManga[] = pageItems.map((entry) =>
            App.createPartialSourceManga({
                mangaId: entry.path,
                title: entry.title,
                image: entry.image,
                subtitle: this.getScanSubtitle(entry.type, entry.subtitle),
            }),
        )

        return App.createPagedResults({
            results: partials,
            metadata: hasNextPage ? { remotePage } : undefined,
        })
    }

    override async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const page1 = await this.fetchCatalogueEntries(1)
        const scans = page1.entries.filter((entry) => entry.type.toLowerCase().includes('scan')).slice(0, 30)

        const section = App.createHomeSection({
            id: 'anime-sama-scans',
            title: 'Anime-Sama - Scans',
            type: 'singleRowNormal',
            containsMoreItems: false,
            items: scans.map((entry) =>
                App.createPartialSourceManga({
                    mangaId: entry.path,
                    title: entry.title,
                    image: entry.image,
                    subtitle: this.getScanSubtitle(entry.type, entry.subtitle),
                }),
            ),
        })

        sectionCallback(section)
    }

    override async getTags(): Promise<TagSection[]> {
        return []
    }

    private async fetchCatalogueEntries(page = 1, searchText = ''): Promise<CataloguePage> {
        const params: string[] = [`page=${page}`, 'type%5B%5D=Scans']
        if (searchText.trim().length > 0) {
            params.push(`search_text=${encodeURIComponent(searchText.trim())}`)
        }

        const response = await this.requestManager.schedule(
            App.createRequest({
                url: CATALOGUE_URL,
                method: 'GET',
                param: `?${params.join('&')}`,
            }),
            1,
        )

        const $ = this.cheerio.load(String(response.data))
        const entries: CatalogueEntry[] = []

        $('#list_catalog .catalog-card').each((_, card) => {
            const anchor = $(card).find('a').first()
            const rawHref = this.cleanText(anchor.attr('href'))
            if (!rawHref) return

            const title = this.cleanText($(card).find('.card-title').first().text())
            const image = this.cleanText($(card).find('img.card-image').first().attr('src'))

            let type = ''
            let subtitle = ''
            $(card)
                .find('.info-row')
                .each((__, row) => {
                    const label = this.cleanText($(row).find('.info-label').first().text()).toLowerCase()
                    const value = this.cleanText($(row).find('.info-value').first().text())

                    if (label === 'types') type = value
                    if (label === 'langues') subtitle = value
                })

            const path = this.toPath(rawHref)
            if (!path || !title) return

            entries.push({
                title,
                path,
                image,
                type,
                subtitle,
            })
        })

        const hasNextPage = this.hasNextCataloguePage($, page)
        return { entries, hasNextPage }
    }

    private hasNextCataloguePage($: any, currentPage: number): boolean {
        let hasNext = false
        $('#list_pagination a').each((_: any, el: any) => {
            const href = this.cleanText($(el).attr('href'))
            const match = href.match(/[?&]page=(\d+)/)
            const page = Number(match?.[1] ?? '')
            if (!Number.isNaN(page) && page > currentPage) {
                hasNext = true
            }
        })
        return hasNext
    }

    private async filterEntriesWithRealScans(entries: CatalogueEntry[]): Promise<CatalogueEntry[]> {
        const valid: CatalogueEntry[] = []

        for (const entry of entries) {
            if (await this.hasRealScanReader(entry.path)) {
                valid.push(entry)
            }
        }

        return valid
    }

    private async hasRealScanReader(mangaPath: string): Promise<boolean> {
        const key = mangaPath
        const cached = this.scanAvailabilityCache[key]
        if (cached !== undefined) {
            return cached
        }

        try {
            const response = await this.requestManager.schedule(
                App.createRequest({ url: `${BASE_URL}${mangaPath}`, method: 'GET' }),
                1,
            )
            const html = String(response.data)
            const hasScan = this.extractScanPaths(html).length > 0
            this.scanAvailabilityCache[key] = hasScan
            return hasScan
        }
        catch (_) {
            this.scanAvailabilityCache[key] = false
            return false
        }
    }

    private async resolveReaderUrl(mangaUrl: string): Promise<string> {
        const response = await this.requestManager.schedule(
            App.createRequest({ url: mangaUrl, method: 'GET' }),
            1,
        )

        const html = String(response.data)
        const scanPaths = this.extractScanPaths(html)

        const preferred = scanPaths.find((path) => path.includes('vf')) ?? scanPaths[0] ?? 'scan/vf'
        const readerUrl = this.joinUrl(mangaUrl.endsWith('/') ? mangaUrl : `${mangaUrl}/`, preferred)

        return readerUrl.endsWith('/') ? readerUrl : `${readerUrl}/`
    }

    private async fetchChapterMap(oeuvreName: string): Promise<Record<number, number>> {
        const response = await this.requestManager.schedule(
            App.createRequest({
                url: `${BASE_URL}/s2/scans/get_nb_chap_et_img.php?oeuvre=${encodeURIComponent(oeuvreName)}`,
                method: 'GET',
            }),
            1,
        )

        const raw = typeof response.data === 'string' ? JSON.parse(response.data) : response.data
        const map: Record<number, number> = {}

        for (const [key, value] of Object.entries(raw ?? {})) {
            const chapter = Number(key)
            const pages = Number(value)
            if (!Number.isNaN(chapter) && !Number.isNaN(pages)) {
                map[chapter] = pages
            }
        }

        return map
    }

    private getReaderOeuvreName($: any, html: string): string {
        // Anime-Sama's scans API expects the exact string used in #titreOeuvre (including trailing spaces).
        const fromHtml = $('#titreOeuvre').first().html()
        if (typeof fromHtml === 'string' && fromHtml.length > 0) {
            return fromHtml.replace(/<[^>]*>/g, '')
        }

        const match = html.match(/id=["']titreOeuvre["'][^>]*>([\s\S]*?)<\/h\d>/i)
        if (match?.[1]) {
            return match[1].replace(/<[^>]*>/g, '')
        }

        return this.cleanText($('#titreOeuvre').first().text())
    }

    private getScanSubtitle(type: string, fallback?: string): string {
        const normalized = type.toLowerCase()
        if (normalized.includes('anime') && normalized.includes('scan')) {
            return 'Anime + Scans'
        }
        if (normalized.includes('scan')) {
            return 'Scans'
        }
        return fallback ?? ''
    }

    private buildChapterLabels(html: string, chapterCount: number): string[] {
        const defaults = Array.from({ length: chapterCount }, (_, i) => `Chapitre ${i + 1}`)
        const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)]
            .map((m) => m[1] ?? '')
            .filter((script) => script.length > 0)
        const customScript = scripts.find((script) => /resetListe\(|creerListe\(|newSP\(|newSPF\(|finirListe\(/.test(script))

        if (!customScript) return defaults

        const labels: string[] = []
        let customCalls = 0
        let chapRetards = 0
        const callRegex = /(resetListe\(\)|creerListe\(\s*\d+\s*,\s*\d+\s*\)|newSP\(\s*(?:"[^"]*"|'[^']*')\s*\)|newSPF\(\s*(?:"[^"]*"|'[^']*')\s*\)|finirListe\(\s*\d+\s*\))/g

        for (const match of customScript.matchAll(callRegex)) {
            const call = match[1] ?? ''
            customCalls++

            if (call.startsWith('resetListe')) {
                labels.length = 0
                continue
            }

            const creer = call.match(/^creerListe\(\s*(\d+)\s*,\s*(\d+)\s*\)$/)
            if (creer) {
                const start = Number(creer[1])
                const end = Number(creer[2])
                for (let i = start; i <= end; i++) {
                    labels.push(`Chapitre ${i}`)
                }
                continue
            }

            const newSP = call.match(/^newSP\(\s*"([^"]*)"\s*\)$|^newSP\(\s*'([^']*)'\s*\)$/)
            if (newSP) {
                const text = newSP[1] ?? newSP[2] ?? ''
                labels.push(`Chapitre ${text}`)
                chapRetards++
                continue
            }

            const newSPF = call.match(/^newSPF\(\s*"([^"]*)"\s*\)$|^newSPF\(\s*'([^']*)'\s*\)$/)
            if (newSPF) {
                const text = newSPF[1] ?? newSPF[2] ?? ''
                labels.push(text)
                chapRetards++
                continue
            }

            const finir = call.match(/^finirListe\(\s*(\d+)\s*\)$/)
            if (finir) {
                const start = Number(finir[1])
                for (let i = start; i <= chapterCount - chapRetards; i++) {
                    labels.push(`Chapitre ${i}`)
                }
            }
        }

        if (customCalls === 0 || labels.length !== chapterCount) {
            return defaults
        }

        return labels
    }

    private normalizeMangaPath(mangaId: string): string {
        const path = this.toPath(mangaId)
        if (!path) {
            throw new Error(`Identifiant manga invalide: ${mangaId}`)
        }
        return `${BASE_URL}${path}`
    }

    private toPath(urlOrPath: string): string {
        const value = this.cleanText(urlOrPath)
        if (!value) return ''

        if (value.startsWith('http://') || value.startsWith('https://')) {
            const pathname = this.extractPathFromAbsoluteUrl(value)
            return pathname
        }

        const withStartSlash = value.startsWith('/') ? value : `/${value}`
        return withStartSlash.endsWith('/') ? withStartSlash : `${withStartSlash}/`
    }

    private extractPathFromAbsoluteUrl(url: string): string {
        const match = url.match(/^https?:\/\/[^/]+(\/[^?#]*)?/i)
        const pathname = (match?.[1] ?? '/').trim()
        return pathname.endsWith('/') ? pathname : `${pathname}/`
    }

    private joinUrl(baseUrl: string, pathOrUrl: string): string {
        const value = this.cleanText(pathOrUrl)
        if (!value) return baseUrl

        if (value.startsWith('http://') || value.startsWith('https://')) {
            return value
        }

        const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
        if (value.startsWith('/')) {
            return `${BASE_URL}${value}`
        }
        return `${base}/${value}`
    }

    private cleanText(value: string | undefined): string {
        return (value ?? '').replace(/\s+/g, ' ').trim()
    }

    private extractScanPaths(html: string): string[] {
        const sanitized = html.replace(/\/\*[\s\S]*?\*\//g, '')
        return [...sanitized.matchAll(/panneauScan\(\s*['"]Scans['"]\s*,\s*['"]([^'"]+)['"]\s*\)/g)]
            .map((m) => m[1] ?? '')
            .filter((path) => path.length > 0)
    }

    private extractGenresFromMangaPage($: any): string[] {
        let rawGenres = ''
        $('h2').each((_: any, el: any) => {
            const heading = this.cleanText($(el).text()).toLowerCase()
            if (heading === 'genres') {
                rawGenres = this.cleanText($(el).next().text())
            }
        })

        if (!rawGenres) return []

        return rawGenres
            .split(',')
            .map((genre) => this.cleanText(genre))
            .filter((genre) => genre.length > 0)
    }

    private toTagId(label: string): string {
        return label
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
    }
}
