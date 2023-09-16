import {
    ContentRating,
    SourceInfo,
    BadgeColor,
    SourceIntents
} from '@paperback/types'

import {
    Madara
} from '../templates/Madara/Madara'


const DOMAIN: string = 'https://fr-scan.cc'

export const FrScanInfo: SourceInfo = {
    version: "2.1",
    language: "FR",
    name: 'FrScan',
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

export class FrScan extends Madara {
    base_url = DOMAIN
    lang_code = FrScanInfo.language!
    override date_format: string = "MMMM DD, YYYY"
    override alt_ajax: boolean = true
    override cloudflare_domain: boolean = false
}