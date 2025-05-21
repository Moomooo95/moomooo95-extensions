import {
    ContentRating,
    SourceInfo,
    BadgeColor,
    SourceIntents
} from '@paperback/types'

import {
    Madara
} from '../templates/madara/base'


const DOMAIN: string = 'https://manga-scantrad.io'

export const MangaScantradInfo: SourceInfo = {
    version: "2.2",
    language: "FR",
    name: 'MangaScantrad',
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

export class MangaScantrad extends Madara {
    base_url = DOMAIN
    lang_code = MangaScantradInfo.language!
    override date_format: string = "DD MMMM YYYY"
    override alt_ajax: boolean = true
    override cloudflare_domain: boolean = false
    override description_selector: string = "div.description-summary .show-more"
}