import {
    ContentRating,
    SourceInfo,
    BadgeColor,
    SourceIntents
} from '@paperback/types'

import {
    Madara
} from '../templates/Madara/Madara'


const DOMAIN: string = 'https://astral-manga.fr'

export const AstralMangaInfo: SourceInfo = {
    version: "1.0",
    language: "FR",
    name: 'AstralManga',
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

export class AstralManga extends Madara {
    base_url = DOMAIN
    lang_code = AstralMangaInfo.language!
    override alt_ajax: boolean = true
    override description_selector: string = "div.manga-excerpt p"

    override genres_condition_filter_or: string = "OU (avoir un des genres sélectionnés)"
    override genres_condition_filter_and: string = "ET (avoir tous les genres sélectionnés)"

    override adult_filter_all: string = "Tous"
    override adult_filter_none: string = "Aucun contenu adulte"
    override adult_filter_only: string = "Contenu pour adultes uniquement"

    override status_filter_ongoing: string = "En cours"
    override status_filter_completed: string = "Terminé"
    override status_filter_cancelled: string = "Annulé"
    override status_filter_on_hold: string = "En attente"
    override status_filter_upcoming: string = "Prochainement"
}