import {
    ContentRating,
    SourceInfo,
    BadgeColor,
    SourceIntents    
} from '@paperback/types'

import {
    Madara
} from '../templates/madara/base'


const DOMAIN: string = 'https://reaperscans.fr'

export const ReaperScansFRInfo: SourceInfo = {
    version: "2.1",
    language: "FR",
    name: 'ReaperScansFR',
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

export class ReaperScansFR extends Madara {
    base_url = DOMAIN
    lang_code = ReaperScansFRInfo.language!
    override source_path: string = "serie"
    override alt_ajax: boolean = true
}