(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Sources = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
"use strict";
/**
 * Request objects hold information for a particular source (see sources for example)
 * This allows us to to use a generic api to make the calls against any source
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlEncodeObject = exports.convertTime = exports.Source = void 0;
class Source {
    constructor(cheerio) {
        this.cheerio = cheerio;
    }
    /**
     * @deprecated use {@link Source.getSearchResults getSearchResults} instead
     */
    searchRequest(query, metadata) {
        return this.getSearchResults(query, metadata);
    }
    /**
     * @deprecated use {@link Source.getSearchTags} instead
     */
    getTags() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            return (_a = this.getSearchTags) === null || _a === void 0 ? void 0 : _a.call(this);
        });
    }
}
exports.Source = Source;
// Many sites use '[x] time ago' - Figured it would be good to handle these cases in general
function convertTime(timeAgo) {
    var _a;
    let time;
    let trimmed = Number(((_a = /\d*/.exec(timeAgo)) !== null && _a !== void 0 ? _a : [])[0]);
    trimmed = (trimmed == 0 && timeAgo.includes('a')) ? 1 : trimmed;
    if (timeAgo.includes('minutes')) {
        time = new Date(Date.now() - trimmed * 60000);
    }
    else if (timeAgo.includes('hours')) {
        time = new Date(Date.now() - trimmed * 3600000);
    }
    else if (timeAgo.includes('days')) {
        time = new Date(Date.now() - trimmed * 86400000);
    }
    else if (timeAgo.includes('year') || timeAgo.includes('years')) {
        time = new Date(Date.now() - trimmed * 31556952000);
    }
    else {
        time = new Date(Date.now());
    }
    return time;
}
exports.convertTime = convertTime;
/**
 * When a function requires a POST body, it always should be defined as a JsonObject
 * and then passed through this function to ensure that it's encoded properly.
 * @param obj
 */
