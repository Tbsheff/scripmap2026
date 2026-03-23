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

/*----------------------------------------------------------------------
 *                      PUBLIC HOOKS
 */
export function useFetchScripturesData() {
    const [books, setBooks] = useState<Books>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [volumes, setVolumes] = useState<Volume[]>([]);

    useEffect(() => {
        const controller = new AbortController();

        Promise.all(
            [URL_VOLUMES, URL_BOOKS].map((url) =>
                fetch(url, { signal: controller.signal }).then((response) => {
                    if (!response.ok) {
                        throw new Error(`Failed to fetch ${url}: ${response.status}`);
                    }
                    return response.json() as Promise<unknown>;
                })
            )
        )
            .then(([rawVolumes, rawBooks]) => {
                if (
                    !Array.isArray(rawVolumes) ||
                    typeof (rawVolumes[0] as Record<string, unknown> | undefined)?.id !==
                        "number" ||
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

                // Build an array of books for each volume so it's easy to get
                // the books when we have a volume object.  This is helpful,
                // for example, when building the navigation grid of books for
                // a given volume.
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
                setVolumes(enrichedVolumes);
                setBooks(jsonBooks);
                initSlugMaps(enrichedVolumes, jsonBooks);
                setIsLoading(false);
            })
            .catch((err: unknown) => {
                if (err instanceof Error && err.name === "AbortError") {
                    return;
                }
                console.error("Error loading scriptures data:", err);
                setError("Failed to load scripture data. Please refresh the page.");
                setIsLoading(false);
            });

        return () => {
            controller.abort();
        };
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
