import {
    ContentRating,
    SourceInfo,
    BadgeColor,
    SourceIntents
} from '@paperback/types'

import {
    Madara
} from '../templates/Madara/Madara'


const DOMAIN: string = 'https://www.mangascantrad.fr'

export const Manga_ScantradInfo: SourceInfo = {
    version: "1.1",
    language: "FR",
    name: 'Manga_Scantrad',
    icon: 'icon.png',
    description: `Extension that pulls mangas from ${DOMAIN}`,
    author: 'Moomooo95',
    authorWebsite: 'https://github.com/Moomooo95',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: DOMAIN,
    sourceTags: [
        {
            text: 'FR',
            type: BadgeColor.GREY
        },
    ],
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED
}

export class Manga_Scantrad extends Madara {
    base_url = DOMAIN
    lang_code = Manga_ScantradInfo.language!
    override alt_ajax: boolean = true
}