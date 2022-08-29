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
exports.ReaperScansFR = exports.ReaperScansFRInfo = void 0;
const paperback_extensions_common_1 = require("paperback-extensions-common");
const ReaperScansFRParser_1 = require("../ReaperScansFR/ReaperScansFRParser");
const REAPERSCANS_DOMAIN = "https://reaperscans.fr";
const method = 'GET';
const headers = {
    'Host': 'reaperscans.fr'
};
exports.ReaperScansFRInfo = {
    version: '1.3.1',
    name: 'ReaperScansFR',
    icon: 'logo.png',
    author: 'Moomooo95',
    authorWebsite: 'https://github.com/Moomooo95',
    description: 'Source française ReaperScansFR',
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
        }
    ]
};
class ReaperScansFR extends paperback_extensions_common_1.Source {
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
        return `${REAPERSCANS_DOMAIN}/series/${mangaId}`;
    }
    ///////////////////////////////
    /////    MANGA DETAILS    /////
    ///////////////////////////////
    getMangaDetails(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${REAPERSCANS_DOMAIN}/series/${mangaId}`,
                method,
                headers
            });
            const response = yield this.requestManager.schedule(request, 1);
            const $ = this.cheerio.load(response.data);
            return yield ReaperScansFRParser_1.parseReaperScansFRDetails($, mangaId);
        });
    }
    //////////////////////////
    /////    CHAPTERS    /////
    //////////////////////////
    getChapters(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${REAPERSCANS_DOMAIN}/series/${mangaId}`,
                method,
                headers
            });
            const response = yield this.requestManager.schedule(request, 1);
            const $ = this.cheerio.load(response.data);
            return yield ReaperScansFRParser_1.parseReaperScansFRChapters($, mangaId);
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
            return yield ReaperScansFRParser_1.parseReaperScansFRChapterDetails($, mangaId, chapterId);
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
                    url: `${REAPERSCANS_DOMAIN}/page/${page}/?s=${search}&post_type=wp-manga&genre%5B0%5D=${query.includedTags[0].id}`,
                    method,
                    headers
                });
                const response = yield this.requestManager.schedule(request, 1);
                const $ = this.cheerio.load(response.data);
                manga = ReaperScansFRParser_1.parseSearch($);
                metadata = !ReaperScansFRParser_1.isLastPage($) ? { page: page + 1 } : undefined;
            }
            else {
                const request = createRequestObject({
                    url: `${REAPERSCANS_DOMAIN}/page/${page}/?s=${search}&post_type=wp-manga`,
                    method,
                    headers
                });
                const response = yield this.requestManager.schedule(request, 1);
                const $ = this.cheerio.load(response.data);
                manga = ReaperScansFRParser_1.parseSearch($);
                metadata = !ReaperScansFRParser_1.isLastPage($) ? { page: page + 1 } : undefined;
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
            const section1 = createHomeSection({ id: 'hot_manga', title: 'À la une', type: paperback_extensions_common_1.HomeSectionType.featured });
            const section2 = createHomeSection({ id: 'latest_updated_webtoons', title: 'Dernières Sorties Webtoons', view_more: true });
            const section3 = createHomeSection({ id: 'latest_updated_novels', title: 'Dernières Sorties Novels', view_more: true });
            const section4 = createHomeSection({ id: 'popular_today', title: 'Tendances : Journalières' });
            const section5 = createHomeSection({ id: 'popular_week', title: 'Tendances : Hebdomadaires' });
            const section6 = createHomeSection({ id: 'popular_all_times', title: 'Tendances : Globales' });
            const request = createRequestObject({
                url: `${REAPERSCANS_DOMAIN}`,
                method,
                headers
            });
            const response = yield this.requestManager.schedule(request, 1);
            const $1 = this.cheerio.load(response.data);
            ReaperScansFRParser_1.parseHomeSections($1, [section1, section2, section3, section4, section5, section6], sectionCallback);
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
                case 'latest_updated_webtoons':
                    param = `webtoons/page/${page}/?m_orderby=latest`;
                    break;
                case 'latest_updated_novels':
                    param = `webnovel/page/${page}/?m_orderby=latest`;
                    break;
            }
            const request = createRequestObject({
                url: `${REAPERSCANS_DOMAIN}/${param}`,
                method,
                headers
            });
            const response = yield this.requestManager.schedule(request, 1);
            const $ = this.cheerio.load(response.data);
            const manga = ReaperScansFRParser_1.parseViewMore($);
            metadata = !ReaperScansFRParser_1.isLastPage($) ? { page: page + 1 } : undefined;
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
                    url: `${REAPERSCANS_DOMAIN}`,
                    method,
                    headers
                });
                const response = yield this.requestManager.schedule(request, 1);
                const $ = this.cheerio.load(response.data);
                updatedManga = ReaperScansFRParser_1.parseUpdatedManga($, time, ids);
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
                url: `${REAPERSCANS_DOMAIN}/series`,
                method,
                headers
            });
            const response = yield this.requestManager.schedule(request, 1);
            const $ = this.cheerio.load(response.data);
            return ReaperScansFRParser_1.parseTags($);
        });
    }
}
exports.ReaperScansFR = ReaperScansFR;

},{"../ReaperScansFR/ReaperScansFRParser":49,"paperback-extensions-common":5}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUpdatedManga = exports.parseTags = exports.isLastPage = exports.parseViewMore = exports.parseHomeSections = exports.parseSearch = exports.parseReaperScansFRChapterDetails = exports.parseReaperScansFRChapters = exports.parseReaperScansFRDetails = void 0;
const paperback_extensions_common_1 = require("paperback-extensions-common");
const REAPERSCANS_DOMAIN = "https://new.reaperscans.fr";
///////////////////////////////
/////    MANGA DETAILS    /////
///////////////////////////////
const parseReaperScansFRDetails = ($, mangaId) => {
    var _a, _b, _c, _d, _e;
    const panel = $('#nav-info');
    const titles = [decodeHTMLEntity($('.container .post-title h1').text().trim())];
    const image = (_a = $('.summary_image img').attr('src')) !== null && _a !== void 0 ? _a : '';
    const author = (_b = $('.post-content_item .summary-heading:contains("Auteur(s)")', panel).next().text().trim()) !== null && _b !== void 0 ? _b : "Unknown";
    const artist = (_c = $('.post-content_item .summary-heading:contains("Artiste(s)")', panel).next().text().trim()) !== null && _c !== void 0 ? _c : "Unknown";
    const rating = Number($('.post-total-rating .score', panel).text().trim());
    const follows = Number($('.post-status .manga-action .add-bookmark .action_detail').text().trim().replace(/[^\d]/g, ""));
    let hentai = false;
    const otherTitles = $('.post-content_item .summary-heading:contains("Alternative")', panel).next().text().trim().split(',');
    for (let title of otherTitles) {
        titles.push(decodeHTMLEntity(title.trim()));
    }
    const arrayTags = [];
    const tags = $('.post-content_item .summary-heading:contains("Genre(s)")', panel).next().find('a').toArray();
    for (const tag of tags) {
        const label = decodeHTMLEntity($(tag).text());
        const id = (_e = (_d = $(tag).attr('href')) === null || _d === void 0 ? void 0 : _d.split("/")[4]) !== null && _e !== void 0 ? _e : label;
        if (['Adulte'].includes(label) || ['Mature'].includes(label)) {
            hentai = true;
        }
        arrayTags.push({ id: id, label: label });
    }
    const tagSections = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.length > 0 ? arrayTags.map(x => createTag(x)) : [] })];
    let status = paperback_extensions_common_1.MangaStatus.UNKNOWN;
    switch ($('.post-content_item .summary-heading:contains("Statut")', panel).next().text().trim()) {
        case "End":
            status = paperback_extensions_common_1.MangaStatus.COMPLETED;
            break;
        case "OnGoing":
            status = paperback_extensions_common_1.MangaStatus.ONGOING;
            break;
        case "Dropped":
            status = paperback_extensions_common_1.MangaStatus.ABANDONED;
            break;
        case "Canceled":
            status = paperback_extensions_common_1.MangaStatus.UNKNOWN;
            break;
    }
    const desc = decodeHTMLEntity($('#nav-profile p').text().trim());
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
        desc,
        hentai: false
    });
};
exports.parseReaperScansFRDetails = parseReaperScansFRDetails;
//////////////////////////
/////    Chapters    /////
//////////////////////////
const parseReaperScansFRChapters = ($, mangaId) => {
    var _a, _b;
    const chapters = [];
    for (let chapter of $('.listing-chapters_wrap .wp-manga-chapter').toArray()) {
        let id = (_a = $('a', chapter).attr('href')) !== null && _a !== void 0 ? _a : '';
        let name = decodeHTMLEntity($('.chapter-manhwa-title', chapter).text());
        let chapNum = Number(((_b = $('.chapter-manhwa-title', chapter).text().trim().match(/(\d+)(\.?)(\d*)/gm)) !== null && _b !== void 0 ? _b : '')[0]);
        let time = parseDate($('.chapter-release-date', chapter).text().trim());
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
exports.parseReaperScansFRChapters = parseReaperScansFRChapters;
//////////////////////////////////
/////    Chapters Details    /////
//////////////////////////////////
const parseReaperScansFRChapterDetails = ($, mangaId, chapterId) => {
    var _a;
    const pages = [];
    for (let item of $('.entry-content .reading-content .page-break img').toArray()) {
        let page = (_a = $(item).attr('src')) === null || _a === void 0 ? void 0 : _a.trim();
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
exports.parseReaperScansFRChapterDetails = parseReaperScansFRChapterDetails;
////////////////////////
/////    Search    /////
////////////////////////
const parseSearch = ($) => {
    var _a, _b, _c, _d;
    const manga = [];
    for (const item of $('.c-tabs-item .row.c-tabs-item__content').toArray()) {
        let id = (_b = (_a = $('.tab-thumb.c-image-hover a', item).attr('href')) === null || _a === void 0 ? void 0 : _a.split("/")[4]) !== null && _b !== void 0 ? _b : '';
        let image = (_d = (_c = $('.tab-thumb.c-image-hover a img', item).attr('src')) === null || _c === void 0 ? void 0 : _c.replace('-193x278', '')) !== null && _d !== void 0 ? _d : '';
        let title = ($('.tab-summary .post-title h3', item).text().trim());
        let subtitle = ($('.tab-meta .meta-item.latest-chap a', item).text().trim());
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
///////////////////////////
/////    HOT MANGA    /////
///////////////////////////
const parseHotManga = ($) => {
    var _a;
    const hotManga = [];
    for (var item of $('.n2-ss-slide').toArray()) {
        var url = (_a = $('.n2-ss-slide-inner', item).attr('data-href')) === null || _a === void 0 ? void 0 : _a.split("/")[4];
        var image = `https:${$('.n2-ss-slide-background img', item).attr('src')}`;
        var title = '';
        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue;
        if (url !== '') {
            hotManga.push(createMangaTile({
                id: url,
                image: image,
                title: createIconText({ text: title })
            }));
        }
    }
    return hotManga;
};
//////////////////////////////////////////
/////    LATEST UPDATED WEBTOONS     /////
//////////////////////////////////////////
const parseLastUpdatedWebtoons = ($) => {
    var _a;
    const lastUpdatedWebtoons = [];
    for (const item of $('.latest .col-6.col-sm-6.col-md-6.col-xl-3').toArray()) {
        let url = (_a = $('.series-content a', item).attr('href')) === null || _a === void 0 ? void 0 : _a.split("/")[4];
        let image = $('.image-series a img', item).attr('src');
        let title = decodeHTMLEntity($('.series-content a h5', item).text().trim());
        let subtitle = decodeHTMLEntity($('.info .d-flex.justify-content-between a', item).eq(0).text().trim());
        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue;
        lastUpdatedWebtoons.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle })
        }));
    }
    return lastUpdatedWebtoons;
};
//////////////////////////////////////////
/////    LATEST UPDATED NOVELS     /////
//////////////////////////////////////////
const parseLastUpdatedNovels = ($) => {
    var _a;
    const lastUpdatedNovels = [];
    for (const item of $('.latest-novels .col-6.col-sm-6.col-md-6.col-xl-2').toArray()) {
        let url = (_a = $('.series-content a', item).attr('href')) === null || _a === void 0 ? void 0 : _a.split("/")[4];
        let image = $('.image-series a img', item).attr('src');
        let title = decodeHTMLEntity($('.series-content a h5', item).text().trim());
        let subtitle = decodeHTMLEntity($('.info .d-flex.justify-content-between a', item).eq(0).text().trim());
        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue;
        lastUpdatedNovels.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle })
        }));
    }
    return lastUpdatedNovels;
};
///////////////////////////////////
/////    POPULAR MANGA DAY    /////
///////////////////////////////////
const parsePopularMangaToday = ($) => {
    var _a, _b;
    const popularMangaToday = [];
    for (const item of $('#nav-home li').toArray()) {
        let url = (_a = $('.title-and-infos a', item).attr('href')) === null || _a === void 0 ? void 0 : _a.split("/")[4];
        let image = (_b = $('.fotinhofofa a img', item).attr('src')) === null || _b === void 0 ? void 0 : _b.replace('-125x180', '');
        let title = decodeHTMLEntity($('.title-and-infos a h2', item).text().trim());
        let subtitle = "⭐ " + decodeHTMLEntity($('.title-and-infos .numscore', item).text().trim());
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
    var _a, _b;
    const popularMangaWeek = [];
    for (const item of $('#nav-roi li').toArray()) {
        let url = (_a = $('.title-and-infos a', item).attr('href')) === null || _a === void 0 ? void 0 : _a.split("/")[4];
        let image = (_b = $('.fotinhofofa a img', item).attr('src')) === null || _b === void 0 ? void 0 : _b.replace('-125x180', '');
        let title = decodeHTMLEntity($('.title-and-infos a h2', item).text().trim());
        let subtitle = "⭐ " + decodeHTMLEntity($('.title-and-infos .numscore', item).text().trim());
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
////////////////////////////////////////////
/////    POPULAR MANGA ALL THE TIME    /////
////////////////////////////////////////////
const parsePopularMangaAllTime = ($) => {
    var _a, _b;
    const popularMangaAllTime = [];
    for (const item of $('#nav-contact li').toArray()) {
        let url = (_a = $('.title-and-infos a', item).attr('href')) === null || _a === void 0 ? void 0 : _a.split("/")[4];
        let image = (_b = $('.fotinhofofa a img', item).attr('src')) === null || _b === void 0 ? void 0 : _b.replace('-125x180', '');
        let title = decodeHTMLEntity($('.title-and-infos a h2', item).text().trim());
        let subtitle = "⭐ " + decodeHTMLEntity($('.title-and-infos .numscore', item).text().trim());
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
//////////////////////////////
/////    HOME SECTION    /////
//////////////////////////////
const parseHomeSections = ($, sections, sectionCallback) => {
    for (const section of sections)
        sectionCallback(section);
    const hotManga = parseHotManga($);
    const lastUpdatedWebtoons = parseLastUpdatedWebtoons($);
    const lastUpdatedNovels = parseLastUpdatedNovels($);
    const popularMangaToday = parsePopularMangaToday($);
    const popularMangaWeek = parsePopularMangaWeek($);
    const popularMangaAllTime = parsePopularMangaAllTime($);
    sections[0].items = hotManga;
    sections[1].items = lastUpdatedWebtoons;
    sections[2].items = lastUpdatedNovels;
    sections[3].items = popularMangaToday;
    sections[4].items = popularMangaWeek;
    sections[5].items = popularMangaAllTime;
    for (const section of sections)
        sectionCallback(section);
};
exports.parseHomeSections = parseHomeSections;
///////////////////////////
/////    VIEW MORE    /////
///////////////////////////
const parseViewMore = ($) => {
    var _a, _b;
    const viewMore = [];
    for (const item of $('.page-content-listing.item-big_thumbnail .page-item-detail.manga').toArray()) {
        let url = (_a = $('.item-thumb.c-image-hover a', item).attr('href')) === null || _a === void 0 ? void 0 : _a.split("/")[4];
        let image = (_b = $('.item-thumb.c-image-hover a img', item).attr('src')) === null || _b === void 0 ? void 0 : _b.replace('-175x238', '');
        let title = decodeHTMLEntity($('.item-summary .post-title h3', item).text().trim());
        let subtitle = decodeHTMLEntity($('.item-summary .list-chapter .chapter a', item).eq(0).text().trim());
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
exports.parseViewMore = parseViewMore;
/////////////////////////////////
/////    CHECK LAST PAGE    /////
/////////////////////////////////
const isLastPage = ($) => {
    return $('nav.navigation-ajax').length == 0;
};
exports.isLastPage = isLastPage;
//////////////////////
/////    TAGS    /////
//////////////////////
const parseTags = ($) => {
    var _a, _b;
    const arrayTags = [];
    for (let item of $('.genres_wrap .row.genres li').toArray()) {
        let id = (_b = (_a = $('a', item).attr('href')) === null || _a === void 0 ? void 0 : _a.split('/')[4]) !== null && _b !== void 0 ? _b : '';
        let label = ($('a', item).text().trim().split('\n')[0]);
        arrayTags.push({ id: id, label: label });
    }
    const tagSections = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.map(x => createTag(x)) })];
    return tagSections;
};
exports.parseTags = parseTags;
const parseUpdatedManga = ($, time, ids) => {
    var _a, _b;
    const manga = [];
    let loadMore = true;
    for (const item of $('.feed-reaper tbody tr').toArray()) {
        let id = (_b = (_a = $('td a', item).eq(0).attr('href')) === null || _a === void 0 ? void 0 : _a.split("/")[4]) !== null && _b !== void 0 ? _b : '';
        let mangaTime = parseDate($('td', item).eq(2).text().trim());
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
    str = str.trim();
    if (str.length == 0) {
        let date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
    if (/^(\d){2}\/(\d){2}\/(\d){4}$/.test(str)) {
        let date = str.split('/');
        return new Date(parseInt(date[2]), parseInt(date[1]) - 1, parseInt(date[0]));
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

},{"paperback-extensions-common":5}]},{},[48])(48)
});
