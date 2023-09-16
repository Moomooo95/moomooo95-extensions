import {
    ContentRating,
    SourceInfo,
    BadgeColor,
    SourceIntents
} from '@paperback/types'

import {
    Madara
} from '../templates/Madara/Madara'


const DOMAIN: string = 'https://fr.readergen.fr'

export const ReaderGenInfo: SourceInfo = {
    version: "1.1",
    language: "FR",
    name: 'ReaderGen',
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

export class ReaderGen extends Madara {
    base_url = DOMAIN
    lang_code = ReaderGenInfo.language!
    override alt_ajax: boolean = true
    override cloudflare_domain: boolean = false
    override description_selector: string = "div.manga-excerpt"
}