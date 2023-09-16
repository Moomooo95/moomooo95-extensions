import {
    ContentRating,
    SourceInfo,
    BadgeColor,
    SourceIntents
} from '@paperback/types'

import {
    Madara
} from '../templates/Madara/Madara'


const DOMAIN: string = 'https://mangas-origines.fr'

export const MangasOriginesInfo: SourceInfo = {
    version: "2.1",
    language: "FR",
    name: 'MangasOrigines',
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

export class MangasOrigines extends Madara {
    base_url = DOMAIN
    lang_code = MangasOriginesInfo.language!
    override source_path: string = "oeuvre"
    override alt_ajax: boolean = true
    override cloudflare_domain: boolean = false
    override description_selector: string = ".summary__content p"
}