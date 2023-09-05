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
exports.LelscanVF = exports.LelscanVFInfo = void 0;
const paperback_extensions_common_1 = require("paperback-extensions-common");
const LelscanVFParser_1 = require("./LelscanVFParser");
const LELSCANVF_DOMAIN = "https://lelscanvf.cc/";
const method = 'GET';
const headers = {
    'Host': 'www.lelscanvf.com',
};
exports.LelscanVFInfo = {
    version: '1.0.0',
    name: 'LelscanVF',
    icon: 'logo.png',
    author: 'Moomooo95',
    authorWebsite: 'https://github.com/Moomooo95',
    description: 'Source française LELSCANVF',
    contentRating: paperback_extensions_common_1.ContentRating.EVERYONE,
    websiteBaseURL: LELSCANVF_DOMAIN,
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
class LelscanVF extends paperback_extensions_common_1.Source {
    constructor() {
        super(...arguments);
        this.requestManager = createRequestManager({
            requestsPerSecond: 3,
            interceptor: {
                interceptRequest: (request) => __awaiter(this, void 0, void 0, function* () {
                    request.headers = {
                        'Referer': LELSCANVF_DOMAIN
                    };
                    return request;
                }),
                interceptResponse: (response) => __awaiter(this, void 0, void 0, function* () {
                    return response;
                })
            }
        });
    }
    /////////////////////////////////
    /////    MANGA SHARE URL    /////
    /////////////////////////////////
    getMangaShareUrl(mangaId) {
        return `${LELSCANVF_DOMAIN}/manga/${mangaId}`;
    }
    ///////////////////////////////
    /////    MANGA DETAILS    /////
    ///////////////////////////////
    getMangaDetails(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${LELSCANVF_DOMAIN}/manga/${mangaId}`,
                method,
                headers
            });
            const response = yield this.requestManager.schedule(request, 1);
            const $ = this.cheerio.load(response.data);
            return yield LelscanVFParser_1.parseLelscanVFMangaDetails($, mangaId);
        });
    }
    //////////////////////////
    /////    CHAPTERS    /////
    //////////////////////////
    getChapters(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${LELSCANVF_DOMAIN}/manga/${mangaId}`,
                method,
                headers
            });
            const response = yield this.requestManager.schedule(request, 1);
            const $ = this.cheerio.load(response.data);
            return yield LelscanVFParser_1.parseLelscanVFChapters($, mangaId);
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
            return yield LelscanVFParser_1.parseLelscanVFChapterDetails($, mangaId, chapterId);
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
            let url = `${LELSCANVF_DOMAIN}/filterList?sortBy=name&asc=true&alpha=${search}&page=${page}`;
            if (query.includedTags && ((_d = query.includedTags) === null || _d === void 0 ? void 0 : _d.length) != 0) {
                url += `&tag=${query.includedTags[0].id}`;
            }
            const request = createRequestObject({
                url,
                method,
                headers
            });
            const response = yield this.requestManager.schedule(request, 1);
            const $ = this.cheerio.load(response.data);
            manga = LelscanVFParser_1.parseSearch($);
            metadata = !LelscanVFParser_1.isLastPage($) ? { page: page + 1 } : undefined;
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
            const section1 = createHomeSection({ id: 'latest_updates', title: 'Dernier Manga Sorti' });
            const section2 = createHomeSection({ id: 'popular_manga', title: 'Manga Populaire' });
            const section3 = createHomeSection({ id: 'top_manga', title: 'Top Manga' });
            const request1 = createRequestObject({
                url: `${LELSCANVF_DOMAIN}`,
                method: 'GET'
            });
            const request2 = createRequestObject({
                url: `${LELSCANVF_DOMAIN}/topManga`,
                method: 'GET'
            });
            const response1 = yield this.requestManager.schedule(request1, 1);
            const $1 = this.cheerio.load(response1.data);
            const response2 = yield this.requestManager.schedule(request2, 1);
            const $2 = this.cheerio.load(response2.data);
            LelscanVFParser_1.parseHomeSections($1, [section1, section2], sectionCallback);
            LelscanVFParser_1.parseMangaSectionOthers($2, [section3], sectionCallback);
        });
    }
    //////////////////////
    /////    TAGS    /////
    //////////////////////
    getTags() {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${LELSCANVF_DOMAIN}/manga-list`,
                method,
                headers
            });
            const response = yield this.requestManager.schedule(request, 1);
            const $ = this.cheerio.load(response.data);
            return LelscanVFParser_1.parseTags($);
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
                    url: `${LELSCANVF_DOMAIN}`,
                    method,
                    headers
                });
                const response = yield this.requestManager.schedule(request, 1);
                const $ = this.cheerio.load(response.data);
                updatedManga = LelscanVFParser_1.parseUpdatedManga($, time, ids);
                if (updatedManga.ids.length > 0) {
                    mangaUpdatesFoundCallback(createMangaUpdates({
                        ids: updatedManga.ids
                    }));
                }
            }
        });
    }
}
exports.LelscanVF = LelscanVF;

},{"./LelscanVFParser":49,"paperback-extensions-common":5}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDate = exports.parseUpdatedManga = exports.isLastPage = exports.parseTags = exports.parseMangaSectionOthers = exports.parseHomeSections = exports.parseSearch = exports.parseLelscanVFChapterDetails = exports.parseLelscanVFChapters = exports.parseLelscanVFMangaDetails = void 0;
const paperback_extensions_common_1 = require("paperback-extensions-common");
const LELSCANVF_DOMAIN = "https://lelscanvf.cc/";
///////////////////////////////
/////    MANGA DETAILS    /////
///////////////////////////////
const parseLelscanVFMangaDetails = ($, mangaId) => {
    var _a, _b;
    const panel = $('.dl-horizontal');
    const titles = [decodeHTMLEntity($('.widget-title').first().text().trim())];
    const image = `${LELSCANVF_DOMAIN}/uploads/manga/${mangaId}/cover/cover_250x350.jpg`;
    const author = $('a[href*=author]').text().trim();
    const artist = $('a[href*=artist]').text().trim();
    const rating = (_a = Number($('#item-rating').attr('data-score'))) !== null && _a !== void 0 ? _a : '';
    const views = Number($('dt:contains("Vues")', panel).next().text().trim());
    let othersTitles = $('dt:contains("Autres noms")', panel).next().text().trim().split(',');
    for (let title of othersTitles) {
        titles.push(decodeHTMLEntity(title.trim()));
    }
    let status = paperback_extensions_common_1.MangaStatus.UNKNOWN;
    switch ($('dt:contains("Statut")', panel).next().text().trim()) {
        case "Ongoing":
            status = paperback_extensions_common_1.MangaStatus.ONGOING;
            break;
        case "Complete":
            status = paperback_extensions_common_1.MangaStatus.COMPLETED;
            break;
    }
    const arrayTags = [];
    const tags = $('a[href*=tag]').toArray();
    for (const tag of tags) {
        const label = $(tag).text();
        const id = (_b = $(tag).attr('href')) === null || _b === void 0 ? void 0 : _b.split('/').pop();
        if (typeof id === 'undefined')
            continue;
        arrayTags.push({ id, label });
    }
    const tagSections = [
        createTagSection({ id: '0', label: 'tags', tags: arrayTags.length > 0 ? arrayTags.map(x => createTag(x)) : [] }),
    ];
    const desc = decodeHTMLEntity($('.well p').text().trim());
    return createManga({
        id: mangaId,
        titles,
        image,
        rating,
        status,
        artist,
        author,
        tags: tagSections,
        views,
        desc,
        hentai: false
    });
};
exports.parseLelscanVFMangaDetails = parseLelscanVFMangaDetails;
//////////////////////////
/////    CHAPTERS    /////
//////////////////////////
const parseLelscanVFChapters = ($, mangaId) => {
    var _a, _b, _c;
    const chapters = [];
    for (let chapter of $('.chapters li:not(.volume)').toArray()) {
        const id = (_a = $('a', chapter).attr('href')) !== null && _a !== void 0 ? _a : '';
        const name = (_b = decodeHTMLEntity($('em', chapter).text().trim())) !== null && _b !== void 0 ? _b : undefined;
        const chapNum = Number(id.split('/').pop());
        const time = new Date((_c = $('.date-chapter-title-rtl', chapter).text().replace('.', ',')) !== null && _c !== void 0 ? _c : undefined);
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
exports.parseLelscanVFChapters = parseLelscanVFChapters;
/////////////////////////////////
/////    CHAPTER DETAILS    /////
/////////////////////////////////
const parseLelscanVFChapterDetails = ($, mangaId, chapterId) => {
    var _a, _b, _c;
    const pages = [];
    for (let item of $('#all img').toArray()) {
        let page = ((_a = $(item).attr('data-src')) === null || _a === void 0 ? void 0 : _a.trim().split("/")[0]) == "https:" ? (_b = $(item).attr('data-src')) === null || _b === void 0 ? void 0 : _b.trim() : 'https:' + ((_c = $(item).attr('data-src')) === null || _c === void 0 ? void 0 : _c.trim());
        if (typeof page === 'undefined')
            continue;
        pages.push(page);
    }
    return createChapterDetails({
        id: chapterId,
        mangaId,
        pages,
        longStrip: false
    });
};
exports.parseLelscanVFChapterDetails = parseLelscanVFChapterDetails;
///////////////////////
/////    SEARCH   /////
///////////////////////
const parseSearch = ($) => {
    var _a, _b;
    const manga = [];
    for (const item of $('.media').toArray()) {
        let id = (_a = $('h5 a', item).attr('href')) === null || _a === void 0 ? void 0 : _a.split("/")[4];
        let image = `${LELSCANVF_DOMAIN}/uploads/manga/${id}/cover/cover_250x350.jpg`;
        let title = decodeHTMLEntity($('h5', item).text());
        let subtitle = `Chapitre ${(_b = $('a', item).eq(2).attr('href')) === null || _b === void 0 ? void 0 : _b.split('/').pop()}`;
        if (typeof id === 'undefined')
            continue;
        manga.push(createMangaTile({
            id,
            image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle })
        }));
    }
    return manga;
};
exports.parseSearch = parseSearch;
//////////////////////////////////////
/////    LAST MANGAS RELEASED    /////
//////////////////////////////////////
const parseLatestManga = ($) => {
    var _a, _b;
    const latestManga = [];
    for (const item of $('.mangalist .manga-item').toArray()) {
        let id = (_a = $('h3 a', item).attr('href')) === null || _a === void 0 ? void 0 : _a.split("/")[4];
        let image = `${LELSCANVF_DOMAIN}/uploads/manga/${id}/cover/cover_250x350.jpg`;
        let title = decodeHTMLEntity($('h3 a', item).text());
        let subtitle = `Chapitre ${(_b = $('h6 a', item).attr('href')) === null || _b === void 0 ? void 0 : _b.split('/').pop()}`;
        if (typeof id === 'undefined')
            continue;
        latestManga.push(createMangaTile({
            id,
            image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle })
        }));
    }
    return latestManga;
};
////////////////////////////////
/////    POPULAR MANGAS    /////
////////////////////////////////
const parsePopularManga = ($) => {
    var _a, _b;
    const popularManga = [];
    for (const item of $('.hot-thumbnails li').toArray()) {
        let id = (_a = $('.manga-name a', item).attr('href')) === null || _a === void 0 ? void 0 : _a.split("/")[4];
        let image = `${LELSCANVF_DOMAIN}/uploads/manga/${id}/cover/cover_250x350.jpg`;
        let title = decodeHTMLEntity($('.manga-name a', item).text());
        let subtitle = `Chapitre ${(_b = $('.thumbnail', item).attr('href')) === null || _b === void 0 ? void 0 : _b.split('/').pop()}`;
        if (typeof id === 'undefined')
            continue;
        popularManga.push(createMangaTile({
            id,
            image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle })
        }));
    }
    return popularManga;
};
///////////////////////////
/////    TOP MANGA    /////
///////////////////////////
const parseTopManga = ($) => {
    var _a, _b;
    const topManga = [];
    for (const item of $('li').toArray()) {
        let id = (_a = $('.media-left a', item).attr('href')) === null || _a === void 0 ? void 0 : _a.split("/")[4];
        let image = `${LELSCANVF_DOMAIN}/uploads/manga/${id}/cover/cover_250x350.jpg`;
        let title = decodeHTMLEntity($('h5 strong', item).text());
        let subtitle = `Chapitre ${(_b = $('.media-body>a', item).attr('href')) === null || _b === void 0 ? void 0 : _b.split('/').pop()}`;
        if (typeof id === 'undefined')
            continue;
        topManga.push(createMangaTile({
            id,
            image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle })
        }));
    }
    return topManga;
};
//////////////////////////////
/////    HOME SECTION    /////
//////////////////////////////
const parseHomeSections = ($, sections, sectionCallback) => {
    for (const section of sections)
        sectionCallback(section);
    sections[0].items = parseLatestManga($);
    sections[1].items = parsePopularManga($);
    for (const section of sections)
        sectionCallback(section);
};
exports.parseHomeSections = parseHomeSections;
//////////////////////////////////
/////    HOME SECTION TWO    /////
//////////////////////////////////
const parseMangaSectionOthers = ($, sections, sectionCallback) => {
    for (const section of sections)
        sectionCallback(section);
    sections[0].items = parseTopManga($);
    for (const section of sections)
        sectionCallback(section);
};
exports.parseMangaSectionOthers = parseMangaSectionOthers;
//////////////////////
/////    TAGS    /////
//////////////////////
const parseTags = ($) => {
    var _a;
    const arrayTags = [];
    for (let item of $('.tag-links a').toArray()) {
        let id = (_a = $(item).attr('href')) === null || _a === void 0 ? void 0 : _a.split('/').pop();
        let label = $(item).text();
        if (typeof id === 'undefined')
            continue;
        arrayTags.push({ id, label });
    }
    const tagSections = [
        createTagSection({ id: '0', label: 'tags', tags: arrayTags.map(x => createTag(x)) })
    ];
    return tagSections;
};
exports.parseTags = parseTags;
/////////////////////////////////
/////    CHECK LAST PAGE    /////
/////////////////////////////////
const isLastPage = ($) => {
    return $('.pagination li').last().hasClass('disabled');
};
exports.isLastPage = isLastPage;
const parseUpdatedManga = ($, time, ids) => {
    var _a, _b;
    let loadMore = true;
    const updatedManga = [];
    for (const manga of $('.mangalist .manga-item').toArray()) {
        let id = (_a = $('a', manga).first().attr('href')) === null || _a === void 0 ? void 0 : _a.split('/')[4];
        let date = parseDate((_b = $('.pull-right', manga).text().trim()) !== null && _b !== void 0 ? _b : '');
        if (typeof id === 'undefined' || typeof date === 'undefined')
            continue;
        if (date > time) {
            if (ids.includes(id)) {
                updatedManga.push(id);
            }
        }
        else {
            loadMore = false;
        }
    }
    return {
        ids: updatedManga,
        loadMore
    };
};
exports.parseUpdatedManga = parseUpdatedManga;
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
        let date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
    switch (str.trim()) {
        case "Aujourd'hui":
            let today = new Date();
            return new Date(today.getFullYear(), today.getMonth(), today.getDate());
        case "Hier":
            let yesterday = new Date();
            return new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate() - 1);
        default:
            let date = str.split("/");
            return new Date(parseInt(date[2]), parseInt(date[1]) - 1, parseInt(date[0]));
    }
}
exports.parseDate = parseDate;

},{"paperback-extensions-common":5}]},{},[48])(48)
});
