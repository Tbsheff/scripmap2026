/*======================================================================
 * FILE:    ServerApi.ts
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2026
 *
 * DESCRIPTION: Custom hook for fetching data from the
 *              scriptures.byu.edu server.
 */
/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import { useEffect, useState } from "react";
import { Book, Books, Volume } from "./Types";
import { replaceHtmlEntities } from "./scripturesUtils";
import { initSlugMaps } from "./utils/scriptureNavigation";

/*----------------------------------------------------------------------
 *                      CONSTANTS
 */
const URL_BASE = "https://scriptures.byu.edu/mapscrip/";
const URL_BOOKS = `${URL_BASE}model/books.php`;
const URL_SCRIPTURES = `${URL_BASE}mapgetscrip2.php`;
const URL_VOLUMES = `${URL_BASE}model/volumes.php`;

/*----------------------------------------------------------------------
 *                      PRIVATE FUNCTIONS
 */
function encodedScripturesUrl(
    bookId: number,
    chapter: number,
    verses?: string,
    isJst?: boolean
): string {
    let options = "";

    if (verses !== undefined) {
        options += verses;
    }

    if (isJst !== undefined) {
        options += "&jst=JST";
    }

    return `${URL_SCRIPTURES}?book=${bookId}&chap=${chapter}&verses${options}`;
}

let dataPromise: Promise<{ volumes: Volume[]; books: Books }> | null = null;

/*----------------------------------------------------------------------
 *                      PUBLIC FUNCTIONS
 */
export function getScripturesData(): Promise<{ volumes: Volume[]; books: Books }> {
    if (!dataPromise) {
        dataPromise = Promise.all([
            fetch(URL_VOLUMES).then((r) => {
                if (!r.ok) throw new Error(`Failed to fetch ${URL_VOLUMES}: ${r.status}`);
                return r.json() as Promise<unknown>;
            }),
            fetch(URL_BOOKS).then((r) => {
                if (!r.ok) throw new Error(`Failed to fetch ${URL_BOOKS}: ${r.status}`);
                return r.json() as Promise<unknown>;
            }),
        ]).then(([rawVolumes, rawBooks]) => {
            if (
                !Array.isArray(rawVolumes) ||
                typeof (rawVolumes[0] as Record<string, unknown> | undefined)?.id !== "number" ||
                typeof rawBooks !== "object" ||
                rawBooks === null
            ) {
                throw new Error("Unexpected API response shape from scriptures server");
            }

            const stripTrailingSlash = (s: string) => s.replace(/\/+$/, "");

            const jsonVolumes = rawVolumes as Volume[];
            const jsonBooks = rawBooks as Books;

            replaceHtmlEntities(jsonVolumes, jsonBooks);

            for (const book of Object.values(jsonBooks)) {
                book.urlPath = stripTrailingSlash(book.urlPath);
            }

            for (const volume of jsonVolumes) {
                volume.urlPath = stripTrailingSlash(volume.urlPath);
            }

            const enrichedVolumes = jsonVolumes.map((volume: Volume) => {
                const volumeBooks: Book[] = [];
                let bookId = volume.minBookId;

                while (bookId <= volume.maxBookId) {
                    const book = jsonBooks[bookId];

                    if (book) {
                        volumeBooks.push(book);
                    }

                    bookId += 1;
                }

                return { ...volume, books: volumeBooks };
            });

            Object.freeze(jsonBooks);
            Object.freeze(enrichedVolumes);
            initSlugMaps(enrichedVolumes, jsonBooks);

            return { volumes: enrichedVolumes, books: jsonBooks };
        });
    }

    return dataPromise;
}

/*----------------------------------------------------------------------
 *                      PUBLIC HOOKS
 */
export function useFetchScripturesData() {
    const [books, setBooks] = useState<Books>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [volumes, setVolumes] = useState<Volume[]>([]);

    useEffect(() => {
        getScripturesData()
            .then(({ volumes, books }) => {
                setVolumes(volumes);
                setBooks(books);
                setIsLoading(false);
            })
            .catch((err: unknown) => {
                console.error("Error loading scriptures data:", err);
                setError("Failed to load scripture data. Please refresh the page.");
                setIsLoading(false);
            });
    }, []);

    return { books, error, isLoading, volumes };
}

/*----------------------------------------------------------------------
 *                      PUBLIC FUNCTIONS
 */
export async function fetchChapterHtml(bookId: number, chapter: number, signal?: AbortSignal) {
    const response = await fetch(encodedScripturesUrl(bookId, chapter), { signal });

    if (!response.ok) {
        throw new Error(`Failed to fetch chapter: ${response.status}`);
    }

    return response.text();
}
