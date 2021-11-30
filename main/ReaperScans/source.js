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
exports.ReaperScans = exports.ReaperScansInfo = void 0;
const paperback_extensions_common_1 = require("paperback-extensions-common");
const ReaperScansParser_1 = require("../ReaperScans/ReaperScansParser");
const REAPERSCANS_DOMAIN = "https://reaperscans.fr";
const method = 'GET';
const headers = {
    'Host': 'reaperscans.fr'
};
exports.ReaperScansInfo = {
    version: '1.1',
    name: 'ReaperScans',
    icon: 'logo.png',
    author: 'Moomooo95',
    authorWebsite: 'https://github.com/Moomooo95',
    description: 'Source française ReaperScans',
    contentRating: paperback_extensions_common_1.ContentRating.MATURE,
    websiteBaseURL: REAPERSCANS_DOMAIN,
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
        }
    ]
};
class ReaperScans extends paperback_extensions_common_1.Source {
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
        return `${REAPERSCANS_DOMAIN}/manga/${mangaId}`;
    }
    ///////////////////////////////
    /////    MANGA DETAILS    /////
    ///////////////////////////////
    getMangaDetails(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${REAPERSCANS_DOMAIN}/manga/${mangaId}`,
                method,
                headers
            });
            const response = yield this.requestManager.schedule(request, 1);
            this.CloudFlareError(response.status);
            const $ = this.cheerio.load(response.data);
            return yield ReaperScansParser_1.parseReaperScansDetails($, mangaId);
        });
    }
    //////////////////////////
    /////    CHAPTERS    /////
    //////////////////////////
    getChapters(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${REAPERSCANS_DOMAIN}/manga/${mangaId}`,
                method,
                headers
            });
            const response = yield this.requestManager.schedule(request, 1);
            this.CloudFlareError(response.status);
            const $ = this.cheerio.load(response.data);
            return yield ReaperScansParser_1.parseReaperScansChapters($, mangaId);
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
            this.CloudFlareError(response.status);
            const $ = this.cheerio.load(response.data);
            return yield ReaperScansParser_1.parseReaperScansChapterDetails($, mangaId, chapterId);
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
                    url: `${REAPERSCANS_DOMAIN}/manga/?page=${page}&genre%5B0%5D=${query.includedTags[0].id}`,
                    method: 'GET',
                    headers
                });
                const response = yield this.requestManager.schedule(request, 1);
                this.CloudFlareError(response.status);
                const $ = this.cheerio.load(response.data);
                manga = ReaperScansParser_1.parseSearch($);
                metadata = !ReaperScansParser_1.isLastPage($, 'search_tags') ? { page: page + 1 } : undefined;
            }
            else {
                const request = createRequestObject({
                    url: `${REAPERSCANS_DOMAIN}/page/${page}/?s=${search}`,
                    method: 'GET',
                    headers
                });
                const response = yield this.requestManager.schedule(request, 1);
                this.CloudFlareError(response.status);
                const $ = this.cheerio.load(response.data);
                manga = ReaperScansParser_1.parseSearch($);
                metadata = !ReaperScansParser_1.isLastPage($, 'search') ? { page: page + 1 } : undefined;
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
            const section1 = createHomeSection({ id: 'hot_manga', title: 'HOT' });
            const section2 = createHomeSection({ id: 'popular_today', title: 'Populaire : Aujourd\'hui' });
            const section3 = createHomeSection({ id: 'popular_week', title: 'Populaire : Semaine' });
            const section4 = createHomeSection({ id: 'popular_month', title: 'Populaire : Mois' });
            const section5 = createHomeSection({ id: 'popular_all_times', title: 'Populaire : Tous' });
            const section6 = createHomeSection({ id: 'latest_projects', title: 'Derniers Projets', view_more: true });
            const section7 = createHomeSection({ id: 'latest_updated', title: 'Dernières Sorties', view_more: true });
            const section8 = createHomeSection({ id: 'new_projects', title: 'Nouvelles Séries' });
            const request = createRequestObject({
                url: `${REAPERSCANS_DOMAIN}`,
                method,
                headers
            });
            const response = yield this.requestManager.schedule(request, 1);
            this.CloudFlareError(response.status);
            const $1 = this.cheerio.load(response.data);
            ReaperScansParser_1.parseHomeSections($1, [section1, section2, section3, section4, section5, section6, section7, section8], sectionCallback);
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
                case 'latest_projects':
                    param = `projets/page/${page}`;
                    break;
                case 'latest_updated':
                    param = `manga/?page=${page}&order=update`;
                    break;
            }
            const request = createRequestObject({
                url: `${REAPERSCANS_DOMAIN}/${param}`,
                method,
                headers
            });
            const response = yield this.requestManager.schedule(request, 1);
            this.CloudFlareError(response.status);
            const $ = this.cheerio.load(response.data);
            const manga = ReaperScansParser_1.parseViewMore($);
            metadata = !ReaperScansParser_1.isLastPage($, homepageSectionId) ? { page: page + 1 } : undefined;
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
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${REAPERSCANS_DOMAIN}`,
                method,
                headers
            });
            const response = yield this.requestManager.schedule(request, 1);
            this.CloudFlareError(response.status);
            const $ = this.cheerio.load(response.data);
            const updatedManga = [];
            for (const manga of $('.postbody .listupd').eq(1).find('.utao.styletwo').toArray()) {
                let id = $('a', manga).first().attr('href');
                let mangaDate = ReaperScansParser_1.parseDate(((_a = $('.luf span', manga).text()) !== null && _a !== void 0 ? _a : '').trim().split('Il y a ')[1]);
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
    //////////////////////
    /////    TAGS    /////
    //////////////////////
    getTags() {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${REAPERSCANS_DOMAIN}/manga`,
                method,
                headers
            });
            const response = yield this.requestManager.schedule(request, 1);
            this.CloudFlareError(response.status);
            const $ = this.cheerio.load(response.data);
            return ReaperScansParser_1.parseTags($);
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
            url: `${REAPERSCANS_DOMAIN}`,
            method: 'GET',
            headers
        });
    }
}
exports.ReaperScans = ReaperScans;

},{"../ReaperScans/ReaperScansParser":49,"paperback-extensions-common":5}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDate = exports.parseDateChap = exports.parseTags = exports.isLastPage = exports.parseViewMore = exports.parseHomeSections = exports.parseSearch = exports.parseReaperScansChapterDetails = exports.parseReaperScansChapters = exports.parseReaperScansDetails = void 0;
const paperback_extensions_common_1 = require("paperback-extensions-common");
///////////////////////////////
/////    MANGA DETAILS    /////
///////////////////////////////
exports.parseReaperScansDetails = ($, mangaId) => {
    var _a, _b, _c, _d;
    const titles = [decodeHTMLEntity($('.entry-title').text().trim())];
    const image = (_a = $('.info-left-margin img').attr('src')) !== null && _a !== void 0 ? _a : "";
    let follows = Number($('.bmc').text().trim().replace(/[^\d]/g, ""));
    let rating = Number($('.num').text().trim());
    let status = paperback_extensions_common_1.MangaStatus.UNKNOWN;
    let author = "Unknown";
    let artist = undefined;
    let lastUpdate = undefined;
    const multipleInfo = $('.tsinfo.bixbox .imptdt').toArray();
    for (let info of multipleInfo) {
        let item = ((_b = $(info).html()) !== null && _b !== void 0 ? _b : "").split("<i>")[0].trim();
        let val = $('i', info).text().trim();
        switch (item) {
            case "Statut":
                switch (val) {
                    case "Terminée":
                        status = paperback_extensions_common_1.MangaStatus.COMPLETED;
                        break;
                    case "En cours":
                        status = paperback_extensions_common_1.MangaStatus.ONGOING;
                        break;
                }
                break;
            case "Auteur(e)":
                author = val;
                break;
            case "Artiste":
                artist = val;
                break;
            case "Mis à jour le":
                lastUpdate = new Date(val);
                break;
            default:
                break;
        }
    }
    const arrayTags = [];
    // Tags 
    const tags = $('.info-desc.bixbox .mgen a').toArray();
    for (const tag of tags) {
        const id = (_d = (_c = $(tag).first().attr('href')) === null || _c === void 0 ? void 0 : _c.split("/")[4]) !== null && _d !== void 0 ? _d : '';
        const label = $(tag).text();
        arrayTags.push({ id: id, label: label });
    }
    const tagSections = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.length > 0 ? arrayTags.map(x => createTag(x)) : [] })];
    let summary = decodeHTMLEntity($('.entry-content-single').text());
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
        desc: summary,
        hentai: false
    });
};
//////////////////////////
/////    Chapters    /////
//////////////////////////
exports.parseReaperScansChapters = ($, mangaId) => {
    var _a;
    const allChapters = $('#chapterlist');
    const chapters = [];
    for (let chapter of $('li', allChapters).toArray()) {
        const id = (_a = $('a', chapter).attr('href')) !== null && _a !== void 0 ? _a : '';
        const name = $('.chapternum', chapter).text();
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
//////////////////////////////////
/////    Chapters Details    /////
//////////////////////////////////
exports.parseReaperScansChapterDetails = ($, mangaId, chapterId) => {
    const pages = [];
    const allItems = $($.parseHTML($('noscript').text())).children().toArray();
    for (let item of allItems) {
        let page = $(item).attr('src');
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
    for (const item of $('.listupd .bs').toArray()) {
        const id = (_b = (_a = $('a', item).attr('href')) === null || _a === void 0 ? void 0 : _a.split('/')[4]) !== null && _b !== void 0 ? _b : '';
        const title = (_c = $('a', item).attr('title')) !== null && _c !== void 0 ? _c : '';
        const image = (_d = $('img', item).attr("src")) !== null && _d !== void 0 ? _d : '';
        const subtitle = $('.epxs', item).text();
        manga.push(createMangaTile({
            id,
            image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle })
        }));
    }
    return manga;
};
///////////////////////////
/////    HOT MANGA    /////
///////////////////////////
const parseHotManga = ($) => {
    var _a, _b;
    const hotManga = [];
    for (const item of $('.swiper-wrapper .swiper-slide').toArray()) {
        let url = (_a = $('a', item).first().attr('href')) === null || _a === void 0 ? void 0 : _a.split("/")[4];
        let image = ((_b = $('.bigbanner', item).attr('style')) !== null && _b !== void 0 ? _b : "").split('\'')[1];
        let title = $('.name', item).text();
        let subtitle = "";
        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue;
        hotManga.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle }),
        }));
    }
    return hotManga;
};
///////////////////////////////////
/////    POPULAR MANGA DAY    /////
///////////////////////////////////
const parsePopularMangaToday = ($) => {
    var _a, _b;
    const popularMangaToday = [];
    for (const item of $('.hotslid .bs').toArray()) {
        let url = (_a = $('a', item).first().attr('href')) === null || _a === void 0 ? void 0 : _a.split("/")[4];
        let image = $('img', item).attr('src');
        let title = (_b = $('a', item).first().attr('title')) !== null && _b !== void 0 ? _b : '';
        let subtitle = $('.epxs', item).text();
        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue;
        popularMangaToday.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle })
        }));
    }
    return popularMangaToday;
};
////////////////////////////////////
/////    POPULAR MANGA WEEK    /////
////////////////////////////////////
const parsePopularMangaWeek = ($) => {
    var _a;
    const popularMangaWeek = [];
    for (const item of $('.wpop-weekly li').toArray()) {
        let url = (_a = $('a', item).first().attr('href')) === null || _a === void 0 ? void 0 : _a.split("/")[4];
        let image = $('img', item).attr('src');
        let title = $('.leftseries h2 a', item).text();
        let subtitle = "";
        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue;
        popularMangaWeek.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle })
        }));
    }
    return popularMangaWeek;
};
/////////////////////////////////////
/////    POPULAR MANGA MONTH    /////
/////////////////////////////////////
const parsePopularMangaMonth = ($) => {
    var _a;
    const popularMangaMonth = [];
    for (const item of $('.wpop-monthly li').toArray()) {
        let url = (_a = $('a', item).first().attr('href')) === null || _a === void 0 ? void 0 : _a.split("/")[4];
        let image = $('img', item).attr('src');
        let title = $('.leftseries h2 a', item).text();
        let subtitle = "";
        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue;
        popularMangaMonth.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle })
        }));
    }
    return popularMangaMonth;
};
////////////////////////////////////////////
/////    POPULAR MANGA ALL THE TIME    /////
////////////////////////////////////////////
const parsePopularMangaAllTime = ($) => {
    var _a;
    const popularMangaAllTime = [];
    for (const item of $('.wpop-alltime li').toArray()) {
        let url = (_a = $('a', item).first().attr('href')) === null || _a === void 0 ? void 0 : _a.split("/")[4];
        let image = $('img', item).attr('src');
        let title = $('.leftseries h2 a', item).text();
        let subtitle = "";
        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue;
        popularMangaAllTime.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle })
        }));
    }
    return popularMangaAllTime;
};
/////////////////////////////////
/////    LATEST PROJECTS    /////
/////////////////////////////////
const parseLastProjects = ($) => {
    var _a, _b, _c, _d;
    const lastProjects = [];
    for (const item of $('.postbody .listupd').eq(0).children().toArray()) {
        let url = (_b = (_a = $('a', item).first().attr('href')) === null || _a === void 0 ? void 0 : _a.split("/")[3].split("-").slice(0, -1).join("-")) !== null && _b !== void 0 ? _b : 'undefined';
        let image = $('img', item).attr('src');
        let title = (_d = (_c = $('a', item).first().attr('title')) === null || _c === void 0 ? void 0 : _c.split(" ").slice(0, -1).join(" ")) !== null && _d !== void 0 ? _d : '';
        let subtitle = $('.epxs', item).text();
        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue;
        lastProjects.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle })
        }));
    }
    return lastProjects;
};
////////////////////////////////
/////    LAST RELEASES     /////
////////////////////////////////
const parseLastUpdate = ($) => {
    var _a, _b;
    const lastUpdate = [];
    for (const item of $('.postbody .listupd').eq(1).children().toArray()) {
        let url = (_a = $('a', item).first().attr('href')) === null || _a === void 0 ? void 0 : _a.split("/")[4];
        let image = $('img', item).attr('src');
        let title = (_b = $('a', item).first().attr('title')) !== null && _b !== void 0 ? _b : '';
        let subtitle = $('a', item).eq(2).text();
        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue;
        lastUpdate.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle })
        }));
    }
    return lastUpdate;
};
//////////////////////////////
/////    NEW PROJECTS    /////
//////////////////////////////
const parseNewProjects = ($) => {
    var _a;
    const newProjects = [];
    for (const item of $('.section .serieslist').eq(3).find('li').toArray()) {
        let url = (_a = $('a', item).first().attr('href')) === null || _a === void 0 ? void 0 : _a.split("/")[4];
        let image = $('img', item).attr('src');
        let title = $('h2', item).text();
        let subtitle = '';
        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue;
        newProjects.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle })
        }));
    }
    return newProjects;
};
//////////////////////////////
/////    HOME SECTION    /////
//////////////////////////////
exports.parseHomeSections = ($, sections, sectionCallback) => {
    for (const section of sections)
        sectionCallback(section);
    const hotManga = parseHotManga($);
    const popularMangaToday = parsePopularMangaToday($);
    const popularMangaWeek = parsePopularMangaWeek($);
    const popularMangaMonth = parsePopularMangaMonth($);
    const popularMangaAllTime = parsePopularMangaAllTime($);
    const LastProjects = parseLastProjects($);
    const LastUpdate = parseLastUpdate($);
    const NewProjects = parseNewProjects($);
    sections[0].items = hotManga;
    sections[1].items = popularMangaToday;
    sections[2].items = popularMangaWeek;
    sections[3].items = popularMangaMonth;
    sections[4].items = popularMangaAllTime;
    sections[5].items = LastProjects;
    sections[6].items = LastUpdate;
    sections[7].items = NewProjects;
    for (const section of sections)
        sectionCallback(section);
};
///////////////////////////
/////    VIEW MORE    /////
///////////////////////////
exports.parseViewMore = ($) => {
    var _a, _b, _c;
    const viewMore = [];
    for (const item of $('.postbody .listupd').eq(0).children().toArray()) {
        let url = (_b = (_a = $('a', item).first().attr('href')) === null || _a === void 0 ? void 0 : _a.split("/")[4]) !== null && _b !== void 0 ? _b : 'undefined';
        let image = $('img', item).attr('src');
        let title = (_c = $('a', item).first().attr('title')) !== null && _c !== void 0 ? _c : '';
        let subtitle = $('.epxs', item).text();
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
exports.isLastPage = ($, section) => {
    switch (section) {
        case 'latest_projects':
            return $('.next.page-numbers').length == 0;
        case 'latest_updated':
            return $('.hpage .r').length == 0;
        case 'search':
            return $('.next.page-numbers').length == 0;
        case 'search_tags':
            return $('.hpage .r').length == 0;
        default:
            return false;
    }
};
//////////////////////
/////    TAGS    /////
//////////////////////
exports.parseTags = ($) => {
    var _a;
    const arrayTags = [];
    for (let item of $('.dropdown-menu.c4.genrez li').toArray()) {
        let id = (_a = $('input', item).attr('value')) !== null && _a !== void 0 ? _a : '';
        let label = $('label', item).text();
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
exports.parseDateChap = parseDateChap;
function parseDate(str) {
    str = str.trim();
    if (str.length == 0) {
        let date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
    switch (str.split(' ').pop()) {
        case "minutes":
            let minutes = new Date();
            return new Date(minutes.getFullYear(), minutes.getMonth(), minutes.getDate(), minutes.getHours(), minutes.getMinutes() - parseInt(str.split(' ')[0]));
        case "heures":
            let hours = new Date();
            return new Date(hours.getFullYear(), hours.getMonth(), hours.getDate(), hours.getHours() - parseInt(str.split(' ')[0]));
        case "jours":
            let day = new Date();
            return new Date(day.getFullYear(), day.getMonth(), day.getDate() - parseInt(str.split(' ')[0]));
        case "semaines":
            let week = new Date();
            return new Date(week.getFullYear(), week.getMonth(), week.getDate() - (7 * parseInt(str.split(' ')[0])));
        case "mois":
            let month = new Date();
            return new Date(month.getFullYear(), month.getMonth() - parseInt(str.split(' ')[0]), month.getDate() - 1);
        default:
            return new Date();
    }
}
exports.parseDate = parseDate;

},{"paperback-extensions-common":5}]},{},[48])(48)
});
