import moment from 'moment/min/moment-with-locales';

export function decodeHtmlEntity(str: string) {
  return str.replace(/&#(\d+);/g, function (match, dec) {
    return String.fromCharCode(dec);
  })
}

export function isEncoded(uri: string) {
  uri = uri || '';
  return uri !== decodeURIComponent(uri);
}

export function parseDate(date_str: string, date_format: string, date_lang: string) : Date {
  moment.locale(date_lang)
  
  date_str = decodeHtmlEntity(date_str)

  let date = moment(date_str, date_format)
  
  if (!date.isValid()) {
    let match = date_str.match(/(\d+) (\w*)/)
    if (match) {
        let unit = match[2]![0]
        if (unit == "j") unit = "d"
        if (unit == "s") unit = "w"

        date = moment().subtract(match[1], unit)
    } else {
      date = moment().startOf("day")
    }
  }    

  return date.toDate()
}

export function getImageUrl($: CheerioStatic, item: CheerioElement) {
  if (item == "") return ""

  let all_attrs = Object.keys($(item).get(0).attribs).map(name => ({ name, value: $(item).get(0).attribs[name] }))
  let all_attrs_srcset = all_attrs.filter(el => el.name.includes('srcset') )
  let all_attrs_src = all_attrs.filter(el => el.name.includes('src') && !el.name.includes('srcset') && !el.value.includes('data:image/svg+xml') )

  let image = ""
  if (all_attrs_srcset.length) {
      let all_srcset = all_attrs_srcset.map(el => el.value.split(',').sort(function(a: string, b: string) { return /\d+[w]/.exec(a)![0] < /\d+[w]/.exec(b)![0] })[0])
      image = all_srcset
          .filter(function(element, index, self) { return index === self.indexOf(element) })
          // .sort(function(a, b) { return /\d+[w]/.exec(a)![0] > /\d+[w]/.exec(b)![0] })
          [0].trim()
          .split(' ')[0].trim()
  } else {
      let all_src = all_attrs_src.map(el => el.value)  
      image = all_src[0]
  }

  let uri = image.replace(/-[1,3](\w){2}x(\w){3}[.]{1}/gm, '.').replace(/-[75]+x(\w)+[.]{1}/gm, '.').replace(/(\r\n|\n|\r)/gm, "").replace("http:", "https:").trim()

  return isEncoded(uri) ? uri : encodeURI(uri)
}

