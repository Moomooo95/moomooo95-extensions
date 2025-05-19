import {
    ContentRating,
    SourceInfo,
    BadgeColor,
    SourceIntents
} from '@paperback/types'

import {
    MangaReader
} from '../templates/mangareader/base'


const DOMAIN: string = 'https://www.lelmanga.com'

export const LelMangaInfo: SourceInfo = {
    version: "1.2",
    language: "FR",
    name: 'LelManga',
    icon: 'icon.png',
    description: `Extension that pulls mangas from ${DOMAIN}`,
    author: 'Moomooo95',
    authorWebsite: 'https://github.com/Moomooo95',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    sourceTags: [
        {
            text: 'FR',
            type: BadgeColor.GREY
        },
    ],
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED
}

export class LelManga extends MangaReader {
    base_url = DOMAIN
    lang_code = LelMangaInfo.language!
    override date_lang: string = "en"
    override author_artist_selector: string = ".postbody .imptdt"
}