function urlEncodeObject(obj) {
    let ret = {};
    for (const entry of Object.entries(obj)) {
        ret[encodeURIComponent(entry[0])] = encodeURIComponent(entry[1]);
    }
    return ret;
}
exports.urlEncodeObject = urlEncodeObject;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tracker = void 0;
class Tracker {
    constructor(cheerio) {
        this.cheerio = cheerio;
    }
}
exports.Tracker = Tracker;

},{}],4:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Source"), exports);
__exportStar(require("./Tracker"), exports);

},{"./Source":2,"./Tracker":3}],5:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./base"), exports);
__exportStar(require("./models"), exports);
__exportStar(require("./APIWrapper"), exports);

},{"./APIWrapper":1,"./base":4,"./models":47}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],7:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],8:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],9:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],10:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],11:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],12:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],13:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],14:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],15:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],16:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],17:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],18:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],19:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],20:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],21:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],22:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],23:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],24:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Button"), exports);
__exportStar(require("./Form"), exports);
__exportStar(require("./Header"), exports);
__exportStar(require("./InputField"), exports);
__exportStar(require("./Label"), exports);
__exportStar(require("./Link"), exports);
__exportStar(require("./MultilineLabel"), exports);
__exportStar(require("./NavigationButton"), exports);
__exportStar(require("./OAuthButton"), exports);
__exportStar(require("./Section"), exports);
__exportStar(require("./Select"), exports);
__exportStar(require("./Switch"), exports);
__exportStar(require("./WebViewButton"), exports);
__exportStar(require("./FormRow"), exports);
__exportStar(require("./Stepper"), exports);

},{"./Button":9,"./Form":10,"./FormRow":11,"./Header":12,"./InputField":13,"./Label":14,"./Link":15,"./MultilineLabel":16,"./NavigationButton":17,"./OAuthButton":18,"./Section":19,"./Select":20,"./Stepper":21,"./Switch":22,"./WebViewButton":23}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeSectionType = void 0;
var HomeSectionType;
(function (HomeSectionType) {
    HomeSectionType["singleRowNormal"] = "singleRowNormal";
    HomeSectionType["singleRowLarge"] = "singleRowLarge";
    HomeSectionType["doubleRow"] = "doubleRow";
    HomeSectionType["featured"] = "featured";
})(HomeSectionType = exports.HomeSectionType || (exports.HomeSectionType = {}));

},{}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageCode = void 0;
var LanguageCode;
(function (LanguageCode) {
    LanguageCode["UNKNOWN"] = "_unknown";
    LanguageCode["BENGALI"] = "bd";
    LanguageCode["BULGARIAN"] = "bg";
    LanguageCode["BRAZILIAN"] = "br";
    LanguageCode["CHINEESE"] = "cn";
    LanguageCode["CZECH"] = "cz";
    LanguageCode["GERMAN"] = "de";
    LanguageCode["DANISH"] = "dk";
    LanguageCode["ENGLISH"] = "gb";
    LanguageCode["SPANISH"] = "es";
    LanguageCode["FINNISH"] = "fi";
    LanguageCode["FRENCH"] = "fr";
    LanguageCode["WELSH"] = "gb";
    LanguageCode["GREEK"] = "gr";
    LanguageCode["CHINEESE_HONGKONG"] = "hk";
    LanguageCode["HUNGARIAN"] = "hu";
    LanguageCode["INDONESIAN"] = "id";
    LanguageCode["ISRELI"] = "il";
    LanguageCode["INDIAN"] = "in";
    LanguageCode["IRAN"] = "ir";
    LanguageCode["ITALIAN"] = "it";
    LanguageCode["JAPANESE"] = "jp";
    LanguageCode["KOREAN"] = "kr";
    LanguageCode["LITHUANIAN"] = "lt";
    LanguageCode["MONGOLIAN"] = "mn";
    LanguageCode["MEXIAN"] = "mx";
    LanguageCode["MALAY"] = "my";
    LanguageCode["DUTCH"] = "nl";
    LanguageCode["NORWEGIAN"] = "no";
    LanguageCode["PHILIPPINE"] = "ph";
    LanguageCode["POLISH"] = "pl";
    LanguageCode["PORTUGUESE"] = "pt";
    LanguageCode["ROMANIAN"] = "ro";
    LanguageCode["RUSSIAN"] = "ru";
    LanguageCode["SANSKRIT"] = "sa";
    LanguageCode["SAMI"] = "si";
    LanguageCode["THAI"] = "th";
    LanguageCode["TURKISH"] = "tr";
    LanguageCode["UKRAINIAN"] = "ua";
    LanguageCode["VIETNAMESE"] = "vn";
})(LanguageCode = exports.LanguageCode || (exports.LanguageCode = {}));

},{}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MangaStatus = void 0;
var MangaStatus;
(function (MangaStatus) {
    MangaStatus[MangaStatus["ONGOING"] = 1] = "ONGOING";
    MangaStatus[MangaStatus["COMPLETED"] = 0] = "COMPLETED";
    MangaStatus[MangaStatus["UNKNOWN"] = 2] = "UNKNOWN";
    MangaStatus[MangaStatus["ABANDONED"] = 3] = "ABANDONED";
    MangaStatus[MangaStatus["HIATUS"] = 4] = "HIATUS";
})(MangaStatus = exports.MangaStatus || (exports.MangaStatus = {}));

},{}],28:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],29:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],30:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],31:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],32:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],33:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],34:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],35:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],36:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],37:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchOperator = void 0;
var SearchOperator;
(function (SearchOperator) {
    SearchOperator["AND"] = "AND";
    SearchOperator["OR"] = "OR";
})(SearchOperator = exports.SearchOperator || (exports.SearchOperator = {}));

},{}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentRating = void 0;
/**
 * A content rating to be attributed to each source.
 */
var ContentRating;
(function (ContentRating) {
    ContentRating["EVERYONE"] = "EVERYONE";
    ContentRating["MATURE"] = "MATURE";
    ContentRating["ADULT"] = "ADULT";
})(ContentRating = exports.ContentRating || (exports.ContentRating = {}));

},{}],40:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],41:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagType = void 0;
/**
 * An enumerator which {@link SourceTags} uses to define the color of the tag rendered on the website.
 * Five types are available: blue, green, grey, yellow and red, the default one is blue.
 * Common colors are red for (Broken), yellow for (+18), grey for (Country-Proof)
 */
