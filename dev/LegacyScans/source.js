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
exports.LegacyScans = exports.LegacyScansInfo = void 0;
const paperback_extensions_common_1 = require("paperback-extensions-common");
const LegacyScansParser_1 = require("./LegacyScansParser");
const LEGACYSCANS_DOMAIN = "https://legacy-scans.com";
const method = 'GET';
const headers = {
    'Host': 'www.legacy-scans.com',
};
exports.LegacyScansInfo = {
    version: '1.0',
    name: 'LegacyScans',
    icon: 'logo.png',
    author: 'Moomooo95',
    authorWebsite: 'https://github.com/Moomooo95',
    description: 'Source française LegacyScans',
    contentRating: paperback_extensions_common_1.ContentRating.EVERYONE,
    websiteBaseURL: LEGACYSCANS_DOMAIN,
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
class LegacyScans extends paperback_extensions_common_1.Source {
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
        return `${LEGACYSCANS_DOMAIN}/manga/${mangaId}`;
    }
    ///////////////////////////////
    /////    MANGA DETAILS    /////
    ///////////////////////////////
    getMangaDetails(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${LEGACYSCANS_DOMAIN}/manga/${mangaId}`,
                method,
                headers
            });
            const response = yield this.requestManager.schedule(request, 1);
            const $ = this.cheerio.load(response.data);
            return yield LegacyScansParser_1.parseLegacyScansMangaDetails($, mangaId);
        });
    }
    //////////////////////////
    /////    CHAPTERS    /////
    //////////////////////////
    getChapters(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${LEGACYSCANS_DOMAIN}/manga/${mangaId}`,
                method,
                headers
            });
            const response = yield this.requestManager.schedule(request, 1);
            const $ = this.cheerio.load(response.data);
            return yield LegacyScansParser_1.parseLegacyScansChapters($, mangaId);
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
            return yield LegacyScansParser_1.parseLegacyScansChapterDetails($, mangaId, chapterId);
        });
    }
    ////////////////////////////////
    /////    SEARCH REQUEST    /////
    ////////////////////////////////
    getSearchResults(query, metadata) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const page = (_a = metadata === null || metadata === void 0 ? void 0 : metadata.page) !== null && _a !== void 0 ? _a : 1;
            const search = (_c = (_b = query.title) === null || _b === void 0 ? void 0 : _b.replace(/ /g, '+').replace(/[’'´]/g, '%27')) !== null && _c !== void 0 ? _c : "";
            let manga = [];
            const request = createRequestObject({
                url: `${LEGACYSCANS_DOMAIN}/?s=${search}`,
                method,
                headers
            });
            const response = yield this.requestManager.schedule(request, 1);
            const $ = this.cheerio.load(response.data);
            manga = LegacyScansParser_1.parseSearch($);
            metadata = !LegacyScansParser_1.isLastPage($) ? { page: page + 1 } : undefined;
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
            const section1 = createHomeSection({ id: 'latest_updates', title: 'Dernières sorties' });
            const section2 = createHomeSection({ id: 'popular_today', title: 'Populaires aujourd\'hui' });
            const section3 = createHomeSection({ id: 'popular_week', title: 'Populaires Semaine' });
            const section4 = createHomeSection({ id: 'popular_months', title: 'Populaires Mois' });
            const section5 = createHomeSection({ id: 'popular_all', title: 'Populaires Tous' });
            const request1 = createRequestObject({
                url: `${LEGACYSCANS_DOMAIN}`,
                method: 'GET'
            });
            const response1 = yield this.requestManager.schedule(request1, 1);
            const $1 = this.cheerio.load(response1.data);
            LegacyScansParser_1.parseHomeSections($1, [section1, section2, section3, section4, section5], sectionCallback);
        });
    }
    //////////////////////
    /////    TAGS    /////
    //////////////////////
    getSearchTags() {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${LEGACYSCANS_DOMAIN}/genres`,
                method,
                headers
            });
            const response = yield this.requestManager.schedule(request, 1);
            const $ = this.cheerio.load(response.data);
            return LegacyScansParser_1.parseTags($);
        });
    }
    //////////////////////////////////////
    /////    FILTER UPDATED MANGA    /////
    //////////////////////////////////////
    filterUpdatedManga(mangaUpdatesFoundCallback, time, ids) {
        return __awaiter(this, void 0, void 0, function* () {
            let updatedManga = {
                ids: [],
                loadMore: true
            };
            while (updatedManga.loadMore) {
                const request = createRequestObject({
                    url: `${LEGACYSCANS_DOMAIN}`,
                    method,
                    headers
                });
                const response = yield this.requestManager.schedule(request, 1);
                const $ = this.cheerio.load(response.data);
                updatedManga = LegacyScansParser_1.parseUpdatedManga($, time, ids);
                if (updatedManga.ids.length > 0) {
                    mangaUpdatesFoundCallback(createMangaUpdates({
                        ids: updatedManga.ids
                    }));
                }
            }
        });
    }
}
exports.LegacyScans = LegacyScans;

},{"./LegacyScansParser":49,"paperback-extensions-common":5}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUpdatedManga = exports.isLastPage = exports.parseTags = exports.parseHomeSections = exports.parseSearch = exports.parseLegacyScansChapterDetails = exports.parseLegacyScansChapters = exports.parseLegacyScansMangaDetails = void 0;
const paperback_extensions_common_1 = require("paperback-extensions-common");
///////////////////////////////
/////    MANGA DETAILS    /////
///////////////////////////////
exports.parseLegacyScansMangaDetails = ($, mangaId) => {
    var _a, _b, _c, _d, _e;
    const panell = $('.thumbook');
    const image = (_a = $('img', panell).attr('src')) !== null && _a !== void 0 ? _a : "";
    const follows = Number($('.bmc').text().trim().replace(/[^\d]/g, ""));
    const rating = Number($('.num').text().trim());
    let status = paperback_extensions_common_1.MangaStatus.UNKNOWN;
    switch ($('.thumbook .imptdt i').text().trim()) {
        case "Completed":
            status = paperback_extensions_common_1.MangaStatus.COMPLETED;
            break;
        case "Ongoing":
            status = paperback_extensions_common_1.MangaStatus.ONGOING;
            break;
    }
    const panelr = $('.infox');
    const titles = [decodeHTMLEntity($('.entry-title', panelr).text().trim())];
    const author = (_b = $('b:contains("Auteur")', panelr).next().text().trim()) !== null && _b !== void 0 ? _b : "Unknown";
    const artist = (_c = $('b:contains("Artiste")', panelr).next().text().trim()) !== null && _c !== void 0 ? _c : "Unknown";
    const lastUpdate = new Date($('b:contains("Mis à jour le")', panelr).next().text().trim());
    const arrayTags = [];
    // Tags 
    const tags = $('b:contains("Genre")', panelr).next().find('a').toArray();
    for (const tag of tags) {
        const id = (_e = (_d = $(tag).attr('href')) === null || _d === void 0 ? void 0 : _d.split("/").slice(-2, -1)[0]) !== null && _e !== void 0 ? _e : '';
        const label = capitalizeFirstLetter(decodeHTMLEntity($(tag).text()));
        arrayTags.push({ id: id, label: label });
    }
    const tagSections = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.length > 0 ? arrayTags.map(x => createTag(x)) : [] })];
    let desc = decodeHTMLEntity($('.entry-content-single', panelr).text());
    return createManga({
        id: mangaId,
        titles,
        image,
        author,
        artist,
        rating,
        follows,
        status,
        tags: tagSections,
        lastUpdate,
        desc,
        hentai: false
    });
};
//////////////////////////
/////    CHAPTERS    /////
//////////////////////////
exports.parseLegacyScansChapters = ($, mangaId) => {
    var _a;
    const chapters = [];
    for (let chapter of $('#chapterlist li').toArray()) {
        const id = (_a = $('a', chapter).attr('href')) !== null && _a !== void 0 ? _a : '';
        const name = decodeHTMLEntity($('.chapternum', chapter).text()) != "" ? decodeHTMLEntity($('.chapternum', chapter).text()) : undefined;
        const chapNum = Number($('.chapternum', chapter).text().split(' ')[1]);
        const time = new Date(parseDateChap($('.chapterdate', chapter).text().trim()));
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
/////////////////////////////////
/////    CHAPTER DETAILS    /////
/////////////////////////////////
exports.parseLegacyScansChapterDetails = ($, mangaId, chapterId) => {
    const pages = [];
    for (let page of JSON.parse($('.wrapper > script:nth-child(4)').text().slice(14, -2)).sources[0].images) {
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
    for (const item of $('.listupd .bsx').toArray()) {
        let url = (_a = $('a', item).attr('href')) === null || _a === void 0 ? void 0 : _a.split("/").slice(-2, -1)[0];
        let image = (_b = $('img', item).attr('src')) === null || _b === void 0 ? void 0 : _b.replace(/-(\d){2,}x(\d){2,}/gm, '');
        let title = decodeHTMLEntity($('.bigor .tt', item).text().trim());
        let subtitle = decodeHTMLEntity($('.bigor .adds .epxs', item).text().trim());
        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue;
        manga.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle }),
        }));
    }
    return manga;
};
////////////////////////////////
/////    LATEST UPDATES    /////
////////////////////////////////
const parseLatestUpdatesManga = ($) => {
    var _a, _b;
    const latestUpdatesManga = [];
    for (const item of $('.bixbox .listupd .utao.styletwo .uta').toArray()) {
        let url = (_a = $('a', item).attr('href')) === null || _a === void 0 ? void 0 : _a.split("/").slice(-2, -1)[0];
        let image = (_b = $('img', item).attr('src')) === null || _b === void 0 ? void 0 : _b.replace(/-(\d){2,}x(\d){2,}/gm, '');
        let title = decodeHTMLEntity($('.luf h4', item).text());
        let subtitle = decodeHTMLEntity($('.luf ul li', item).first().find("a").text());
        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue;
        latestUpdatesManga.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle }),
        }));
    }
    return latestUpdatesManga;
};
///////////////////////////////
/////    POPULAR TODAY    /////
///////////////////////////////
const parsePopularTodayManga = ($) => {
    var _a, _b;
    const popularTodayManga = [];
    for (const item of $('.bixbox.hothome .listupd .bsx').toArray()) {
        let url = (_a = $('a', item).attr('href')) === null || _a === void 0 ? void 0 : _a.split("/").slice(-2, -1)[0];
        let image = (_b = $('img', item).attr('src')) === null || _b === void 0 ? void 0 : _b.replace(/-(\d){2,}x(\d){2,}/gm, '');
        let title = decodeHTMLEntity($('.bigor .tt', item).text().trim());
        let subtitle = decodeHTMLEntity($('.bigor .adds .epxs', item).text().trim());
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
//////////////////////////////
/////    POPULAR WEEK    /////
//////////////////////////////
const parsePopularWeekManga = ($) => {
    var _a, _b;
    const popularWeekManga = [];
    for (const item of $('#sidebar .wpop-weekly li').toArray()) {
        let url = (_a = $('a', item).attr('href')) === null || _a === void 0 ? void 0 : _a.split("/").slice(-2, -1)[0];
        let image = (_b = $('img', item).attr('src')) === null || _b === void 0 ? void 0 : _b.replace(/-(\d){2,}x(\d){2,}/gm, '');
        let title = decodeHTMLEntity($('.leftseries h2', item).text().trim());
        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue;
        popularWeekManga.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title })
        }));
    }
    return popularWeekManga;
};
////////////////////////////////
/////    POPULAR MONTHS    /////
////////////////////////////////
const parsePopularMonthManga = ($) => {
    var _a, _b;
    const popularMonthsManga = [];
    for (const item of $('#sidebar .wpop-monthly li').toArray()) {
        let url = (_a = $('a', item).attr('href')) === null || _a === void 0 ? void 0 : _a.split("/").slice(-2, -1)[0];
        let image = (_b = $('img', item).attr('src')) === null || _b === void 0 ? void 0 : _b.replace(/-(\d){2,}x(\d){2,}/gm, '');
        let title = decodeHTMLEntity($('.leftseries h2', item).text().trim());
        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue;
        popularMonthsManga.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title })
        }));
    }
    return popularMonthsManga;
};
/////////////////////////////
/////    POPULAR ALL    /////
/////////////////////////////
const parsePopularAllManga = ($) => {
    var _a, _b;
    const popularAllManga = [];
    for (const item of $('#sidebar .wpop-alltime li').toArray()) {
        let url = (_a = $('a', item).attr('href')) === null || _a === void 0 ? void 0 : _a.split("/").slice(-2, -1)[0];
        let image = (_b = $('img', item).attr('src')) === null || _b === void 0 ? void 0 : _b.replace(/-(\d){2,}x(\d){2,}/gm, '');
        let title = decodeHTMLEntity($('.leftseries h2', item).text().trim());
        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue;
        popularAllManga.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title })
        }));
    }
    return popularAllManga;
};
//////////////////////////////
/////    HOME SECTION    /////
//////////////////////////////
exports.parseHomeSections = ($, sections, sectionCallback) => {
    for (const section of sections)
        sectionCallback(section);
    const latestUpdatesManga = parseLatestUpdatesManga($);
    const popularTodayManga = parsePopularTodayManga($);
    const popularWeekManga = parsePopularWeekManga($);
    const popularMonthManga = parsePopularMonthManga($);
    const popularAllManga = parsePopularAllManga($);
    sections[0].items = latestUpdatesManga;
    sections[1].items = popularTodayManga;
    sections[2].items = popularWeekManga;
    sections[3].items = popularMonthManga;
    sections[4].items = popularAllManga;
    for (const section of sections)
        sectionCallback(section);
};
//////////////////////
/////    TAGS    /////
//////////////////////
exports.parseTags = ($) => {
    var _a, _b, _c;
    const arrayTags = [];
    for (var item of $('.taxindex li').toArray()) {
        let id = (_b = (_a = $('a', item).attr('href')) === null || _a === void 0 ? void 0 : _a.split('/').slice(-2, -1)[0]) !== null && _b !== void 0 ? _b : '';
        let label = (_c = capitalizeFirstLetter(decodeHTMLEntity($('span', item).text()))) !== null && _c !== void 0 ? _c : '';
        arrayTags.push({ id: id, label: label });
    }
    const tagSections = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.map(x => createTag(x)) })];
    return tagSections;
};
/////////////////////////////////
/////    CHECK LAST PAGE    /////
/////////////////////////////////
exports.isLastPage = ($) => {
    return $('.hpage .r').length == 0;
};
exports.parseUpdatedManga = ($, time, ids) => {
    var _a, _b, _c, _d;
    const manga = [];
    let loadMore = true;
    for (const item of $('.bixbox .listupd .utao.styletwo .uta').toArray()) {
        let id = (_b = (_a = $('a', item).attr('href')) === null || _a === void 0 ? void 0 : _a.split("/").slice(-2, -1)[0]) !== null && _b !== void 0 ? _b : '';
        let mangaTime = parseDate(decodeHTMLEntity((_d = ((_c = $('.luf ul li', item).first().find("span").text()) !== null && _c !== void 0 ? _c : '').trim().split('Il y a ')[1]) !== null && _d !== void 0 ? _d : ""));
        if (mangaTime != null && mangaTime > time)
            if (ids.includes(id))
                manga.push(id);
            else
                loadMore = false;
    }
    return {
        ids: manga,
        loadMore
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
function parseDateChap(str) {
    str = str.trim();
    if (str.length == 0) {
        let date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
    var month = str.split(' ')[0];
    switch (month) {
        case "janvier":
            return str.replace(month, "january");
        case "février":
            return str.replace(month, "february");
        case "mars":
            return str.replace(month, "march");
        case "avril":
            return str.replace(month, "april");
        case "mai":
            return str.replace(month, "may");
        case "juin":
            return str.replace(month, "june");
        case "juillet":
            return str.replace(month, "july");
        case "août":
            return str.replace(month, "august");
        case "septembre":
            return str.replace(month, "september");
        case "octobre":
            return str.replace(month, "october");
        case "novembre":
            return str.replace(month, "november");
        case "décembre":
            return str.replace(month, "december");
        default:
            return new Date();
    }
}
function parseDate(str) {
    str = str.trim();
    if (str.length == 0) {
        return null;
    }
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
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

},{"paperback-extensions-common":5}]},{},[48])(48)
});
