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
exports.MangasOrigines = exports.MangasOriginesInfo = void 0;
const paperback_extensions_common_1 = require("paperback-extensions-common");
const MangasOriginesParser_1 = require("./MangasOriginesParser");
const MANGASORIGINES_DOMAIN = "https://mangas-origines.fr";
const method = 'GET';
const headers = {
    'Host': 'mangas-origines.fr'
};
exports.MangasOriginesInfo = {
    version: '1.7',
    name: 'MangasOrigines',
    icon: 'logo.png',
    author: 'Moomooo95',
    authorWebsite: 'https://github.com/Moomooo95',
    description: 'Source française MangasOrigines',
    contentRating: paperback_extensions_common_1.ContentRating.ADULT,
    websiteBaseURL: MANGASORIGINES_DOMAIN,
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
class MangasOrigines extends paperback_extensions_common_1.Source {
    constructor() {
        super(...arguments);
        this.requestManager = createRequestManager({
            requestsPerSecond: 3
        });
    }
    /////////////////////////////////
    /////    MANGA SHARE URL    /////
    /////////////////////////////////
    getMangaShareUrl(mangaId) {
        return `${MANGASORIGINES_DOMAIN}/catalogue/${mangaId}`;
    }
    ///////////////////////////////
    /////    MANGA DETAILS    /////
    ///////////////////////////////
    getMangaDetails(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${MANGASORIGINES_DOMAIN}/catalogue/${mangaId}`,
                method,
                headers
            });
            const response = yield this.requestManager.schedule(request, 1);
            const $ = this.cheerio.load(response.data);
            return yield MangasOriginesParser_1.parseMangasOriginesDetails($, mangaId);
        });
    }
    //////////////////////////
    /////    CHAPTERS    /////
    //////////////////////////
    getChapters(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${MANGASORIGINES_DOMAIN}/catalogue/${mangaId}/ajax/chapters/`,
                method: 'POST',
                headers
            });
            const response = yield this.requestManager.schedule(request, 1);
            const $ = this.cheerio.load(response.data);
            return yield MangasOriginesParser_1.parseMangasOriginesChapters($, mangaId);
        });
    }
    //////////////////////////////////
    /////    CHAPTERS DETAILS    /////
    //////////////////////////////////
    getChapterDetails(mangaId, chapterId) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${chapterId}`,
                method,
                headers
            });
            const response = yield this.requestManager.schedule(request, 1);
            const $ = this.cheerio.load(response.data);
            return yield MangasOriginesParser_1.parseMangasOriginesChapterDetails($, mangaId, chapterId);
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
                    url: `${MANGASORIGINES_DOMAIN}/?s=${search}&post_type=wp-manga&genre%5B0%5D=${query.includedTags[0].id}&paged=${page}`,
                    method: 'GET',
                    headers
                });
                const response = yield this.requestManager.schedule(request, 1);
                const $ = this.cheerio.load(response.data);
                manga = MangasOriginesParser_1.parseSearch($);
                metadata = !MangasOriginesParser_1.isLastPage($) ? { page: page + 1 } : undefined;
            }
            else {
                const request = createRequestObject({
                    url: `${MANGASORIGINES_DOMAIN}/?s=${search}&post_type=wp-manga&paged=${page}`,
                    method: 'GET',
                    headers
                });
                const response = yield this.requestManager.schedule(request, 1);
                const $ = this.cheerio.load(response.data);
                manga = MangasOriginesParser_1.parseSearch($);
                metadata = !MangasOriginesParser_1.isLastPage($) ? { page: page + 1 } : undefined;
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
            const section1 = createHomeSection({ id: 'hot_manga', title: '🔥 HOT 🔥', type: paperback_extensions_common_1.HomeSectionType.featured });
            const section2 = createHomeSection({ id: 'latest_updated', title: 'Dernières Mise à jour', view_more: true });
            const section3 = createHomeSection({ id: 'origins_exclusives', title: 'Exclusivités Origines' });
            const section4 = createHomeSection({ id: 'popular_today', title: 'TOP DU JOUR', view_more: true });
            const section5 = createHomeSection({ id: 'novelty', title: 'Nouveautés' });
            const request = createRequestObject({
                url: `${MANGASORIGINES_DOMAIN}`,
                method,
                headers
            });
            const response = yield this.requestManager.schedule(request, 1);
            const $ = this.cheerio.load(response.data);
            MangasOriginesParser_1.parseHomeSections($, [section1, section2, section3, section4, section5], sectionCallback);
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
                case 'popular_today':
                    param = `catalogue/?m_orderby=trending&page=${page}`;
                    break;
                case 'latest_updated':
                    param = `catalogue/?m_orderby=latest&page=${page}`;
                    break;
            }
            const request = createRequestObject({
                url: `${MANGASORIGINES_DOMAIN}/${param}`,
                method,
                headers
            });
            const response = yield this.requestManager.schedule(request, 1);
            const $ = this.cheerio.load(response.data);
            const manga = MangasOriginesParser_1.parseViewMore($);
            metadata = !MangasOriginesParser_1.isLastPage($) ? { page: page + 1 } : undefined;
            return createPagedResults({
                results: manga,
                metadata
            });
        });
    }
    //////////////////////////////////////
    /////    FILTER UPDATED MANGA    /////
    //////////////////////////////////////
    filterUpdatedManga(mangaUpdatesFoundCallback, time, ids) {
        return __awaiter(this, void 0, void 0, function* () {
            let page = 1;
            let updatedManga = {
                ids: [],
                loadMore: true
            };
            while (updatedManga.loadMore) {
                const request = createRequestObject({
                    url: `${MANGASORIGINES_DOMAIN}/catalogue/?m_orderby=latest&page=${page++}`,
                    method,
                    headers
                });
                const response = yield this.requestManager.schedule(request, 1);
                const $ = this.cheerio.load(response.data);
                updatedManga = MangasOriginesParser_1.parseUpdatedManga($, time, ids);
                if (updatedManga.ids.length > 0) {
                    mangaUpdatesFoundCallback(createMangaUpdates({
                        ids: updatedManga.ids
                    }));
                }
            }
        });
    }
    //////////////////////
    /////    TAGS    /////
    //////////////////////
    getSearchTags() {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${MANGASORIGINES_DOMAIN}/?s=&post_type=wp-manga`,
                method,
                headers
            });
            const response = yield this.requestManager.schedule(request, 1);
            const $ = this.cheerio.load(response.data);
            return MangasOriginesParser_1.parseTags($);
        });
    }
}
exports.MangasOrigines = MangasOrigines;

},{"./MangasOriginesParser":49,"paperback-extensions-common":5}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUpdatedManga = exports.parseTags = exports.isLastPage = exports.parseViewMore = exports.parseHomeSections = exports.parseSearch = exports.parseMangasOriginesChapterDetails = exports.parseMangasOriginesChapters = exports.parseMangasOriginesDetails = void 0;
const paperback_extensions_common_1 = require("paperback-extensions-common");
///////////////////////////////
/////    MANGA DETAILS    /////
///////////////////////////////
exports.parseMangasOriginesDetails = ($, mangaId) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const panel = $('.container .tab-summary');
    const titles = [decodeHTMLEntity($('.container .post-title h1').text().trim())];
    const image = $('img', panel).attr('data-src') == undefined ? encodeURI(((_a = $('img', panel).attr('src')) !== null && _a !== void 0 ? _a : "").trim().replace(/-[75]+x(\w)+/gm, '')) : encodeURI(((_b = $('img', panel).attr('data-src')) !== null && _b !== void 0 ? _b : "").trim().replace(/-[75]+x(\w)+/gm, ''));
    const author = (_c = $('.post-content_item .summary-heading:contains("Auteur(s)")', panel).next().text().trim()) !== null && _c !== void 0 ? _c : "Unknown";
    const artist = (_d = $('.post-content_item .summary-heading:contains("Artiste(s)")', panel).next().text().trim()) !== null && _d !== void 0 ? _d : "Unknown";
    const rating = Number($('.post-total-rating .score', panel).text().trim());
    const views = (_f = convertNbViews(((_e = $('.post-content_item .summary-heading:contains("Rang")', panel).next().text().trim().match(/(\d+\.?\d*\w?) /gm)) !== null && _e !== void 0 ? _e : '')[0].trim())) !== null && _f !== void 0 ? _f : undefined;
    let hentai = false;
    let otherTitles = $('.post-content_item .summary-heading:contains("Alternatif")', panel).next().text().trim().split(',');
    for (let title of otherTitles) {
        titles.push(decodeHTMLEntity(title.trim()));
    }
    const arrayTags = [];
    const tags = $('.post-content_item .summary-heading:contains("Genre(s)")', panel).next().find('a').toArray();
    for (const tag of tags) {
        const label = capitalizeFirstLetter(decodeHTMLEntity($(tag).text()));
        const id = (_h = (_g = $(tag).attr('href')) === null || _g === void 0 ? void 0 : _g.split("/")[4]) !== null && _h !== void 0 ? _h : label;
        if (['Adulte'].includes(label) || ['Hentai'].includes(label) || ['Sexe'].includes(label) || ['Uncensored'].includes(label)) {
            hentai = true;
        }
        arrayTags.push({ id: id, label: label });
    }
    const tagSections = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.length > 0 ? arrayTags.map(x => createTag(x)) : [] })];
    let status = paperback_extensions_common_1.MangaStatus.UNKNOWN;
    switch ($('.post-content_item .summary-heading:contains("STATUS")', panel).next().text().trim().slice(0, -2).trim()) {
        case "Terminé":
            status = paperback_extensions_common_1.MangaStatus.COMPLETED;
            break;
        case "En cours":
            status = paperback_extensions_common_1.MangaStatus.ONGOING;
            break;
    }
    const desc = decodeHTMLEntity($('.manga-excerpt', panel).text().trim());
    return createManga({
        id: mangaId,
        titles,
        image,
        author,
        artist,
        rating,
        status,
        tags: tagSections,
        views,
        desc,
        hentai
    });
};
///////////////////////////////
/////    CHAPTERS LIST    /////
///////////////////////////////
exports.parseMangasOriginesChapters = ($, mangaId) => {
    var _a, _b;
    const chapters = [];
    for (let chapter of $('.wp-manga-chapter').toArray()) {
        const id = (_a = $('a', chapter).first().attr('href') + "?style=list") !== null && _a !== void 0 ? _a : '';
        const name = undefined;
        const chapNum = Number(((_b = $('a', chapter).first().text().trim().match(/(\d+)(\.?)(\d*)/gm)) !== null && _b !== void 0 ? _b : '')[0]);
        const time = parseDate($('.chapter-release-date i', chapter).text());
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
exports.parseMangasOriginesChapterDetails = ($, mangaId, chapterId) => {
    const pages = [];
    for (let item of $('.container .reading-content img').toArray()) {
        let page = $(item).attr('src') == undefined ? encodeURI($(item).attr('data-src').trim()) : encodeURI($(item).attr('src').trim());
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
    var _a, _b, _c, _d, _e, _f, _g;
    const manga = [];
    for (const item of $('.row .c-tabs-item__content').toArray()) {
        const url = (_b = (_a = $('h3 a', item).attr('href')) === null || _a === void 0 ? void 0 : _a.split('/')[4]) !== null && _b !== void 0 ? _b : '';
        const title = (_c = $('h3 a', item).text()) !== null && _c !== void 0 ? _c : '';
        const image = $('img', item).attr('srcset') == undefined ? encodeURI(((_e = ((_d = $('img', item).attr('data-srcset')) !== null && _d !== void 0 ? _d : "").split(',').pop()) !== null && _e !== void 0 ? _e : "").trim().split(' ')[0].replace(/-[1,3](\w)+x(\w)+/gm, '')) : encodeURI(((_g = ((_f = $('img', item).attr('srcset')) !== null && _f !== void 0 ? _f : "").split(',').pop()) !== null && _g !== void 0 ? _g : "").trim().split(' ')[0].replace(/-[1,3](\w)+x(\w)+/gm, ''));
        const subtitle = decodeHTMLEntity($('.latest-chap .chapter a', item).text());
        manga.push(createMangaTile({
            id: url,
            image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle })
        }));
    }
    return manga;
};
///////////////////////////
/////    🔥 HOT 🔥    /////
///////////////////////////
const parseHotManga = ($) => {
    var _a, _b;
    const hotManga = [];
    for (const item of $('.container .manga-slider .slider__container .slider__item').toArray()) {
        let url = (_a = $('h4 a', item).attr('href')) === null || _a === void 0 ? void 0 : _a.split("/")[4];
        let image = encodeURI(((_b = $('img', item).attr('src')) !== null && _b !== void 0 ? _b : "").trim());
        let title = decodeHTMLEntity($('h4', item).text().trim());
        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue;
        hotManga.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title })
        }));
    }
    return hotManga;
};
////////////////////////////////
/////    LATEST UPDATED    /////
////////////////////////////////
const parseLatestUpdatedManga = ($) => {
    var _a, _b, _c, _d, _e;
    const latestUpdatedManga = [];
    for (const item of $('.page-content-listing.item-default .page-item-detail.manga').toArray()) {
        let url = (_a = $('h3 a', item).attr('href')) === null || _a === void 0 ? void 0 : _a.split("/")[4];
        let image = $('img', item).attr('srcset') == undefined ? encodeURI(((_c = ((_b = $('img', item).attr('data-srcset')) !== null && _b !== void 0 ? _b : "").split(',').pop()) !== null && _c !== void 0 ? _c : "").trim().split(' ')[0].replace(/-[1,3](\w)+x(\w)+/gm, '')) : encodeURI(((_e = ((_d = $('img', item).attr('srcset')) !== null && _d !== void 0 ? _d : "").split(',').pop()) !== null && _e !== void 0 ? _e : "").trim().split(' ')[0].replace(/-[1,3](\w)+x(\w)+/gm, ''));
        let title = decodeHTMLEntity($('h3 a', item).text().trim());
        let subtitle = decodeHTMLEntity($('.chapter-item .chapter.font-meta', item).eq(0).text().trim());
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
////////////////////////////////////
/////    ORIGINS EXCLUSIVES    /////
////////////////////////////////////
const parseOriginsExclusivesManga = ($) => {
    var _a, _b, _c, _d, _e;
    const popularOriginsExclusives = [];
    for (const item of $('#custom_html-5 .item').toArray()) {
        let url = (_a = $('h3 a', item).attr('href')) === null || _a === void 0 ? void 0 : _a.split("/")[4];
        let image = $('img', item).attr('srcset') == undefined ? encodeURI(((_c = ((_b = $('img', item).attr('data-srcset')) !== null && _b !== void 0 ? _b : "").split(',').pop()) !== null && _c !== void 0 ? _c : "").trim().split(' ')[0].replace(/-[1,3](\w)+x(\w)+/gm, '')) : encodeURI(((_e = ((_d = $('img', item).attr('srcset')) !== null && _d !== void 0 ? _d : "").split(',').pop()) !== null && _e !== void 0 ? _e : "").trim().split(' ')[0].replace(/-[1,3](\w)+x(\w)+/gm, ''));
        let title = $('h3 a', item).text().trim();
        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue;
        popularOriginsExclusives.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title })
        }));
    }
    return popularOriginsExclusives;
};
///////////////////////////////
/////    POPULAR TODAY    /////
///////////////////////////////
const parsePopularTodayManga = ($) => {
    var _a, _b, _c;
    const popularTodayManga = [];
    for (const item of $('.widget-content .popular-item-wrap').toArray()) {
        let url = (_a = $('h5 a', item).attr('href')) === null || _a === void 0 ? void 0 : _a.split("/")[4];
        let image = $('img', item).attr('data-src') == undefined ? encodeURI(((_b = $('img', item).attr('src')) !== null && _b !== void 0 ? _b : "").trim().replace(/-[75]+x(\w)+/gm, '')) : encodeURI(((_c = $('img', item).attr('data-src')) !== null && _c !== void 0 ? _c : "").trim().replace(/-[75]+x(\w)+/gm, ''));
        let title = decodeHTMLEntity($('h5 a', item).text().trim());
        let subtitle = decodeHTMLEntity($('.chapter-item .chapter.font-meta', item).eq(0).text().trim());
        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue;
        popularTodayManga.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle })
        }));
    }
    return popularTodayManga;
};
/////////////////////////
/////    NOVELTY    /////
/////////////////////////
const parseNoveltyManga = ($) => {
    var _a, _b, _c, _d, _e;
    const noveltyManga = [];
    for (const item of $('#manga-popular-slider-3 .slider__container .slider__item').toArray()) {
        let url = (_a = $('h4 a', item).attr('href')) === null || _a === void 0 ? void 0 : _a.split("/")[4];
        let image = $('img', item).attr('srcset') == undefined ? encodeURI(((_c = ((_b = $('img', item).attr('data-srcset')) !== null && _b !== void 0 ? _b : "").split(',').pop()) !== null && _c !== void 0 ? _c : "").trim().split(' ')[0].replace(/-[1,3](\w)+x(\w)+/gm, '')) : encodeURI(((_e = ((_d = $('img', item).attr('srcset')) !== null && _d !== void 0 ? _d : "").split(',').pop()) !== null && _e !== void 0 ? _e : "").trim().split(' ')[0].replace(/-[1,3](\w)+x(\w)+/gm, ''));
        let title = decodeHTMLEntity($('h4 a', item).text().trim());
        let subtitle = decodeHTMLEntity($('.chapter-item .chapter', item).eq(0).text().trim());
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
    const hotManga = parseHotManga($);
    const latestUpdatedManga = parseLatestUpdatedManga($);
    const originsExclusivesManga = parseOriginsExclusivesManga($);
    const popularTodayManga = parsePopularTodayManga($);
    const noveltyManga = parseNoveltyManga($);
    sections[0].items = hotManga;
    sections[1].items = latestUpdatedManga;
    sections[2].items = originsExclusivesManga;
    sections[3].items = popularTodayManga;
    sections[4].items = noveltyManga;
    for (const section of sections)
        sectionCallback(section);
};
///////////////////////////
/////    VIEW MORE    /////
///////////////////////////
exports.parseViewMore = ($) => {
    var _a, _b, _c, _d, _e;
    const viewMore = [];
    for (const item of $('.page-content-listing.item-default .page-item-detail.manga').toArray()) {
        let url = (_a = $('h3 a', item).attr('href')) === null || _a === void 0 ? void 0 : _a.split("/")[4];
        let image = $('img', item).attr('srcset') == undefined ? encodeURI(((_c = ((_b = $('img', item).attr('data-srcset')) !== null && _b !== void 0 ? _b : "").split(',').pop()) !== null && _c !== void 0 ? _c : "").trim().split(' ')[0].replace(/-[1,3](\w)+x(\w)+/gm, '')) : encodeURI(((_e = ((_d = $('img', item).attr('srcset')) !== null && _d !== void 0 ? _d : "").split(',').pop()) !== null && _e !== void 0 ? _e : "").trim().split(' ')[0].replace(/-[1,3](\w)+x(\w)+/gm, ''));
        let title = decodeHTMLEntity($('h3 a', item).text().trim());
        let subtitle = decodeHTMLEntity($('.chapter-item .chapter', item).eq(0).text().trim());
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
    return $('.error-404.not-found').length != 0;
};
//////////////////////
/////    TAGS    /////
//////////////////////
exports.parseTags = ($) => {
    var _a;
    const arrayTags = [];
    for (let item of $('.search-advanced-form .checkbox').toArray()) {
        let id = (_a = $('input', item).attr('value')) !== null && _a !== void 0 ? _a : '';
        let label = capitalizeFirstLetter(decodeHTMLEntity($('label', item).text().trim()));
        arrayTags.push({ id: id, label: label });
    }
    const tagSections = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.map(x => createTag(x)) })];
    return tagSections;
};
exports.parseUpdatedManga = ($, time, ids) => {
    var _a, _b;
    const manga = [];
    let loadMore = true;
    for (const item of $('.page-content-listing.item-default .page-item-detail.manga').toArray()) {
        let id = ((_a = $('h3 a', item).attr('href')) !== null && _a !== void 0 ? _a : '').split('/').slice(-2, -1)[0];
        let mangaTime = parseDate((_b = $('.post-on.font-meta', item).eq(0).find('a').attr('title')) !== null && _b !== void 0 ? _b : '');
        if (mangaTime > time)
            if (ids.includes(id))
                manga.push(id);
            else
                loadMore = false;
    }
    return {
        ids: manga,
        loadMore,
    };
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
    if (str.length == 0) {
        let date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
    if (/^(\d){1,2} (\D)+ (\d){4}$/.test(str)) {
        let date = str.split(' ');
        let year = date[2];
        let months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
        let month = months.findIndex((element) => element == date[1]).toString();
        let day = date[0];
        return new Date(parseInt(year), parseInt(month), parseInt(day));
    }
    else {
        let date = str.split(' ');
        let date_today = new Date();
        switch (date[1].slice(0, 2)) {
            case "s":
                return new Date(date_today.getFullYear(), date_today.getMonth(), date_today.getDate(), date_today.getHours(), date_today.getMinutes(), date_today.getSeconds() - parseInt(date[0]));
            case "mi":
                return new Date(date_today.getFullYear(), date_today.getMonth(), date_today.getDate(), date_today.getHours(), date_today.getMinutes() - parseInt(date[0]));
            case "he":
                return new Date(date_today.getFullYear(), date_today.getMonth(), date_today.getDate(), date_today.getHours() - parseInt(date[0]), date_today.getMinutes());
            case "jo":
                return new Date(date_today.getFullYear(), date_today.getMonth(), date_today.getDate() - parseInt(date[0]), date_today.getHours(), date_today.getMinutes());
            case "se":
                return new Date(date_today.getFullYear(), date_today.getMonth(), date_today.getDate() - (parseInt(date[0]) * 7), date_today.getHours(), date_today.getMinutes());
            case "mo":
                return new Date(date_today.getFullYear(), date_today.getMonth() - parseInt(date[0]), date_today.getDate(), date_today.getHours(), date_today.getMinutes());
            case "an":
                return new Date(date_today.getFullYear() - parseInt(date[0]), date_today.getMonth(), date_today.getDate(), date_today.getHours(), date_today.getMinutes());
        }
        return date_today;
    }
}
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
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

},{"paperback-extensions-common":5}]},{},[48])(48)
});