import { Chapter, ChapterDetails, HomeSection, LanguageCode, Manga, MangaStatus, MangaTile, MangaUpdates, PagedResults, SearchRequest, TagSection } from "paperback-extensions-common";
import { parseJsonText } from "typescript";


//////////////////////
/////            /////
/////    HOME    /////
/////            /////
//////////////////////


    //////////////////////////////////////////
    /////    DEFINITIONS DES SECTIONS    /////
    //////////////////////////////////////////


              //////////////////////////////////////
              /////    DERNIERS MANGA SORTI    /////
              //////////////////////////////////////

const parseHotManga = ($: CheerioStatic): MangaTile[] => {
  const hotManga: MangaTile[] = []

  for (const item of $('.swiper-wrapper .swiper-slide').toArray()) {
    let url = $('a', item).first().attr('href')?.split("/")[4]
    let image = ""
    let title = $('.name', item).text()
    let subtitle = ""
    
    console.log(url + " " + image + " " + title + " " + subtitle)

    // Credit to @GameFuzzy
    // Checks for when no id or image found
    if (typeof url === 'undefined' || typeof image === 'undefined') 
      continue

      hotManga.push(createMangaTile({
      id: url,
      image: image,
      title: createIconText({ text: title }),
      subtitleText: createIconText({ text: subtitle }),
    }))
  }

  return hotManga
}


              /////////////////////////////////
              /////    MANGA POPULAIRE    /////
              /////////////////////////////////

const parsePopularMangaToday = ($: CheerioStatic): MangaTile[] => {
  const popularMangaToday: MangaTile[] = []

  for (const item of $('.hotslid .bs').toArray()) {
    let url = $('a', item).first().attr('href')?.split("/")[4]
    let image = $('img', item).attr('src')
    let title = $('.tt', item).text()
    let subtitle = $('.epxs', item).text()

    //console.log(url + " " + image + " " + title + " " + subtitle)

    // Credit to @GameFuzzy
    // Checks for when no id or image found
    if (typeof url === 'undefined' || typeof image === 'undefined') 
      continue

      popularMangaToday.push(createMangaTile({
      id: url,
      image: image,
      title: createIconText({ text: title }),
      subtitleText: createIconText({ text: subtitle })
    }))
  }

  return popularMangaToday
}


              ///////////////////////////
              /////    TOP MANGA    /////
              ///////////////////////////

const parseTopManga = ($: CheerioStatic): MangaTile[] => {
  const topManga: MangaTile[] = []

  for (const item of $('body li').toArray()) {
    let url = $('a', item).first().attr('href')?.split("/")[4]
    let image = "https://lelscan-vf.co/uploads/manga/" + url + "/cover/cover_250x350.jpg"
    let title = $('strong', item).text()
    let subtitle = $('a', item).eq(2).text()
    
    // console.log(url + " " + image + " " + title + " " + subtitle)

    // Credit to @GameFuzzy
    // Checks for when no id or image found
    if (typeof url === 'undefined' || typeof image === 'undefined') 
      continue

    topManga.push(createMangaTile({
      id: url,
      image: image,
      title: createIconText({ text: title }),
      subtitleText: createIconText({ text: subtitle })
    }))
  }

  return topManga
}


    //////////////////////////////
    /////    HOME SECTION    /////
    //////////////////////////////

export const parseHomeSections = ($: CheerioStatic, sections: HomeSection[], sectionCallback: (section: HomeSection) => void): void => {
  for (const section of sections) sectionCallback(section)
  const hotManga: MangaTile[] = parseHotManga($)
  const popularMangaToday: MangaTile[] = parsePopularMangaToday($)
  
  sections[0].items = hotManga
  sections[1].items = popularMangaToday

  // Perform the callbacks again now that the home page sections are filled with data
  for (const section of sections) sectionCallback(section)
}