import {
    ContentRating,
    SourceInfo,
    BadgeColor,
    SourceIntents
} from '@paperback/types'

import {
    Madara
} from '../templates/madara/base'


const DOMAIN: string = 'https://mangas-origines.fr'

export const MangasOriginesInfo: SourceInfo = {
    version: "2.2",
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
    override search_fileds_name_list: { default: string; new: string }[] = [
        { default: "Author", new: "Auteur" },
        { default: "Artist", new: "Artiste" },
        { default: "An", new: "Année" },
    ]
    override genres_conditions_name_list: { default: string; new: string }[] = [
        { default: "Au moins un des tag sélectionné", new: "OU (ayant au moins un des genres sélectionné)" },
        { default: "Tous les tags sélectionnés", new: "ET (ayant tous les genres sélectionné)" }
    ]
    override adult_content_name_list: { default: string; new: string }[] = [
        { default: "Oui", new: "Tout" },
        { default: "Pas de contenus pour adulte", new: "Aucun contenu pour adulte" },
        { default: "Seulement du contenus pour adulte", new: "Seulement du contenu pour adulte" }
    ]
}