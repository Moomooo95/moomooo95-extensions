import {
    ContentRating,
    SourceInfo,
    BadgeColor,
    SourceIntents
} from '@paperback/types'

import {
    Madara
} from '../templates/madara/base'


const DOMAIN: string = 'https://astral-manga.fr'

export const AstralMangaInfo: SourceInfo = {
    version: "1.2",
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
    override genres_conditions_name_list: { default: string; new: string }[] = [
        { default: "OU (avoir un des genres sélectionnés)", new: "OU (ayant au moins un des genres sélectionné)" },
        { default: "ET (avoir tous les genres sélectionnés)", new: "ET (ayant tous les genres sélectionné)" }
    ]
    override adult_content_name_list: { default: string; new: string }[] = [
        { default: "Tous", new: "Tout" },
        { default: "Aucun contenu adulte", new: "Aucun contenu pour adulte" },
        { default: "Contenu pour adultes uniquement", new: "Seulement du contenu pour adulte" }
    ]
}