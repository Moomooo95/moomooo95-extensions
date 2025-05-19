import {
    ContentRating,
    SourceInfo,
    BadgeColor,
    SourceIntents
} from '@paperback/types'

import {
    MangaReader
} from '../templates/mangareader/base'


const DOMAIN: string = 'https://phenixscans.fr'

export const PhenixScansInfo: SourceInfo = {
    version: "1.1",
    language: "FR",
    name: 'PhenixScans',
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

export class PhenixScans extends MangaReader {
    base_url = DOMAIN
    lang_code = PhenixScansInfo.language!
}