import {
    ContentRating,
    SourceInfo,
    BadgeColor,
    SourceIntents
} from '@paperback/types'

import {
    Madara
} from '../templates/Madara/Madara'


const DOMAIN: string = 'https://scantrad-vf.co'

export const ScantradVFInfo: SourceInfo = {
    version: "1.1",
    language: "FR",
    name: 'ScantradVF',
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

export class ScantradVF extends Madara {
    base_url = DOMAIN
    lang_code = ScantradVFInfo.language!
    override date_format: string = "DD MMMM YYYY"
    override alt_ajax: boolean = true
}