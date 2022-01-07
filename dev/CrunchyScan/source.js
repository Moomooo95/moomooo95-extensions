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
exports.CrunchyScan = exports.CrunchyScanInfo = void 0;
const paperback_extensions_common_1 = require("paperback-extensions-common");
const CrunchyScanParser_1 = require("./CrunchyScanParser");
const CRUNCHYSCAN_DOMAIN = "https://crunchyscan.fr";
const SHADOWOFBABEL_DOMAIN = "https://shadow-of-babel.herokuapp.com";
const method = 'GET';
const headers = {
    'Host': 'crunchyscan.fr',
};
const headers_search = {
    "Host": "crunchyscan.fr",
    "accept": "text/plain, */*; q=0.01",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "Content-Length": "275"
};
exports.CrunchyScanInfo = {
    version: '1.0',
    name: 'CrunchyScan',
    icon: 'logo.png',
    author: 'Moomooo95',
    authorWebsite: 'https://github.com/Moomooo95',
    description: 'Source française CrunchyScan',
    contentRating: paperback_extensions_common_1.ContentRating.ADULT,
    websiteBaseURL: CRUNCHYSCAN_DOMAIN,
    sourceTags: [
        {
            text: "Francais",
            type: paperback_extensions_common_1.TagType.GREY
        },
        {
            text: 'Notifications',
            type: paperback_extensions_common_1.TagType.GREEN
        },
        {
            text: 'Cloudflare',
            type: paperback_extensions_common_1.TagType.RED
        },
        {
            text: 'Slow',
            type: paperback_extensions_common_1.TagType.YELLOW
        }
    ]
};
class CrunchyScan extends paperback_extensions_common_1.Source {
    constructor() {
        super(...arguments);
        this.requestManager = createRequestManager({
            requestsPerSecond: 3,
            requestTimeout: 50000
        });
    }
    /////////////////////////////////
    /////    MANGA SHARE URL    /////
    /////////////////////////////////
    getMangaShareUrl(mangaId) {
        return `${CRUNCHYSCAN_DOMAIN}/liste-manga/${mangaId}`;
    }
    ///////////////////////////////
    /////    MANGA DETAILS    /////
    ///////////////////////////////
    getMangaDetails(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${CRUNCHYSCAN_DOMAIN}/liste-manga/${mangaId}`,
                method,
                headers
            });
            const response = yield this.requestManager.schedule(request, 1);
            this.CloudFlareError(response.status);
            const $ = this.cheerio.load(response.data);
            return yield CrunchyScanParser_1.parseCrunchyScanDetails($, mangaId);
        });
    }
    //////////////////////////
    /////    CHAPTERS    /////
    //////////////////////////
    getChapters(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${CRUNCHYSCAN_DOMAIN}/liste-manga/${mangaId}/ajax/chapters/`,
                method: 'POST',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "Host": "crunchyscan.fr",
                    "Origin": "https://crunchyscan.fr",
                    "Referer": "https://crunchyscan.fr/",
                    "X-Requested-With": "XMLHttpRequest"
                },
            });
            const response = yield this.requestManager.schedule(request, 1);
            this.CloudFlareError(response.status);
            const $ = this.cheerio.load(response.data);
            return yield CrunchyScanParser_1.parseCrunchyScanChapters($, mangaId);
        });
    }
    //////////////////////////////////
    /////    CHAPTERS DETAILS    /////
    //////////////////////////////////
    getChapterDetails(mangaId, chapterId) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${SHADOWOFBABEL_DOMAIN}/crunchyscan/chapters/${mangaId}/${chapterId.split('/').filter(Boolean).pop()}`,
                method
            });
            const response = yield this.requestManager.schedule(request, 1);
            return yield CrunchyScanParser_1.parseCrunchyScanChapterDetails(response.data, mangaId, chapterId);
        });
    }
    ////////////////////////////////
    /////    SEARCH REQUEST    /////
    ////////////////////////////////
    getSearchResults(query, metadata) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const page = (_a = metadata === null || metadata === void 0 ? void 0 : metadata.page) !== null && _a !== void 0 ? _a : 1;
            const search = (_c = (_b = query.title) === null || _b === void 0 ? void 0 : _b.replace(/ /g, '+').replace(/[’'´]/g, '%27')) !== null && _c !== void 0 ? _c : '';
            let manga = [];
            if (query.includedTags && ((_d = query.includedTags) === null || _d === void 0 ? void 0 : _d.length) != 0) {
                const request = createRequestObject({
                    url: `${CRUNCHYSCAN_DOMAIN}/archives/manga-genre/${query.includedTags[0].id}/page/${page}?s=${search}`,
                    method: 'GET',
                    headers
                });
                const response = yield this.requestManager.schedule(request, 1);
                this.CloudFlareError(response.status);
                const $ = this.cheerio.load(response.data);
                manga = CrunchyScanParser_1.parseViewMore($);
                metadata = !CrunchyScanParser_1.isLastPage($) ? { page: page + 1 } : undefined;
            }
            else {
                const request = createRequestObject({
                    url: `${CRUNCHYSCAN_DOMAIN}/wp-admin/admin-ajax.php`,
                    method: 'POST',
                    headers: headers_search,
                    data: `action=ajaxsearchpro_search&aspp=${encodeURI(search)}&asid=1&asp_inst_id=1_2&options=current_page_id%3D793%26qtranslate_lang%3D0%26filters_changed%3D0%26filters_initial%3D1%26asp_gen%255B%255D%3Dtitle%26asp_gen%255B%255D%3Dcontent%26asp_gen%255B%255D%3Dexcerpt%26customset%255B%255D%3Dwp-manga`
                });
                const response = yield this.requestManager.schedule(request, 1);
                this.CloudFlareError(response.status);
                const $ = this.cheerio.load(response.data);
                manga = CrunchyScanParser_1.parseSearch($);
                metadata = undefined;
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
            const section1 = createHomeSection({ id: 'latest_updated', title: 'Dernières Mise à jour', view_more: true });
            const section2 = createHomeSection({ id: 'most_viewed', title: 'Mangas avec le plus de vues' });
            const section3 = createHomeSection({ id: 'random_mangas', title: 'Mangas Aléatoires' });
            const request = createRequestObject({
                url: `${CRUNCHYSCAN_DOMAIN}`,
                method,
                headers
            });
            const response = yield this.requestManager.schedule(request, 1);
            this.CloudFlareError(response.status);
            const $ = this.cheerio.load(response.data);
            CrunchyScanParser_1.parseHomeSections($, [section1, section2, section3], sectionCallback);
        });
    }
    /////////////////////////////////
    /////    VIEW MORE ITEMS    /////
    /////////////////////////////////
    getViewMoreItems(homepageSectionId, metadata) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let page = (_a = metadata === null || metadata === void 0 ? void 0 : metadata.page) !== null && _a !== void 0 ? _a : 1;
            let param = '';
            switch (homepageSectionId) {
                case 'latest_updated':
                    param = `liste-manga/page/${page}?m_orderby=latest`;
                    break;
            }
            const request = createRequestObject({
                url: `${CRUNCHYSCAN_DOMAIN}/${param}`,
                method,
                headers
            });
            const response = yield this.requestManager.schedule(request, 1);
            this.CloudFlareError(response.status);
            const $ = this.cheerio.load(response.data);
            const manga = CrunchyScanParser_1.parseViewMore($);
            metadata = !CrunchyScanParser_1.isLastPage($) ? { page: page + 1 } : { page: page + 1 };
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
                url: `${CRUNCHYSCAN_DOMAIN}/liste-manga`,
                method,
                headers
            });
            const response = yield this.requestManager.schedule(request, 1);
            this.CloudFlareError(response.status);
            const $ = this.cheerio.load(response.data);
            return CrunchyScanParser_1.parseTags($);
        });
    }
    ///////////////////////////////////
    /////    CLOUDFLARE BYPASS    /////
    ///////////////////////////////////
    CloudFlareError(status) {
        if (status == 503) {
            throw new Error('CLOUDFLARE BYPASS ERROR:\nPlease go to Settings > Sources > \<\The name of this source\> and press Cloudflare Bypass');
        }
    }
    getCloudflareBypassRequest() {
        return createRequestObject({
            url: `${CRUNCHYSCAN_DOMAIN}/liste-manga/les-techniques-celestes-du-dieu-guerrier/chapitre-19/`,
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Host": "crunchyscan.fr",
                "Origin": "https://crunchyscan.fr",
                "Referer": "https://crunchyscan.fr/",
                "X-Requested-With": "XMLHttpRequest"
            },
            data: "g-recaptcha-response=03AGdBq271pcGFYFPqGn9sl29SDdx-i3YVeTOxUUdehMrYQaxE2kX4MYQz6KmmjwClAhgKDXIg17gi_4Pf0UR_kA8H_Ogc1Pjo5hIConU-NnkyNRKQN9v-O9euApCd0xVANXsY0c6Ca9LklrxCOi5ExqqN2I9ZwPR5XzRnSk6J79xK81AHiZo48KTx3dONWnuPHQa5wOKBCVMvkUST7ts9lBW_oIEDFha1XTr7WzLvlcYiSVyzoL590S8vqgRq_UKbkCHXzZnl-MBur3__CuaFhYERS_fJMeasPlkUJU2hgOJ5rBmuB_TeDHb5k-Z94a1fOlvjJyL2fyKMzY6JZZPRyokupaF9upCNbXr7ddSKC0jeLklIR6M6uIfzyyWVBHWk6UI-cB23z7dwKz40hvfxQR3R_vOSljaEUiPNEMPc92wYfTeA8sc8HJYB11DwnAnWjy0SgqFk5aIhhY7HYaySjGR18N_YRYDMO8Y3MLuKmMCig2f3yxE14UsLXx4X8LpTa32fKXTBQTPxqkgqiERQ-pbm_yQu0X731A&submitpost=Valider"
        });
    }
}
exports.CrunchyScan = CrunchyScan;

},{"./CrunchyScanParser":49,"paperback-extensions-common":5}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDate = exports.parseTags = exports.isLastPage = exports.parseViewMore = exports.parseHomeSections = exports.parseSearch = exports.parseCrunchyScanChapterDetails = exports.parseCrunchyScanChapters = exports.parseCrunchyScanDetails = void 0;
const paperback_extensions_common_1 = require("paperback-extensions-common");
///////////////////////////////
/////    MANGA DETAILS    /////
///////////////////////////////
exports.parseCrunchyScanDetails = ($, mangaId) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const panel = $('.container .tab-summary');
    const titles = [decodeHTMLEntity($('.container .post-title h1').text().trim())];
    const image = (_a = $('.summary_image img', panel).attr('data-src')) !== null && _a !== void 0 ? _a : "";
    const rating = Number($('.post-total-rating .score', panel).text().trim());
    const arrayTags = [];
    let author = (_b = $('.post-content_item:contains("Author(s)") .summary-content', panel).text().trim()) !== null && _b !== void 0 ? _b : "Unknown";
    let artist = (_c = $('.post-content_item:contains("Artist(s)") .summary-content', panel).text().trim()) !== null && _c !== void 0 ? _c : "Unknown";
    let hentai = false;
    let views = convertNbViews((_e = ((_d = $('.post-content_item:contains("Rank") .summary-content', panel).text().trim().match(/(\d+\.?\d*\w?) /gm)) !== null && _d !== void 0 ? _d : '')[0].trim()) !== null && _e !== void 0 ? _e : '');
    let otherTitles = $('.post-content_item:contains("Alternative") .summary-content', panel).text().trim().split('/');
    for (let title of otherTitles) {
        titles.push(decodeHTMLEntity(title.trim()));
    }
    const tags = $('.post-content_item:contains("Genre(s)") .summary-content a', panel).toArray();
    for (const tag of tags) {
        const label = $(tag).text();
        const id = (_g = (_f = $(tag).attr('href')) === null || _f === void 0 ? void 0 : _f.split("/").slice(-2, -1)[0]) !== null && _g !== void 0 ? _g : label;
        if (['Hentai'].includes(label) || ['Erotique'].includes(label) || ['Mature'].includes(label)) {
            hentai = true;
        }
        arrayTags.push({ id: id, label: label });
    }
    const tagSections = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.length > 0 ? arrayTags.map(x => createTag(x)) : [] })];
    let status = paperback_extensions_common_1.MangaStatus.UNKNOWN;
    switch ($('.post-content_item:contains("Status") .summary-content', panel).text().trim()) {
        case "Terminé":
            status = paperback_extensions_common_1.MangaStatus.COMPLETED;
            break;
        case "En cours":
            status = paperback_extensions_common_1.MangaStatus.ONGOING;
            break;
    }
    let summary = decodeHTMLEntity($('.container .summary__content').text().trim());
    return createManga({
        id: mangaId,
        titles,
        image,
        author,
        artist,
        rating,
        views,
        status,
        tags: tagSections,
        desc: summary,
        hentai
    });
};
///////////////////////////////
/////    CHAPTERS LIST    /////
///////////////////////////////
exports.parseCrunchyScanChapters = ($, mangaId) => {
    var _a, _b;
    const allChapters = $('.main .wp-manga-chapter');
    const chapters = [];
    for (let chapter of allChapters.toArray()) {
        const id = (_a = $('a', chapter).attr('href')) !== null && _a !== void 0 ? _a : '';
        const name = $('a', chapter).text().trim();
        const chapNum = Number(((_b = name.match(/(\d+)(\.?)(\d*)/gm)) !== null && _b !== void 0 ? _b : '')[0]);
        const time = new Date();
        chapters.push(createChapter({
            id,
            mangaId,
            name,
            langCode: paperback_extensions_common_1.LanguageCode.FRENCH,
            chapNum,
            time
        }));
    }
    return chapters;
};
//////////////////////////////////
/////    CHAPTERS DETAILS    /////
//////////////////////////////////
exports.parseCrunchyScanChapterDetails = (data, mangaId, chapterId) => {
    const pages = [];
    for (let item of JSON.parse(data)) {
        let page = encodeURI(item);
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
/////    Search    /////
////////////////////////
exports.parseSearch = ($) => {
    var _a, _b, _c, _d;
    const manga = [];
    for (const item of $('.item').toArray()) {
        const url = (_b = (_a = $('.asp_res_url', item).attr('href')) === null || _a === void 0 ? void 0 : _a.split('/').slice(-2, -1)[0]) !== null && _b !== void 0 ? _b : '';
        const title = (_c = $('.asp_res_url', item).text().trim()) !== null && _c !== void 0 ? _c : '';
        const image = (_d = $('.asp_image', item).attr("data-src")) !== null && _d !== void 0 ? _d : '';
        const subtitle = '';
        manga.push(createMangaTile({
            id: url,
            image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle })
        }));
    }
    return manga;
};
////////////////////////////////
/////    LATEST UPDATED    /////
////////////////////////////////
const parseLatestUpdatedManga = ($) => {
    var _a, _b;
    const latestUpdatedManga = [];
    for (const item of $('.page-content-listing.item-default .page-item-detail.manga').toArray()) {
        let url = (_a = $('h3 a', item).attr('href')) === null || _a === void 0 ? void 0 : _a.split("/").slice(-2, -1)[0];
        let image = ((_b = $('img', item).attr('data-src')) !== null && _b !== void 0 ? _b : "");
        let title = $('h3 a', item).text().trim();
        let subtitle = $('.chapter-item .chapter.font-meta', item).eq(0).text().trim();
        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue;
        latestUpdatedManga.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle })
        }));
    }
    return latestUpdatedManga;
};
/////////////////////////////
/////    MOST VIEWED    /////
/////////////////////////////
const parseMostViewedManga = ($) => {
    var _a, _b;
    const mostViewedManga = [];
    for (const item of $('.wrap #manga-slider-3 .slider__item').toArray()) {
        let url = (_a = $('h4 a', item).attr('href')) === null || _a === void 0 ? void 0 : _a.split("/").slice(-2, -1)[0];
        let image = ((_b = $('img', item).attr('src')) !== null && _b !== void 0 ? _b : "");
        let title = $('h4 a', item).text().trim();
        let subtitle = '';
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
///////////////////////////////
/////    RANDOM MANGAS    /////
///////////////////////////////
const parseRandomManga = ($) => {
    var _a, _b;
    const randomManga = [];
    for (const item of $('.wrap #manga-popular-slider-3 .slider__item').toArray()) {
        let url = (_a = $('h4 a', item).attr('href')) === null || _a === void 0 ? void 0 : _a.split("/").slice(-2, -1)[0];
        let image = ((_b = $('img', item).attr('src')) !== null && _b !== void 0 ? _b : "");
        let title = $('h4 a', item).text().trim();
        let subtitle = $('.chapter-item .chapter', item).eq(0).text().trim();
        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue;
        randomManga.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle })
        }));
    }
    return randomManga;
};
//////////////////////////////
/////    HOME SECTION    /////
//////////////////////////////
exports.parseHomeSections = ($, sections, sectionCallback) => {
    for (const section of sections)
        sectionCallback(section);
    const latestUpdatedManga = parseLatestUpdatedManga($);
    const mostViewedManga = parseMostViewedManga($);
    const randomManga = parseRandomManga($);
    sections[0].items = latestUpdatedManga;
    sections[1].items = mostViewedManga;
    sections[2].items = randomManga;
    for (const section of sections)
        sectionCallback(section);
};
///////////////////////////
/////    VIEW MORE    /////
///////////////////////////
exports.parseViewMore = ($) => {
    var _a;
    const viewMore = [];
    for (const item of $('.page-content-listing.item-default .page-item-detail.manga').toArray()) {
        let url = (_a = $('h3 a', item).attr('href')) === null || _a === void 0 ? void 0 : _a.split("/").pop();
        let image = $('img', item).attr('data-src');
        let title = $('h3 a', item).text().trim();
        let subtitle = $('.chapter-item .chapter', item).eq(0).text().trim();
        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue;
        viewMore.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle })
        }));
    }
    return viewMore;
};
/////////////////////////////////
/////    CHECK LAST PAGE    /////
/////////////////////////////////
exports.isLastPage = ($) => {
    return $('.page-content-listing.item-default .page-item-detail.manga').length == 0;
};
//////////////////////
/////    TAGS    /////
//////////////////////
exports.parseTags = ($) => {
    var _a, _b, _c;
    const arrayTags = [];
    for (let item of $('.row.genres li').toArray()) {
        let id = (_b = (_a = $('a', item).attr('href')) === null || _a === void 0 ? void 0 : _a.split('/').pop()) !== null && _b !== void 0 ? _b : '';
        let label = $('a', item).text().trim().replace(/(\s+)\([^()]+\)/gm, '');
        let nb_manga = ((_c = $('a', item).text().trim().match(/(\d+)/gm)) !== null && _c !== void 0 ? _c : "")[0];
        if (parseInt(nb_manga) > 0)
            arrayTags.push({ id: id, label: label });
    }
    const tagSections = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.map(x => createTag(x)) })];
    return tagSections;
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
    str = str.trim();
    if (str.length == 0)
        new Date();
    return new Date(str);
}
exports.parseDate = parseDate;
function convertNbViews(str) {
    var _a, _b;
    let views = undefined;
    let number = parseInt(((_a = str.match(/(\d+\.?\d?)/gm)) !== null && _a !== void 0 ? _a : "")[0]);
    let unit = ((_b = str.match(/[a-zA-Z]/gm)) !== null && _b !== void 0 ? _b : "")[0];
    switch (unit) {
        case "K":
            views = number * 1e3;
            break;
        case "M":
            views = number * 1e6;
            break;
        default:
            views = number;
            break;
    }
    return Number(views);
}

},{"paperback-extensions-common":5}]},{},[48])(48)
});
