/*======================================================================
 * FILE:    ServerApi.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2025
 *
 * DESCRIPTION: Custom hook for fetching data from the
 *              scriptures.byu.edu server.
 */
/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import { useEffect, useState } from "react";
import { Book, Books, Volume } from "./Types";

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
const encodedScripturesUrl = function (
    bookId: number,
    chapter: number,
    verses?: string,
    isJst?: boolean
): string {
    if (bookId !== undefined && chapter !== undefined) {
        let options = "";

        if (verses !== undefined) {
            options += verses;
        }

        if (isJst !== undefined) {
            options += "&jst=JST";
        }

        return `${URL_SCRIPTURES}?book=${bookId}&chap=${chapter}&verses${options}`;
    }

    return "";
};

/*----------------------------------------------------------------------
 *                      PUBLIC HOOKS
 */
export const useFetchScripturesData = function () {
    const [books, setBooks] = useState({} as Books);
    const [isLoading, setIsLoading] = useState(true);
    const [volumes, setVolumes] = useState(Array<Volume>());

    useEffect(
        function () {
            if (volumes.length > 0 && Object.keys(books).length > 0) {
                // We have both volumes and books from the server, so here we
                // build an array of books for each volume so it's easy to get
                // the books when we have a volume object.  This is helpful,
                // for example, when building the navigation grid of books for
                // a given volume.

                volumes.forEach(function (volume) {
                    const volumeBooks: Book[] = [];
                    let bookId = volume.minBookId;

                    while (bookId <= volume.maxBookId) {
                        volumeBooks.push(books[bookId]);
                        bookId += 1;
                    }

                    volume.books = volumeBooks;
                });

                Object.freeze(books);
                Object.freeze(volumes);
                setIsLoading(false);
            }
        },
        [books, volumes, setIsLoading]
    );

    useEffect(() => {
        const replaceEntities = (text: string) =>
            text.replaceAll("&mdash;", "—").replaceAll("&amp;", "&");

        const conditionallyReplace = (obj: { [key: string]: unknown }, props: string[]) => {
            props.forEach((prop) => {
                const property = obj[prop];

                if (typeof property === "string") {
                    if (property.includes("&")) {
                        obj[prop] = replaceEntities(property);
                    }
                }
            });
        };

        const replaceHtmlEntities = function (volumesData: Volume[], booksData: Books) {
            volumesData.forEach((volume) => {
                conditionallyReplace(volume, ["citeAbbr"]);
            });

            Object.keys(booksData).forEach((bookId) => {
                conditionallyReplace(booksData[bookId], [
                    "backName",
                    "citeAbbr",
                    "citeFull",
                    "fullName",
                    "gridName",
                    "subdiv",
                    "tocName"
                ]);
            });
        };

        Promise.all(
            [URL_VOLUMES, URL_BOOKS].map((url) => fetch(url).then((response) => response.json()))
        ).then(([jsonVolumes, jsonBooks]) => {
            if (jsonVolumes !== undefined && jsonBooks !== undefined) {
                replaceHtmlEntities(jsonVolumes, jsonBooks);
                setVolumes(jsonVolumes as Volume[]);
                setBooks(jsonBooks as Books);
            }
        });
    }, [setBooks, setVolumes]);

    return { books, isLoading, volumes };
};

/*----------------------------------------------------------------------
 *                      PUBLIC FUNCTIONS
 */
export const fetchChapterHtml = async function (bookId: number, chapter: number) {
    return fetch(encodedScripturesUrl(bookId, chapter)).then((response) => response.text());
};

// NEEDSWORK: figure this out
// export const volumeIdIsValid = function (volumeId: number): boolean {
//     return volumes.map((volume) => volume.id).includes(volumeId);
// };
