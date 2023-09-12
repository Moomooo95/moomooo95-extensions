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
    version: "1.0",
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

    override genres_condition_filter_or: string = "OU (ayant un de certains genres)"
    override genres_condition_filter_and: string = "ET (avoir tous les genres)"

    override adult_filter_all: string = "Tous"
    override adult_filter_none: string = "Aucun contenu adulte"
    override adult_filter_only: string = "Seuls les contenus pour adultes"

    override status_filter_ongoing: string = "En cours"
    override status_filter_completed: string = "Terminé"
    override status_filter_cancelled: string = "Annulé"
    override status_filter_on_hold: string = "En Attente"
}