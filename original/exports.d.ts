import { Books, MapStyle, SuccessCallback, Volume } from "./types";

// breadcrumbs.ts
export declare function configureBreadcrumbs(
    volumeId?: number,
    bookId?: number,
    chapter?: number
): void;

// chapter.ts
export declare function navigateChapter(bookId: number, chapter: number): void;

// constants.ts
export declare const DARK_MAP_BACKGROUND: string;
export declare const DARK_MAP_ID: string;
export declare const DARK_MAP_STYLE: MapStyle[];
export declare const LIGHT_MAP_BACKGROUND: string;
export declare const LIGHT_MAP_ID: string;
export declare const LIGHT_MAP_STYLE: MapStyle[];

// html.ts
export declare const TAG_DIV: string;
export declare const TAG_HEADER5: string;
export declare const TAG_HYPERLINK: string;
export declare const TAG_I: string;
export declare const TAG_LIST_ITEM: string;
export declare const TAG_UNORDERED_LIST: string;

export declare function decodeEntities(text: string): string;
export declare function decorateNode(node: HTMLElement, clazz?: string, id?: string): void;
export declare function domNode(
    tag: string,
    clazz?: string,
    id?: string,
    textContent?: string
): HTMLElement;
export declare function hyperlinkNode(
    href: string,
    title?: string,
    clazz?: string,
    id?: string
): HTMLAnchorElement;
export declare function replaceNodeContent(node: Node, newChild: Node): void;

// mapHelper.ts
export declare function mapInit(): Promise<void>;
export declare function showLocation(lat: number, lng: number, viewAltitude: number): void;
export declare function setupMarkers(): void;

// mapScripApi.ts
export declare const books: Books;
export declare const volumes: Volume[];

export declare function apiInit(callback: () => void): void;
export declare function requestChapterText(
    bookId: number,
    chapter: number,
    success: SuccessCallback,
    failure: () => void
): void;
export declare function volumeIdIsValid(volumeId: number): boolean;

// navigation.ts
export declare function onHashChanged(): void;

// scriptures.ts
export declare function init(callback: () => void): void;
export declare function panAndZoom(lat: number, lng: number, viewAltitude: number): void;
