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
    version: '1.0',
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
        return `${MANGASORIGINES_DOMAIN}/manga/${mangaId}`;
    }
    ///////////////////////////////
    /////    MANGA DETAILS    /////
    ///////////////////////////////
    getMangaDetails(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${MANGASORIGINES_DOMAIN}/manga/${mangaId}`,
                method,
                headers
            });
            const response = yield this.requestManager.schedule(request, 1);
            this.CloudFlareError(response.status);
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
                url: `${MANGASORIGINES_DOMAIN}/manga/${mangaId}/ajax/chapters/`,
                method: 'POST',
                headers
            });
            const response = yield this.requestManager.schedule(request, 1);
            this.CloudFlareError(response.status);
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
            this.CloudFlareError(response.status);
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
                this.CloudFlareError(response.status);
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
                this.CloudFlareError(response.status);
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
            const section1 = createHomeSection({ id: 'hot_manga', title: '🔥 HOT 🔥' });
            const section2 = createHomeSection({ id: 'popular_today', title: 'TOP DU JOUR', view_more: true });
            const section3 = createHomeSection({ id: 'latest_updated', title: 'Dernières Mise à jour', view_more: true });
            const section4 = createHomeSection({ id: 'novelty', title: 'Nouveautés' });
            const request = createRequestObject({
                url: `${MANGASORIGINES_DOMAIN}`,
                method,
                headers
            });
            const response = yield this.requestManager.schedule(request, 1);
            this.CloudFlareError(response.status);
            const $ = this.cheerio.load(response.data);
            MangasOriginesParser_1.parseHomeSections($, [section1, section2, section3, section4], sectionCallback);
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
                    param = `manga/?m_orderby=trending&page=${page}`;
                    break;
                case 'latest_updated':
                    param = `manga/?m_orderby=latest&page=${page}`;
                    break;
            }
            const request = createRequestObject({
                url: `${MANGASORIGINES_DOMAIN}/${param}`,
                method,
                headers
            });
            const response = yield this.requestManager.schedule(request, 1);
            this.CloudFlareError(response.status);
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
            const request = createRequestObject({
                url: `${MANGASORIGINES_DOMAIN}`,
                method,
                headers
            });
            const response = yield this.requestManager.schedule(request, 1);
            this.CloudFlareError(response.status);
            const $ = this.cheerio.load(response.data);
            const updatedManga = [];
            for (const manga of $('.page-content-listing.item-default .page-item-detail.manga').toArray()) {
                let id = $('h3 a', manga).attr('href');
                let mangaDate = MangasOriginesParser_1.parseDate($('.post-on.font-meta', manga).eq(0).text().trim());
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
                url: `${MANGASORIGINES_DOMAIN}/?s=&post_type=wp-manga`,
                method,
                headers
            });
            const response = yield this.requestManager.schedule(request, 1);
            this.CloudFlareError(response.status);
            const $ = this.cheerio.load(response.data);
            return MangasOriginesParser_1.parseTags($);
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
            url: `${MANGASORIGINES_DOMAIN}`,
            method: 'GET',
            headers
        });
    }
}
exports.MangasOrigines = MangasOrigines;

},{"./MangasOriginesParser":49,"paperback-extensions-common":5}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDate = exports.parseTags = exports.isLastPage = exports.parseViewMore = exports.parseHomeSections = exports.parseSearch = exports.parseMangasOriginesChapterDetails = exports.parseMangasOriginesChapters = exports.parseMangasOriginesDetails = void 0;
const paperback_extensions_common_1 = require("paperback-extensions-common");
///////////////////////////////
/////    MANGA DETAILS    /////
///////////////////////////////
exports.parseMangasOriginesDetails = ($, mangaId) => {
    var _a, _b, _c, _d;
    const panel = $('.container .tab-summary');
    const titles = [decodeHTMLEntity($('.container .post-title h1').text().trim())];
    const image = (_a = $('img', panel).attr('data-src')) !== null && _a !== void 0 ? _a : "";
    const rating = Number($('.post-total-rating .score', panel).text().trim());
    const arrayTags = [];
    let status = paperback_extensions_common_1.MangaStatus.UNKNOWN;
    let author = "Unknown";
    let artist = undefined;
    let hentai = false;
    const infoContent = $('.post-content_item', panel).toArray();
    for (let info of infoContent) {
        let item = $('.summary-heading', info).text().trim().split(' ')[1];
        let val = $('.summary-content', info).text().trim();
        switch (item) {
            case "Rang":
                let nb_views = ((_b = val.match(/(\d+\.?\d*\w?) /gm)) !== null && _b !== void 0 ? _b : "")[0].trim();
                const views = convertNbViews(nb_views);
                break;
            case "Alternatif":
                let otherTitles = val.split(',');
                for (let title of otherTitles) {
                    titles.push(decodeHTMLEntity(title.trim()));
                }
                break;
            case "Auteur(s)":
                author = val;
                break;
            case "Artiste(s)":
                artist = val;
                break;
            case "Genre(s)":
                const tags = $('.summary-content .genres-content a', info).toArray();
                for (const tag of tags) {
                    const label = $(tag).text();
                    const id = (_d = (_c = $(tag).attr('href')) === null || _c === void 0 ? void 0 : _c.split("/")[4]) !== null && _d !== void 0 ? _d : label;
                    if (['Adulte'].includes(label) || ['Hentai'].includes(label) || ['Sexe'].includes(label) || ['Uncensored'].includes(label)) {
                        hentai = true;
                    }
                    arrayTags.push({ id: id, label: label });
                }
                break;
            case "STATUS":
                switch (val.split(" ")[0].trim()) {
                    case "Terminé":
                        status = paperback_extensions_common_1.MangaStatus.COMPLETED;
                        break;
                    case "En cours":
                        status = paperback_extensions_common_1.MangaStatus.ONGOING;
                        break;
                }
                break;
        }
    }
    const tagSections = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.length > 0 ? arrayTags.map(x => createTag(x)) : [] })];
    let summary = decodeHTMLEntity($('.container .summary__content.show-more').text().trim());
    return createManga({
        id: mangaId,
        titles,
        image,
        author,
        artist,
        rating,
        status,
        tags: tagSections,
        desc: summary,
        hentai
    });
};
///////////////////////////////
/////    CHAPTERS LIST    /////
///////////////////////////////
exports.parseMangasOriginesChapters = ($, mangaId) => {
    var _a, _b;
    const allChapters = $('.wp-manga-chapter');
    const chapters = [];
    for (let chapter of allChapters.toArray()) {
        const id = (_a = $('a', chapter).first().attr('href') + "?style=list") !== null && _a !== void 0 ? _a : '';
        const name = $('a', chapter).first().text().trim();
        const chapNum = Number(((_b = name.match(/(\d+)(\.?)(\d*)/gm)) !== null && _b !== void 0 ? _b : '')[0]);
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
    var _a;
    const pages = [];
    const allItems = $('.container .reading-content img').toArray();
    for (let item of allItems) {
        let page = (_a = $(item).attr('data-src')) === null || _a === void 0 ? void 0 : _a.trim();
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
    for (const item of $('.row .c-tabs-item__content').toArray()) {
        const url = (_b = (_a = $('h3 a', item).attr('href')) === null || _a === void 0 ? void 0 : _a.split('/')[4]) !== null && _b !== void 0 ? _b : '';
        const title = (_c = $('h3 a', item).text()) !== null && _c !== void 0 ? _c : '';
        const image = (_d = $('img', item).attr("data-src")) !== null && _d !== void 0 ? _d : '';
        const subtitle = $('.latest-chap .chapter a', item).text();
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
    var _a;
    const hotManga = [];
    for (const item of $('.container .manga-slider .slider__container .slider__item').toArray()) {
        let url = (_a = $('h4 a', item).attr('href')) === null || _a === void 0 ? void 0 : _a.split("/")[4];
        let image = $('img', item).attr('src');
        let title = $('h4', item).text().trim();
        let subtitle = "";
        if (typeof url === 'undefined' || typeof image === 'undefined')
            continue;
        hotManga.push(createMangaTile({
            id: url,
            image: image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle })
        }));
    }
    return hotManga;
};
///////////////////////////////
/////    POPULAR TODAY    /////
///////////////////////////////
const parsePopularTodayManga = ($) => {
    var _a, _b;
    const popularTodayManga = [];
    for (const item of $('.widget-content .popular-item-wrap').toArray()) {
        let url = (_a = $('h5 a', item).attr('href')) === null || _a === void 0 ? void 0 : _a.split("/")[4];
        let image = ((_b = $('img', item).attr('data-src')) !== null && _b !== void 0 ? _b : "").replace("75x106", "193x278");
        let title = $('h5 a', item).text().trim();
        let subtitle = $('.chapter-item .chapter.font-meta', item).eq(0).text().trim();
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
////////////////////////////////
/////    LATEST UPDATED    /////
////////////////////////////////
const parseLatestUpdatedManga = ($) => {
    var _a, _b;
    const latestUpdatedManga = [];
    for (const item of $('.page-content-listing.item-default .page-item-detail.manga').toArray()) {
        let url = (_a = $('h3 a', item).attr('href')) === null || _a === void 0 ? void 0 : _a.split("/")[4];
        let image = ((_b = $('img', item).attr('data-src')) !== null && _b !== void 0 ? _b : "").replace("110x150", "193x278");
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
/////////////////////////
/////    NOVELTY    /////
/////////////////////////
const parseNoveltyManga = ($) => {
    var _a;
    const noveltyManga = [];
    for (const item of $('#manga-popular-slider-2 .slider__container .slider__item').toArray()) {
        let url = (_a = $('h4 a', item).attr('href')) === null || _a === void 0 ? void 0 : _a.split("/")[4];
        let image = $('img', item).attr('src');
        let title = $('h4 a', item).text().trim();
        let subtitle = $('.chapter-item .chapter', item).eq(0).text().trim();
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
    const popularTodayManga = parsePopularTodayManga($);
    const latestUpdatedManga = parseLatestUpdatedManga($);
    const noveltyManga = parseNoveltyManga($);
    sections[0].items = hotManga;
    sections[1].items = popularTodayManga;
    sections[2].items = latestUpdatedManga;
    sections[3].items = noveltyManga;
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
        let url = (_a = $('h3 a', item).attr('href')) === null || _a === void 0 ? void 0 : _a.split("/")[4];
        let image = $('.img-responsive', item).attr('data-src');
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
        let label = $('label', item).text().trim();
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
    if (str.length == 0) {
        let date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
    let date = str.split(" ");
    let year = date[2];
    let months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
    let month = months.findIndex((element) => element == date[1]).toString();
    let day = date[0];
    return new Date(parseInt(year), parseInt(month), parseInt(day));
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
