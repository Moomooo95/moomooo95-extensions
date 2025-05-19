import {
    ContentRating,
    SourceInfo,
    BadgeColor,
    SourceIntents
} from '@paperback/types'

import {
    Madara
} from '../templates/madara/base'


const DOMAIN: string = 'https://pantheon-scan.com'

export const PantheonScanInfo: SourceInfo = {
    version: "1.2",
    language: "FR",
    name: 'PantheonScan',
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

export class PantheonScan extends Madara {
    base_url = DOMAIN
    lang_code = PantheonScanInfo.language!
    override title_selector: string = "div#manga-title h1";
    override description_selector: string = ".post-content_item:contains(Summary) div";
    override date_format: string = "DD MMMM YYYY"
    override alt_ajax: boolean = true
}