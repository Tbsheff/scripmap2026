/*======================================================================
 * FILE:    Types.ts
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2025
 *
 * DESCRIPTION: Useful interfaces and other type expressions.
 */

/*----------------------------------------------------------------------
 *                      TYPES
 */
export interface Book {
    id: number;
    abbr: string;
    citeAbbr: string;
    fullName: string;
    numChapters: number;
    urlPath: string;
    parentBookId: number;
    webTitle: string;
    jstTitle: string;
    tocName: string;
    subdiv: string;
    backName: string;
    gridName: string;
    citeFull: string;
}

export interface Books {
    [key: string]: Book;
}

export interface ChapterCacheEntry {
    html: string;
    geoplaces: GeoPlaces;
}

export interface GeoPlace {
    latitude: number;
    longitude: number;
    placename: string;
    viewAltitude: number;
}

export interface GeoPlaces {
    [key: string]: GeoPlace;
}

export interface Volume extends Book {
    minBookId: number;
    maxBookId: number;
    books: Book[];
}


export type ScripturesContextType = {
    books: Books;
    focusedGeoplace: GeoPlace | null;
    geoplaces: GeoPlaces | null;
    isLoading: boolean;
    setFocusedGeoplace: (geoplace: GeoPlace | null) => void;
    setGeoplaces: (geoplaces: GeoPlaces | null) => void;
    volumes: Volume[];
};

export type ShowLocationFunction = (
    id: number,
    placename: string,
    latitude: number,
    longitude: number,
    viewAltitude: number,
    flag: string
) => void;

/*------------------------------------------------------------------------
 *                      TYPES FOR COMPONENT PROPS
 */
export interface VolumeProps {
    volume?: Volume;
}

export interface BookProps {
    book?: Book;
}
