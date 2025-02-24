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

export interface GeoPlace {
    latitude: number;
    longitude: number;
    placename: string;
    viewAltitude: number;
}

export interface GeoPlaces {
    [key: string]: GeoPlace;
}

export interface MapStyle {
    featureType?: string;
    elementType: string;
    stylers: { color: string }[];
}

export type NextPreviousTuple = [number, number, string];
export type NextPreviousParameters = NextPreviousTuple | null;

export interface Position {
    lat: number;
    lng: number;
}

export type SuccessCallback = (text: Promise<string>) => void;

export interface Volume extends Book {
    minBookId: number;
    maxBookId: number;
    books: Book[];
}
