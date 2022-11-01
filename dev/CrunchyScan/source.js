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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScrapServerURL = exports.setStateData = exports.retrieveStateData = void 0;
const DEFAULT_SCRAP_SERVER_ADDRESS = 'https://127.0.0.1:3000';
async function retrieveStateData(stateManager) {
    // Return serverURL saved in the source.
    // Used to show already saved data in settings
    const serverURL = await stateManager.retrieve('serverAddress') ?? DEFAULT_SCRAP_SERVER_ADDRESS;
    return { serverURL };
}
exports.retrieveStateData = retrieveStateData;
async function setStateData(stateManager, data) {
    await setScrapServerAddress(stateManager, data['serverAddress'] ?? DEFAULT_SCRAP_SERVER_ADDRESS);
}
exports.setStateData = setStateData;
async function setScrapServerAddress(stateManager, apiUri) {
    await stateManager.store('serverAddress', apiUri);
}
async function getScrapServerURL(stateManager) {
    return await stateManager.retrieve('serverAddress') ?? DEFAULT_SCRAP_SERVER_ADDRESS;
}
exports.getScrapServerURL = getScrapServerURL;

},{}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrunchyScan = exports.CrunchyScanInfo = void 0;
const paperback_extensions_common_1 = require("paperback-extensions-common");
const CrunchyScanParser_1 = require("./CrunchyScanParser");
const Settings_1 = require("./Settings");
const Common_1 = require("./Common");
const CRUNCHYSCAN_DOMAIN = "https://crunchyscan.fr";
const method = 'GET';
const headers = {
    'Host': 'crunchyscan.fr',
};
exports.CrunchyScanInfo = {
    version: '1.1',
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
        this.stateManager = createSourceStateManager({});
        this.requestManager = createRequestManager({
            requestsPerSecond: 3,
            requestTimeout: 100000
        });
    }
    /////////////////////////////
    /////    SOURCE MENU    /////
    /////////////////////////////
    async getSourceMenu() {
        return createSection({
            id: "main",
            header: "Source Settings",
            rows: async () => [
                Settings_1.serverSettingsMenu(this.stateManager),
            ],
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
    async getMangaDetails(mangaId) {
        const request = createRequestObject({
            url: `${CRUNCHYSCAN_DOMAIN}/liste-manga/${mangaId}`,
            method,
            headers
        });
        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status);
        const $ = this.cheerio.load(response.data);
        return await CrunchyScanParser_1.parseCrunchyScanDetails($, mangaId);
    }
    //////////////////////////
    /////    CHAPTERS    /////
    //////////////////////////
    async getChapters(mangaId) {
        const request = createRequestObject({
            url: `${CRUNCHYSCAN_DOMAIN}/liste-manga/${mangaId}/ajax/chapters/`,
            method: 'POST',
            headers,
        });
        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status);
        const $ = this.cheerio.load(response.data);
        return await CrunchyScanParser_1.parseCrunchyScanChapters($, mangaId);
    }
    //////////////////////////////////
    /////    CHAPTERS DETAILS    /////
    //////////////////////////////////
    async getChapterDetails(mangaId, chapterId) {
        const SHADOWOFBABEL_DOMAIN = await Common_1.getScrapServerURL(this.stateManager);
        const request = createRequestObject({
            url: `${SHADOWOFBABEL_DOMAIN}/crunchyscan/chapters/${mangaId}/${chapterId.split('/').filter(Boolean).pop()}`,
            method
        });
        const response = await this.requestManager.schedule(request, 1);
        return await CrunchyScanParser_1.parseCrunchyScanChapterDetails(response.data, mangaId, chapterId);
    }
    ////////////////////////////////
    /////    SEARCH REQUEST    /////
    ////////////////////////////////
    async getSearchResults(query, metadata) {
        const page = metadata?.page ?? 1;
        const search = query.title?.replace(/ /g, '+').replace(/[’'´]/g, '%27') ?? '';
        let manga = [];
        let url = `${CRUNCHYSCAN_DOMAIN}/?post_type=wp-manga&s=${search}&paged=${page}`;
        if (query.includedTags && query.includedTags?.length != 0) {
            for (let tag of query.includedTags) {
                switch (tag.label) {
                    case "OU (ayant l'un des genres sélectionnés)":
                    case "ET (avoir tous les genres sélectionnés)":
                        url += `&op=${tag.id}`;
                        break;
                    case "All":
                    case "Aucun contenu adulte":
                    case "Contenu pour adultes uniquement":
                        url += `&adult=${tag.id}`;
                        break;
                    case "En Cours":
                    case "Terminé":
                    case "Annulé":
                    case "En attente":
                        url += `&status%5B%5D=${tag.id}`;
                        break;
                    case "Tout":
                    case "Webcomic":
                    case "Manga":
                        url += `&type%5B%5D=${tag.id}`;
                        break;
                    default:
                        url += `&genre%5B%5D=${tag.id}`;
                        break;
                }
            }
        }
        const request = createRequestObject({
            url,
            method,
            headers
        });
        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data);
        manga = CrunchyScanParser_1.parseSearch($);
        metadata = !CrunchyScanParser_1.isLastPage($) ? { page: page + 1 } : undefined;
        return createPagedResults({
            results: manga,
            metadata
        });
    }
    //////////////////////////////
    /////    HOME SECTION    /////
    //////////////////////////////
    async getHomePageSections(sectionCallback) {
        const section1 = createHomeSection({ id: 'hot_manga', title: 'HOT', type: paperback_extensions_common_1.HomeSectionType.featured });
        const section2 = createHomeSection({ id: 'latest_updated', title: 'Dernières Sorties', view_more: true });
        const section3 = createHomeSection({ id: 'trends', title: 'Tendances', view_more: true });
        const request = createRequestObject({
            url: `${CRUNCHYSCAN_DOMAIN}`,
            method,
            headers
        });
        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status);
        const $ = this.cheerio.load(response.data);
        CrunchyScanParser_1.parseHomeSections($, [section1, section2, section3], sectionCallback);
    }
    /////////////////////////////////
    /////    VIEW MORE ITEMS    /////
    /////////////////////////////////
    async getViewMoreItems(homepageSectionId, metadata) {
        let page = metadata?.page ?? 1;
        let param = '';
        switch (homepageSectionId) {
            case 'latest_updated':
                param = `liste-manga/page/${page}?m_orderby=latest`;
                break;
            case 'trends':
                param = `liste-manga/page/${page}?m_orderby=trending`;
                break;
        }
        const request = createRequestObject({
            url: `${CRUNCHYSCAN_DOMAIN}/${param}`,
            method,
            headers
        });
        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status);
        const $ = this.cheerio.load(response.data);
        const manga = CrunchyScanParser_1.parseViewMore($);
        metadata = !CrunchyScanParser_1.isLastPage($) ? { page: page + 1 } : { page: page + 1 };
        return createPagedResults({
            results: manga,
            metadata
        });
    }
    //////////////////////////////////////
    /////    FILTER UPDATED MANGA    /////
    //////////////////////////////////////
    async filterUpdatedManga(mangaUpdatesFoundCallback, time, ids) {
        let page = 1;
        let updatedManga = {
            ids: [],
            loadMore: true
        };
        while (updatedManga.loadMore) {
            const request = createRequestObject({
                url: `${CRUNCHYSCAN_DOMAIN}/liste-manga/?m_orderby=latest&page=${page++}`,
                method,
                headers
            });
            const response = await this.requestManager.schedule(request, 1);
            const $ = this.cheerio.load(response.data);
            updatedManga = CrunchyScanParser_1.parseUpdatedManga($, time, ids);
            if (updatedManga.ids.length > 0) {
                mangaUpdatesFoundCallback(createMangaUpdates({
                    ids: updatedManga.ids
                }));
            }
        }
    }
    //////////////////////
    /////    TAGS    /////
    //////////////////////
    async getSearchTags() {
        const request = createRequestObject({
            url: `${CRUNCHYSCAN_DOMAIN}/?s=&post_type=wp-manga`,
            method,
            headers
        });
        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status);
        const $ = this.cheerio.load(response.data);
        return CrunchyScanParser_1.parseTags($);
    }
    ///////////////////////////////////
    /////    CLOUDFLARE BYPASS    /////
    ///////////////////////////////////
    getCloudflareBypassRequest() {
        return createRequestObject({
            url: `${CRUNCHYSCAN_DOMAIN}`,
            method,
            headers
        });
    }
    CloudFlareError(status) {
        if (status == 503) {
            throw new Error('CLOUDFLARE BYPASS ERROR:\nPlease go to Settings > Sources > CrunchyScan and press Cloudflare Bypass');
        }
    }
}
exports.CrunchyScan = CrunchyScan;

},{"./Common":48,"./CrunchyScanParser":50,"./Settings":51,"paperback-extensions-common":5}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDate = exports.parseUpdatedManga = exports.parseTags = exports.isLastPage = exports.parseViewMore = exports.parseHomeSections = exports.parseSearch = exports.parseCrunchyScanChapterDetails = exports.parseCrunchyScanChapters = exports.parseCrunchyScanDetails = void 0;
const paperback_extensions_common_1 = require("paperback-extensions-common");
///////////////////////////////
/////    MANGA DETAILS    /////
///////////////////////////////
const parseCrunchyScanDetails = ($, mangaId) => {
    const panel = $('.container .tab-summary');
    const titles = [decodeHTMLEntity($('.container .post-title h1').text().trim())];
    const image = $('.summary_image img', panel).attr('data-src') ?? '';
    const author = $('.post-content_item:contains("Author(s)") .summary-content', panel).text().trim() ?? undefined;
    const artist = $('.post-content_item:contains("Artist(s)") .summary-content', panel).text().trim() ?? undefined;
    const rating = Number($('.post-total-rating .score', panel).text().trim());
    const views = convertNbViews($('.post-content_item:contains("Rank") .summary-content', panel).text().trim().match(/(\d+\.?\d*\w?) /gm)[0]?.trim() ?? '');
    let hentai = false;
    for (let title of $('.post-content_item:contains("Alternative") .summary-content', panel).text().trim().split('/')) {
        titles.push(decodeHTMLEntity(title.trim()));
    }
    const arrayTags = [];
    for (const tag of $('a[href*=manga-genre]', panel).toArray()) {
        const label = $(tag).text();
        const id = $(tag).attr('href')?.split("/").slice(-2, -1)[0] ?? label;
        if (['Hentai'].includes(label) || ['Erotique'].includes(label) || ['Mature'].includes(label)) {
            hentai = true;
        }
        arrayTags.push({ id, label });
    }
    const tags = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.length > 0 ? arrayTags.map(x => createTag(x)) : [] })];
    let status = paperback_extensions_common_1.MangaStatus.UNKNOWN;
    switch ($('.post-content_item:contains("Status") .summary-content', panel).text().trim()) {
        case "Terminé":
            status = paperback_extensions_common_1.MangaStatus.COMPLETED;
            break;
        case "En cours":
            status = paperback_extensions_common_1.MangaStatus.ONGOING;
            break;
    }
    let desc = decodeHTMLEntity($('.container .summary__content').text().trim());
    return createManga({
        id: mangaId,
        titles,
        image,
        author,
        artist,
        rating,
        views,
        status,
        tags,
        desc,
        hentai
    });
};
exports.parseCrunchyScanDetails = parseCrunchyScanDetails;
///////////////////////////////
/////    CHAPTERS LIST    /////
///////////////////////////////
const parseCrunchyScanChapters = ($, mangaId) => {
    const chapters = [];
    for (let chapter of $('.main .wp-manga-chapter').toArray()) {
        const id = $('a', chapter).attr('href') + "?style=list" ?? '';
        const name = $('a', chapter).text().trim().split('-')[1]?.trim();
        const chapNum = Number($('a', chapter).text().trim().split('-')[0]?.trim().split(' ')[1]?.trim());
        const time = parseDate($('.chapter-release-date i', chapter).text().trim());
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
exports.parseCrunchyScanChapters = parseCrunchyScanChapters;
//////////////////////////////////
/////    CHAPTERS DETAILS    /////
//////////////////////////////////
const parseCrunchyScanChapterDetails = (data, mangaId, chapterId) => {
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
exports.parseCrunchyScanChapterDetails = parseCrunchyScanChapterDetails;
////////////////////////
/////    SEARCH    /////
////////////////////////
const parseSearch = ($) => {
    const manga = [];
    for (const item of $('.row .c-tabs-item__content').toArray()) {
        const id = $('h3 a', item).attr('href')?.split('/')[4] ?? '';
        const title = decodeHTMLEntity($('h3 a', item).text()) ?? '';
        const image = getURLImage($, item);
        const subtitle = '';
        if (typeof id === 'undefined' || typeof image === 'undefined')
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
/////////////////////
/////    HOT    /////
/////////////////////
const parseHotManga = ($) => {
    const hotManga = [];
    for (const item of $('.wrap #manga-slider-3 .slider__item').toArray()) {
        let id = $('h4 a', item).attr('href')?.split("/").slice(-2, -1)[0];
        let image = encodeURI($('img', item).attr('src') ?? "");
        let title = $('h4 a', item).text().trim();
        if (typeof id === 'undefined' || typeof image === 'undefined')
            continue;
        hotManga.push(createMangaTile({
            id,
            image,
            title: createIconText({ text: title })
        }));
    }
    return hotManga;
};
////////////////////////////////
/////    LATEST UPDATED    /////
////////////////////////////////
const parseLatestUpdatedManga = ($) => {
    const latestUpdatedManga = [];
    for (const item of $('.page-content-listing.item-default .page-item-detail.manga').toArray()) {
        let id = $('h3 a', item).attr('href')?.split("/").slice(-2, -1)[0];
        let image = getURLImage($, item);
        let title = decodeHTMLEntity($('h3 a', item).text().trim());
        let subtitle = $('.chapter-item .chapter.font-meta', item).eq(0).text().trim();
        if (typeof id === 'undefined' || typeof image === 'undefined')
            continue;
        latestUpdatedManga.push(createMangaTile({
            id,
            image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle })
        }));
    }
    return latestUpdatedManga;
};
////////////////////////
/////    TRENDS    /////
////////////////////////
const parseTrendsManga = ($) => {
    const trendsManga = [];
    for (const item of $('#manga-recent-3 .popular-item-wrap').toArray()) {
        let id = $('h5 a', item).attr('href')?.split("/").slice(-2, -1)[0];
        let image = getURLImage($, item).replace('-75x106', '-175x238');
        let title = $('h5 a', item).text().trim();
        let subtitle = $('.chapter-item .chapter.font-meta', item).eq(0).text().trim();
        if (typeof id === 'undefined' || typeof image === 'undefined')
            continue;
        trendsManga.push(createMangaTile({
            id,
            image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle })
        }));
    }
    return trendsManga;
};
//////////////////////////////
/////    HOME SECTION    /////
//////////////////////////////
const parseHomeSections = ($, sections, sectionCallback) => {
    for (const section of sections)
        sectionCallback(section);
    const hotManga = parseHotManga($);
    const latestUpdatedManga = parseLatestUpdatedManga($);
    const trendsManga = parseTrendsManga($);
    sections[0].items = hotManga;
    sections[1].items = latestUpdatedManga;
    sections[2].items = trendsManga;
    for (const section of sections)
        sectionCallback(section);
};
exports.parseHomeSections = parseHomeSections;
///////////////////////////
/////    VIEW MORE    /////
///////////////////////////
const parseViewMore = ($) => {
    const viewMore = [];
    for (const item of $('.page-content-listing.item-default .page-item-detail.manga').toArray()) {
        let id = $('h3 a', item).attr('href')?.split("/").slice(-2, -1)[0];
        let image = getURLImage($, item);
        let title = decodeHTMLEntity($('h3 a', item).text().trim());
        let subtitle = $('.chapter-item .chapter', item).eq(0).text().trim();
        if (typeof id === 'undefined' || typeof image === 'undefined')
            continue;
        viewMore.push(createMangaTile({
            id,
            image,
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
    return $('.page-content-listing.item-default .page-item-detail.manga').length == 0;
};
exports.isLastPage = isLastPage;
//////////////////////
/////    TAGS    /////
//////////////////////
const parseTags = ($) => {
    const arrayGenres = [];
    const arrayGenresConditions = [];
    const arrayAdultContent = [];
    const arrayStatutManga = [];
    const arrayTypeManga = [];
    // Genres
    for (let item of $('#search-advanced .checkbox-group .checkbox').toArray()) {
        let id = $('input', item).attr('value') ?? '';
        let label = decodeHTMLEntity($('label', item).text().trim());
        arrayGenres.push({ id, label });
    }
    // Genres Conditions
    for (let item of $('#search-advanced .form-group .form-control').eq(0).children().toArray()) {
        let id = $(item).attr('value') ?? '';
        let label = decodeHTMLEntity($(item).text().trim());
        arrayGenresConditions.push({ id, label });
    }
    // Adult Content
    for (let item of $('#search-advanced .form-group .form-control').eq(2).children().toArray()) {
        let id = $(item).attr('value') ?? '';
        let label = decodeHTMLEntity($(item).text().trim());
        arrayAdultContent.push({ id, label });
    }
    // Statut
    for (let item of $('#search-advanced .form-group').eq(4).children('.checkbox-inline').toArray()) {
        let id = $('input', item).attr('value') ?? '';
        let label = decodeHTMLEntity($('label', item).text().trim());
        arrayStatutManga.push({ id, label });
    }
    // Type
    for (let item of $('#search-advanced .form-group .form-control').eq(3).children().toArray()) {
        let id = $(item).attr('value') ?? '';
        let label = decodeHTMLEntity($(item).text().trim());
        arrayTypeManga.push({ id, label });
    }
    return [
        createTagSection({ id: '0', label: 'Genres', tags: arrayGenres.map(x => createTag(x)) }),
        createTagSection({ id: '1', label: 'Genres Conditions', tags: arrayGenresConditions.map(x => createTag(x)) }),
        createTagSection({ id: '2', label: 'Contenu pour adulte', tags: arrayAdultContent.map(x => createTag(x)) }),
        createTagSection({ id: '3', label: 'Statut', tags: arrayStatutManga.map(x => createTag(x)) }),
        createTagSection({ id: '4', label: 'Type', tags: arrayTypeManga.map(x => createTag(x)) })
    ];
};
exports.parseTags = parseTags;
const parseUpdatedManga = ($, time, ids) => {
    const manga = [];
    let loadMore = true;
    for (const item of $('.page-content-listing.item-default .page-item-detail.manga').toArray()) {
        let id = $('h3 a', item).attr('href')?.split('/').slice(-2, -1)[0];
        let mangaTime = parseDate($('.post-on.font-meta', item).eq(0).text() ?? '');
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
    return str.replace(/&#(\d+);/g, function (_match, dec) {
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
exports.parseDate = parseDate;
function convertNbViews(str) {
    let views = undefined;
    let number = parseInt((str.match(/(\d+\.?\d?)/gm) ?? "")[0]);
    let unit = (str.match(/[a-zA-Z]/gm) ?? "")[0];
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
function getURLImage($, item) {
    let image = undefined;
    if ($('img', item).attr('srcset') != undefined) {
        image = encodeURI((($('img', item).attr('srcset') ?? "").split(',').pop() ?? "").trim().split(' ')[0].replace(/-[1,3](\w){2}x(\w){3}[.]{1}/gm, '.'));
    }
    else if ($('img', item).attr('data-srcset') != undefined) {
        image = encodeURI((($('img', item).attr('data-srcset') ?? "").split(',').pop() ?? "").trim().split(' ')[0].replace(/-[1,3](\w){2}x(\w){3}[.]{1}/gm, '.'));
    }
    else if ($('img', item).attr('data-src') != undefined) {
        image = encodeURI(($('img', item).attr('data-src') ?? "").trim().replace(/-[1,3](\w){2}x(\w){3}[.]{1}/gm, '.'));
    }
    else {
        image = encodeURI(($('img', item).attr('src') ?? "").trim().replace(/-[75]+x(\w)+[.]{1}/gm, '.'));
    }
    return image;
}

},{"paperback-extensions-common":5}],51:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverSettingsMenu = void 0;
const Common_1 = require("./Common");
const serverSettingsMenu = (stateManager) => {
    return createNavigationButton({
        id: "server_settings",
        value: "",
        label: "Server Settings",
        form: createForm({
            onSubmit: async (values) => Common_1.setStateData(stateManager, values),
            validate: async () => true,
            sections: async () => [
                createSection({
                    id: "information",
                    header: undefined,
                    rows: async () => [
                        createMultilineLabel({
                            label: "Scrap Server",
                            value: "Download and deploy the project :\n\nhttps://github.com/Moomooo95/shadow-of-babel\n\nRead README.md to know how to deploy the server.\n\nNote: The use of this server is MANDATORY otherwise the images of the chapters cannot be recovered",
                            id: "description",
                        }),
                    ],
                }),
                createSection({
                    id: "serverSettings",
                    header: "Server Settings",
                    footer: undefined,
                    rows: async () => Common_1.retrieveStateData(stateManager).then((values) => [
                        createInputField({
                            id: "serverAddress",
                            label: "Server URL",
                            placeholder: "http://127.0.0.1:3000",
                            value: values.serverURL,
                            maskInput: false,
                        }),
                    ]),
                }),
            ],
        }),
    });
};
exports.serverSettingsMenu = serverSettingsMenu;

},{"./Common":48}]},{},[49])(49)
});