var TagType;
(function (TagType) {
    TagType["BLUE"] = "default";
    TagType["GREEN"] = "success";
    TagType["GREY"] = "info";
    TagType["YELLOW"] = "warning";
    TagType["RED"] = "danger";
})(TagType = exports.TagType || (exports.TagType = {}));

},{}],43:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],44:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],45:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],46:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],47:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Chapter"), exports);
__exportStar(require("./ChapterDetails"), exports);
__exportStar(require("./HomeSection"), exports);
__exportStar(require("./Manga"), exports);
__exportStar(require("./MangaTile"), exports);
__exportStar(require("./RequestObject"), exports);
__exportStar(require("./SearchRequest"), exports);
__exportStar(require("./TagSection"), exports);
__exportStar(require("./SourceTag"), exports);
__exportStar(require("./Languages"), exports);
__exportStar(require("./Constants"), exports);
__exportStar(require("./MangaUpdate"), exports);
__exportStar(require("./PagedResults"), exports);
__exportStar(require("./ResponseObject"), exports);
__exportStar(require("./RequestManager"), exports);
__exportStar(require("./RequestHeaders"), exports);
__exportStar(require("./SourceInfo"), exports);
__exportStar(require("./SourceStateManager"), exports);
__exportStar(require("./RequestInterceptor"), exports);
__exportStar(require("./DynamicUI"), exports);
__exportStar(require("./TrackedManga"), exports);
__exportStar(require("./SourceManga"), exports);
__exportStar(require("./TrackedMangaChapterReadAction"), exports);
__exportStar(require("./TrackerActionQueue"), exports);
__exportStar(require("./SearchField"), exports);
__exportStar(require("./RawData"), exports);

},{"./Chapter":6,"./ChapterDetails":7,"./Constants":8,"./DynamicUI":24,"./HomeSection":25,"./Languages":26,"./Manga":27,"./MangaTile":28,"./MangaUpdate":29,"./PagedResults":30,"./RawData":31,"./RequestHeaders":32,"./RequestInterceptor":33,"./RequestManager":34,"./RequestObject":35,"./ResponseObject":36,"./SearchField":37,"./SearchRequest":38,"./SourceInfo":39,"./SourceManga":40,"./SourceStateManager":41,"./SourceTag":42,"./TagSection":43,"./TrackedManga":44,"./TrackedMangaChapterReadAction":45,"./TrackerActionQueue":46}],48:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Japanread = exports.JapanreadInfo = void 0;
const paperback_extensions_common_1 = require("paperback-extensions-common");
const JapanreadParser_1 = require("./JapanreadParser");
const JAPANREAD_DOMAIN = "https://www.japanread.cc";
const SHADOWOFBABEL_DOMAIN = "http://192.168.1.43:3000";
const method = 'GET';
const headers = {
    'Host': 'www.japanread.cc',
};
exports.JapanreadInfo = {
    version: '1.0',
    name: 'Japanread',
    icon: 'logo.png',
    author: 'Moomooo95',
    authorWebsite: 'https://github.com/Moomooo95',
    description: 'Source française Japanread',
    contentRating: paperback_extensions_common_1.ContentRating.ADULT,
    websiteBaseURL: JAPANREAD_DOMAIN,
    sourceTags: [
        {
            text: "Francais",
            type: paperback_extensions_common_1.TagType.GREY
        },
        {
            text: 'Notifications',
            type: paperback_extensions_common_1.TagType.GREEN
        }
    ]
};
class Japanread extends paperback_extensions_common_1.Source {
    constructor() {
        super(...arguments);
        this.requestManager = createRequestManager({
            requestsPerSecond: 3,
            requestTimeout: 100000
        });
    }
    /////////////////////////////////
    /////    MANGA SHARE URL    /////
    /////////////////////////////////
    getMangaShareUrl(mangaId) {
        return `${JAPANREAD_DOMAIN}/manga/${mangaId}`;
    }
    ///////////////////////////////
    /////    MANGA DETAILS    /////
    ///////////////////////////////
    getMangaDetails(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${JAPANREAD_DOMAIN}/manga/${mangaId}`,
                method,
                headers
            });
            const response = yield this.requestManager.schedule(request, 1);
            const $ = this.cheerio.load(response.data);
            return yield JapanreadParser_1.parseJapanreadMangaDetails($, mangaId);
        });
    }
    //////////////////////////
    /////    CHAPTERS    /////
    //////////////////////////
    getChapters(mangaId) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return __awaiter(this, void 0, void 0, function* () {
            let request = createRequestObject({
                url: `${JAPANREAD_DOMAIN}/manga/${mangaId}`,
                method,
                headers
            });
            let response = yield this.requestManager.schedule(request, 1);
            let $ = this.cheerio.load(response.data);
            const page_max = Number($('.pagination .page-item .page-link').slice(-2, -1).text());
            const chapters = [];
            if (page_max == 0) {
                for (let chapter of $('#chapters div[data-row=chapter]').toArray()) {
                    const id = `https://www.japanread.cc${(_a = $('a', chapter).eq(0).attr('href')) !== null && _a !== void 0 ? _a : ''}`;
                    const name = $('a', chapter).eq(0).children().text().replace(/^ -/, '').trim() != '' ? $('a', chapter).eq(0).children().text().replace(/^ -/, '').trim() : undefined;
                    const chapNum = Number(((_c = ((_b = $('a', chapter).eq(0).attr('href')) !== null && _b !== void 0 ? _b : '').split('/').pop()) !== null && _c !== void 0 ? _c : '').replace(/-/g, '.'));
                    const volume = !isNaN(Number(((_d = $('a', chapter).eq(0).text().match(/^Vol.(\d) /gm)) !== null && _d !== void 0 ? _d : '.')[0].split('.')[1])) ? Number(((_e = $('a', chapter).eq(0).text().match(/^Vol.(\d) /gm)) !== null && _e !== void 0 ? _e : '.')[0].split('.')[1]) : undefined;
                    const time = JapanreadParser_1.parseDate($('a', chapter).eq(0).parent().next().next().clone().children().remove().end().text().trim().replace(/-/g, '.'));
                    chapters.push(createChapter({
                        id,
                        mangaId,
                        name,
                        langCode: paperback_extensions_common_1.LanguageCode.FRENCH,
                        chapNum,
                        volume,
                        time
                    }));
                }
            }
            else {
                for (var page = 1; page <= page_max; page++) {
                    let request = createRequestObject({
                        url: `${JAPANREAD_DOMAIN}/manga/${mangaId}?page=${page}`,
                        method,
                        headers
                    });
                    let response = yield this.requestManager.schedule(request, 1);
                    let $ = this.cheerio.load(response.data);
                    for (let chapter of $('#chapters div[data-row=chapter]').toArray()) {
                        const id = `https://www.japanread.cc${(_f = $('a', chapter).eq(0).attr('href')) !== null && _f !== void 0 ? _f : ''}`;
                        const name = $('a', chapter).eq(0).children().text().replace(/^ -/, '').trim() != '' ? $('a', chapter).eq(0).children().text().replace(/^ -/, '').trim() : undefined;
                        const chapNum = Number(((_h = ((_g = $('a', chapter).eq(0).attr('href')) !== null && _g !== void 0 ? _g : '').split('/').pop()) !== null && _h !== void 0 ? _h : '').replace(/-/g, '.'));
                        const volume = !isNaN(Number(((_j = $('a', chapter).eq(0).text().match(/^Vol.(\d) /gm)) !== null && _j !== void 0 ? _j : '.')[0].split('.')[1])) ? Number(((_k = $('a', chapter).eq(0).text().match(/^Vol.(\d) /gm)) !== null && _k !== void 0 ? _k : '.')[0].split('.')[1]) : undefined;
                        const time = JapanreadParser_1.parseDate($('a', chapter).eq(0).parent().next().next().clone().children().remove().end().text().trim().replace(/-/g, '.'));
                        chapters.push(createChapter({
                            id,
                            mangaId,
                            name,
                            langCode: paperback_extensions_common_1.LanguageCode.FRENCH,
                            chapNum,
                            volume,
                            time
                        }));
                    }
                }
            }
            return yield chapters;
        });
    }
    //////////////////////////////////
    /////    CHAPTERS DETAILS    /////
    //////////////////////////////////
    getChapterDetails(mangaId, chapterId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const request0 = createRequestObject({
                url: `${chapterId}`,
                method,
                headers
            });
            const response0 = yield this.requestManager.schedule(request0, 1);
            const $0 = this.cheerio.load(response0.data);
            const id = (_a = $0("meta[data-chapter-id]").attr("data-chapter-id")) !== null && _a !== void 0 ? _a : '';
            const request = createRequestObject({
                url: `${JAPANREAD_DOMAIN}/api/?id=${id}&type=chapter`,
                method,
                headers: {
                    'a': '1df19bce590b',
                    'Referer': chapterId,
                    'x-requested-with': 'XMLHttpRequest'
                }
            });
            const response = yield this.requestManager.schedule(request, 1);
            return yield JapanreadParser_1.parseJapanreadChapterDetails(response.data, mangaId, chapterId, id);
        });
    }
    ////////////////////////////////
    /////    SEARCH REQUEST    /////
    ////////////////////////////////
    getSearchResults(query, metadata) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const page = (_a = metadata === null || metadata === void 0 ? void 0 : metadata.page) !== null && _a !== void 0 ? _a : 1;
            const search = (_c = (_b = query.title) === null || _b === void 0 ? void 0 : _b.replace(/ /g, '+').replace(/[’'´]/g, '%27')) !== null && _c !== void 0 ? _c : "";
            let manga = [];
            if (query.includedTags && ((_d = query.includedTags) === null || _d === void 0 ? void 0 : _d.length) != 0) {
                const request = createRequestObject({
                    url: `${JAPANREAD_DOMAIN}/search?withCategories=${query.includedTags[0].id}&q=${search}&page=${page}`,
                    method,
                    headers
                });
                const response = yield this.requestManager.schedule(request, 1);
                const $ = this.cheerio.load(response.data);
                manga = JapanreadParser_1.parseSearch($);
                metadata = !JapanreadParser_1.isLastPage($) ? { page: page + 1 } : undefined;
            }
            else {
                const request = createRequestObject({
                    url: `${JAPANREAD_DOMAIN}/search?q=${search}&page=${page}`,
                    method,
                    headers
                });
                const response = yield this.requestManager.schedule(request, 1);
                const $ = this.cheerio.load(response.data);
                manga = JapanreadParser_1.parseSearch($);
                metadata = !JapanreadParser_1.isLastPage($) ? { page: page + 1 } : undefined;
            }
            return createPagedResults({
                results: manga,
                metadata
            });
        });
    }
    //////////////////////////////
    /////    HOME SECTION    /////
    //////////////////////////////
    getHomePageSections(sectionCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            const section1 = createHomeSection({ id: 'latest_updated_manga', title: 'Dernier Manga Sorti', view_more: true });
            const section2 = createHomeSection({ id: 'most_viewed_manga', title: 'Mangas les plus vus' });
            const section3 = createHomeSection({ id: 'top_rated_manga', title: 'Mangas les mieux notés' });
            const section4 = createHomeSection({ id: 'novelty_manga', title: 'Nouveautés' });
            const request = createRequestObject({
                url: `${JAPANREAD_DOMAIN}`,
                method: 'GET'
            });
            const response = yield this.requestManager.schedule(request, 1);
            const $ = this.cheerio.load(response.data);
            JapanreadParser_1.parseHomeSections($, [section1, section2, section3, section4], sectionCallback);
        });
    }
    /////////////////////////////////
    /////    VIEW MORE ITEMS    /////
    /////////////////////////////////
    getViewMoreItems(homepageSectionId, metadata) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const page = (_a = metadata === null || metadata === void 0 ? void 0 : metadata.page) !== null && _a !== void 0 ? _a : 1;
            let param = '';
            switch (homepageSectionId) {
                case 'latest_updated_manga':
                    param = `?page=${page}`;
                    break;
            }
            const request = createRequestObject({
                url: `${JAPANREAD_DOMAIN}/${param}`,
                method,
                headers
            });
            const response = yield this.requestManager.schedule(request, 1);
            const $ = this.cheerio.load(response.data);
            const manga = JapanreadParser_1.parseLatestUpdatedManga($);
            metadata = !JapanreadParser_1.isLastPage($) ? { page: page + 1 } : undefined;
            return createPagedResults({
                results: manga,
                metadata
            });
        });
    }
    //////////////////////
    /////    TAGS    /////
    //////////////////////
    getSearchTags() {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${JAPANREAD_DOMAIN}/manga-list`,
                method,
                headers
            });
            const response = yield this.requestManager.schedule(request, 1);
            const $ = this.cheerio.load(response.data);
            return JapanreadParser_1.parseTags($);
        });
    }
    //////////////////////////////////////
    /////    FILTER UPDATED MANGA    /////
    //////////////////////////////////////
    filterUpdatedManga(mangaUpdatesFoundCallback, time, ids) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${JAPANREAD_DOMAIN}`,
                method,
                headers
            });
            const response = yield this.requestManager.schedule(request, 1);
            const $ = this.cheerio.load(response.data);
            const updatedManga = [];
            for (const manga of $('.table-responsive tbody .manga').toArray()) {
                let id = `${JAPANREAD_DOMAIN}${$(manga).next().children('td').eq(1).children('.text-truncate').attr('href')}`;
                let mangaDate = new Date(((_a = $(manga).next().children('td').last().find('time').attr('datetime')) !== null && _a !== void 0 ? _a : '').replace(/ CET/g, ''));
                if (!id)
                    continue;
                if (mangaDate > time) {
                    if (ids.includes(id)) {
                        updatedManga.push(id);
                    }
                }
            }
            mangaUpdatesFoundCallback(createMangaUpdates({ ids: updatedManga }));
        });
    }
    getCloudflareBypassRequest() {
        return createRequestObject({
            url: `${JAPANREAD_DOMAIN}`,
            method,
            headers
        });
    }
}
exports.Japanread = Japanread;

},{"./JapanreadParser":49,"paperback-extensions-common":5}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDate = exports.isLastPage = exports.parseTags = exports.parseHomeSections = exports.parseLatestUpdatedManga = exports.parseSearch = exports.parseJapanreadChapterDetails = exports.parseJapanreadChapters = exports.parseJapanreadMangaDetails = void 0;
const paperback_extensions_common_1 = require("paperback-extensions-common");
const JAPANREAD_DOMAIN = "https://www.japanread.cc";
///////////////////////////////
/////    MANGA DETAILS    /////
///////////////////////////////
exports.parseJapanreadMangaDetails = ($, mangaId) => {
    var _a, _b, _c, _d, _e;
    const panel = $('.card.card-manga');
    const titles = [decodeHTMLEntity($('.card-header.h3').text().trim())];
    const image = (_a = $('.card.card-manga img', panel).first().attr('src')) !== null && _a !== void 0 ? _a : "";
    const author = (_b = $('div.font-weight-bold:contains("Auteur(s) :")', panel).next().text().trim()) !== null && _b !== void 0 ? _b : "Unknown";
    const artist = (_c = $('div.font-weight-bold:contains("Artiste(s) :")', panel).next().text().trim()) !== null && _c !== void 0 ? _c : "Unknown";
    const rating = Number($('div.font-weight-bold:contains("Note :")', panel).next().find('.js_avg').text().trim());
    const views = Number($('div.font-weight-bold:contains("Stats :")', panel).next().find('li').eq(0).text().trim().replace(/,/g, ''));
    const follows = Number($('div.font-weight-bold:contains("Stats :")', panel).next().find('li').eq(1).text().trim().replace(/,/g, ''));
    let hentai = false;
    let otherTitles = $('div.font-weight-bold:contains("Nom alternatif :")', panel).next().text().trim().split(';');
    for (let title of otherTitles) {
        titles.push(decodeHTMLEntity(title.trim()));
    }
    const arrayTags = [];
    const tags = $('div.font-weight-bold:contains("Catégories :")', panel).next().find('span').toArray();
    for (const tag of tags) {
        var label = $(tag).text();
        var id = (_e = (_d = $(tag).parent().attr('href')) === null || _d === void 0 ? void 0 : _d.split("=").pop()) !== null && _e !== void 0 ? _e : label;
        if (['Hentai'].includes(label) || ['Adulte'].includes(label)) {
            hentai = true;
        }
        arrayTags.push({ id: id, label: label });
    }
    const tagSections = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.length > 0 ? arrayTags.map(x => createTag(x)) : [] })];
    let status = paperback_extensions_common_1.MangaStatus.UNKNOWN;
    switch ($('div.font-weight-bold:contains("Statut :")', panel).next().text().trim()) {
        case "Terminé":
            status = paperback_extensions_common_1.MangaStatus.COMPLETED;
            break;
        case "En cours":
            status = paperback_extensions_common_1.MangaStatus.ONGOING;
            break;
    }
    let desc = decodeHTMLEntity($('div.font-weight-bold:contains("Description :")', panel).next().text().trim());
    return createManga({
        id: mangaId,
        titles,
        image,
        rating: Number(rating),
        status,
        artist,
        author,
        tags: tagSections,
        views,
        follows,
        desc,
        hentai
    });
};
//////////////////////////
/////    CHAPTERS    /////
//////////////////////////
exports.parseJapanreadChapters = ($, mangaId) => {
    var _a, _b, _c, _d, _e;
    const chapters = [];
    for (let chapter of $('#chapters div[data-row=chapter]').toArray()) {
        const id = `${JAPANREAD_DOMAIN}${(_a = $('a', chapter).eq(0).attr('href')) !== null && _a !== void 0 ? _a : ''}`;
        const name = $('a', chapter).eq(0).children().text().replace(/^ -/, '').trim() != '' ? $('a', chapter).eq(0).children().text().replace(/^ -/, '').trim() : undefined;
        const chapNum = Number(((_c = ((_b = $('a', chapter).eq(0).attr('href')) !== null && _b !== void 0 ? _b : '').split('/').pop()) !== null && _c !== void 0 ? _c : '').replace(/-/g, '.'));
        const volume = !isNaN(Number(((_d = $('a', chapter).eq(0).text().match(/^Vol.(\d) /gm)) !== null && _d !== void 0 ? _d : '.')[0].split('.')[1])) ? Number(((_e = $('a', chapter).eq(0).text().match(/^Vol.(\d) /gm)) !== null && _e !== void 0 ? _e : '.')[0].split('.')[1]) : undefined;
        const time = parseDate($('a', chapter).eq(0).parent().next().next().clone().children().remove().end().text().trim().replace(/-/g, '.'));
        chapters.push(createChapter({
            id,
            mangaId,
            name,
            langCode: paperback_extensions_common_1.LanguageCode.FRENCH,
            chapNum,
            volume,
            time
        }));
    }
    return chapters;
};
/////////////////////////////////
/////    CHAPTER DETAILS    /////
/////////////////////////////////
exports.parseJapanreadChapterDetails = (data, mangaId, chapterId, id) => {
    const pages = [];
    for (let item of JSON.parse(data).page_array) {
        let page = encodeURI(`${JAPANREAD_DOMAIN}/images/mangas/chapters/${id}/${item}`);
        if (typeof page === 'undefined')
            continue;
        pages.push(page);
    }
    return createChapterDetails({
        id: chapterId,
        mangaId: mangaId,
        pages,
        longStrip: false
    });
};
////////////////////////
/////    SEARCH    /////
////////////////////////
exports.parseSearch = ($) => {
    var _a, _b;
    const manga = [];
    for (const item of $('#manga-container div.col-lg-6').toArray()) {
        let url = ((_a = $('.text-truncate a', item).attr('href')) !== null && _a !== void 0 ? _a : '').split('/').pop();
        let image = (_b = $('.large_logo img', item).attr('src')) !== null && _b !== void 0 ? _b : '';
        let title = $('.text-truncate a', item).text().trim();
        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue;
        manga.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title })
        }));
    }
    return manga;
};
///////////////////////////////////////
/////    LASTEST UPDATED MANGA    /////
///////////////////////////////////////
exports.parseLatestUpdatedManga = ($) => {
    var _a, _b;
    const latestUpdatedManga = [];
    for (const item of $('.table-responsive tbody .manga').toArray()) {
        let url = (_a = $('.ellipsis a', item).attr('href')) === null || _a === void 0 ? void 0 : _a.split("/").pop();
        let image = (_b = $('.img-fluid', item).attr('src')) !== null && _b !== void 0 ? _b : '';
        let title = $('.ellipsis a', item).text().trim();
        let subtitle = $(item).next().children('td').eq(1).children('.text-truncate').text().trim();
        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue;
        latestUpdatedManga.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle }),
        }));
    }
    return latestUpdatedManga;
};
///////////////////////////////////
/////    MOST VIEWED MANGA    /////
///////////////////////////////////
const parseMostViewedManga = ($) => {
    var _a, _b;
    const mostViewedManga = [];
    for (const item of $('#nav-home li').toArray()) {
        let url = (_a = $('.text-truncate .font-weight-bold', item).attr('href')) === null || _a === void 0 ? void 0 : _a.split("/").pop();
        let image = ((_b = $('.tiny_logo img', item).attr('src')) !== null && _b !== void 0 ? _b : '').replace(/manga_small/g, 'manga_large');
        let title = $('.text-truncate .font-weight-bold', item).text().trim();
        let subtitle = "👀 " + $('.text-truncate .float-left', item).text().trim();
        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue;
        mostViewedManga.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle })
        }));
    }
    return mostViewedManga;
};
/////////////////////////////////
/////    TOP RATED MANGA    /////
/////////////////////////////////
const parseTopRatedManga = ($) => {
    var _a, _b;
    const topRatedManga = [];
    for (const item of $('#nav-profile li').toArray()) {
        let url = (_a = $('.text-truncate .font-weight-bold', item).attr('href')) === null || _a === void 0 ? void 0 : _a.split("/").pop();
        let image = ((_b = $('.tiny_logo img', item).attr('src')) !== null && _b !== void 0 ? _b : '').replace(/manga_small/g, 'manga_large');
        let title = $('.text-truncate .font-weight-bold', item).text().trim();
        let subtitle = "👀 " + $('.text-truncate .float-left', item).text().trim();
        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue;
        topRatedManga.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle })
        }));
    }
    return topRatedManga;
};
///////////////////////////////
/////    NOVELTY MANGA    /////
///////////////////////////////
const parseNoveltyManga = ($) => {
    var _a, _b;
    const noveltyManga = [];
    for (const item of $('.tab-content').eq(1).find('li').toArray()) {
        let url = (_a = $('.text-truncate .font-weight-bold', item).attr('href')) === null || _a === void 0 ? void 0 : _a.split("/").pop();
        let image = ((_b = $('.tiny_logo img', item).attr('src')) !== null && _b !== void 0 ? _b : '').replace(/manga_small/g, 'manga_large');
        let title = $('.text-truncate .font-weight-bold', item).text().trim();
        let subtitle = $('.text-truncate .float-left', item).text().trim();
        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue;
        noveltyManga.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle })
        }));
    }
    return noveltyManga;
};
//////////////////////////////
/////    HOME SECTION    /////
//////////////////////////////
exports.parseHomeSections = ($, sections, sectionCallback) => {
    for (const section of sections)
        sectionCallback(section);
    const latestUpdatedManga = exports.parseLatestUpdatedManga($);
    const mostViewedManga = parseMostViewedManga($);
    const topRatedManga = parseTopRatedManga($);
    const noveltyManga = parseNoveltyManga($);
    sections[0].items = latestUpdatedManga;
    sections[1].items = mostViewedManga;
    sections[2].items = topRatedManga;
    sections[3].items = noveltyManga;
    for (const section of sections)
        sectionCallback(section);
};
//////////////////////
/////    TAGS    /////
//////////////////////
exports.parseTags = ($) => {
    var _a, _b;
    const arrayTags = [];
    for (let item of $('.category_item').toArray()) {
        let id = (_a = $(item).attr('value')) !== null && _a !== void 0 ? _a : '';
        let label = capitalizeFirstLetter((_b = $(item).attr('id')) !== null && _b !== void 0 ? _b : '');
        arrayTags.push({ id: id, label: label });
    }
    const tagSections = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.map(x => createTag(x)) })];
    return tagSections;
};
/////////////////////////////////
/////    CHECK LAST PAGE    /////
/////////////////////////////////
exports.isLastPage = ($) => {
    return $('.pagination').length == 0 ? true : $('.pagination li').last().hasClass('disabled');
};
/////////////////////////////////
/////    ADDED FUNCTIONS    /////
/////////////////////////////////
function decodeHTMLEntity(str) {
    return str.replace(/&#(\d+);/g, function (match, dec) {
        return String.fromCharCode(dec);
    });
}
function parseDate(str) {
    if (str.length == 0) {
        return undefined;
    }
    let date = str.trim().split(' ');
    let date_today = new Date();
    switch (date[1].slice(0, 2)) {
        case "s":
            return new Date(date_today.getFullYear(), date_today.getMonth(), date_today.getDate(), date_today.getHours(), date_today.getMinutes(), date_today.getSeconds() - parseInt(date[0]));
        case "mi":
            return new Date(date_today.getFullYear(), date_today.getMonth(), date_today.getDate(), date_today.getHours(), date_today.getMinutes() - parseInt(date[0]));
        case "he":
            return new Date(date_today.getFullYear(), date_today.getMonth(), date_today.getDate(), date_today.getHours() - parseInt(date[0]));
        case "jo":
            return new Date(date_today.getFullYear(), date_today.getMonth(), date_today.getDate() - parseInt(date[0]));
        case "se":
            return new Date(date_today.getFullYear(), date_today.getMonth(), date_today.getDate() - (parseInt(date[0]) * 7));
        case "mo":
            return new Date(date_today.getFullYear(), date_today.getMonth() - parseInt(date[0]), date_today.getDate());
        case "an":
            return new Date(date_today.getFullYear() - parseInt(date[0]), date_today.getMonth(), date_today.getDate());
    }
    return date_today;
}
exports.parseDate = parseDate;
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

},{"paperback-extensions-common":5}]},{},[48])(48)
});
