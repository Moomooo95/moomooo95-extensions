import {
    ContentRating,
    SourceInfo,
    BadgeColor,
    SourceIntents
} from '@paperback/types'

import {
    MangaReader
} from '../templates/mangareader/base'


const DOMAIN: string = 'https://sushiscan.net'

export const SushiScanInfo: SourceInfo = {
    version: "1.2",
    language: "FR",
    name: 'SushiScan',
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

export class SushiScan extends MangaReader {
    base_url = DOMAIN
    lang_code = SushiScanInfo.language!
    override source_path: string = "catalogue"
    override artist_manga_selector: string = "Dessinateur"
}