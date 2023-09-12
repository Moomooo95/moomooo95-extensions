import {
    ContentRating,
    SourceInfo,
    BadgeColor,
    SourceIntents
} from '@paperback/types'

import {
    Madara
} from '../templates/Madara/Madara'


const DOMAIN: string = 'https://pantheon-scan.com'

export const PantheonScanInfo: SourceInfo = {
    version: "1.0",
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
    override date_format: string = "DD MMMM YYYY"
    override alt_ajax: boolean = true

    override genres_condition_filter_or: string = "OU (ayant l'un des genres sélectionnés)"
    override genres_condition_filter_and: string = "ET (avoir tous les genres sélectionnés)"

    override adult_filter_all: string = "Tout"
    override adult_filter_none: string = "Aucun contenu pour adultes"
    override adult_filter_only: string = "Inclus des scènes pour adultes"

    override status_filter_ongoing: string = "OnGoing"
}