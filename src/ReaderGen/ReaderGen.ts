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
    version: "1.0",
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

    override genres_condition_filter_or: string = "OU (ayant l'un des genres sélectionnés)"
    override genres_condition_filter_and: string = "ET (ayant tous les genres sélectionnés)"

    override adult_filter_all: string = "Tout"
    override adult_filter_none: string = "Aucun contenu pour adultes"
    override adult_filter_only: string = "Uniquement du contenu pour adultes"

    override status_filter_ongoing: string = "En cours"
    override status_filter_completed: string = "Complété"
    override status_filter_cancelled: string = "Annulé"
    override status_filter_on_hold: string = "En attente"
}