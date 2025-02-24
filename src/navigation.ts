/*======================================================================
 * FILE:    navigation.ts
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2025
 *
 * DESCRIPTION: Module for managing navigation based on hash values.
 */

/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import { configureBreadcrumbs } from "./breadcrumbs.js";
import { navigateChapter } from "./chapter.js";
import {
    decodeEntities,
    decorateNode,
    domNode,
    hyperlinkNode,
    replaceNodeContent,
    TAG_DIV,
    TAG_HEADER5
} from "./html.js";
import { books, volumes, volumeIdIsValid } from "./mapScripApi.js";
import { navElement } from "./scriptures.js";
import { Book, Volume } from "./types.js";

/*------------------------------------------------------------------
 *                      CONSTANTS
 */
const CLASS_BOOKS = "books";
const CLASS_BUTTON = "waves-effect waves-custom waves-ripple btn";
const CLASS_CHAPTER = "chapter";
const CLASS_VOLUME = "volume";
const ID_SCRIPTURES_NAVIGATION = "scripnav";

/*------------------------------------------------------------------
 *                      PRIVATE METHODS
 */
const bookChapterValid = function (bookId: number, chapter: number): boolean {
    const book = books[bookId];

    if (book === undefined) {
        return false;
    }

    if (chapter === book.numChapters) {
        return true;
    }

    if (chapter >= 1 && chapter <= book.numChapters) {
        return Number.isInteger(chapter);
    }

    return false;
};

const buildBooksGrid = function (navigationNode: HTMLElement, volume: Volume): void {
    const gridContent = domNode(TAG_DIV, CLASS_BOOKS);

    volume.books.forEach((book) => {
        const hyperlink = hyperlinkNode(
            `#${volume.id}:${book.id}`,
            decodeEntities(book.fullName),
            CLASS_BUTTON,
            String(book.id)
        );

        hyperlink.appendChild(document.createTextNode(decodeEntities(book.gridName)));
        gridContent.appendChild(hyperlink);
    });

    navigationNode.appendChild(gridContent);
};

const buildChaptersGrid = function (navigationNode: HTMLElement, book: Book): void {
    const titleNode = domNode(TAG_HEADER5, undefined, undefined, book.fullName);
    const volumeNode = domNode(TAG_DIV, CLASS_VOLUME);
    const booksNode = domNode(TAG_DIV, CLASS_BOOKS);
    let chapter = 1;

    volumeNode.appendChild(titleNode);

    while (chapter <= book.numChapters) {
        const hyperlink = hyperlinkNode(`#0:${book.id}:${chapter}`);

        decorateNode(hyperlink, CLASS_BUTTON);
        hyperlink.classList.add(CLASS_CHAPTER);
        hyperlink.appendChild(document.createTextNode(String(chapter)));

        booksNode.appendChild(hyperlink);
        chapter += 1;
    }

    navigationNode.appendChild(titleNode);
    navigationNode.appendChild(booksNode);
};

const buildVolumesGrid = function (navigationNode: HTMLElement, volumeId?: number): void {
    volumes.forEach((volume) => {
        if (volumeId === undefined || volumeId === volume.id) {
            navigationNode.appendChild(volumeTitleNode(volume));
            buildBooksGrid(navigationNode, volume);
        }
    });
};

const hashParameters = function (): string[] {
    if (location.hash !== "" && location.hash.length > 1) {
        return location.hash.slice(1).split(":");
    }

    return [];
};

const navigateBook = function (bookId: number): void {
    const book = books[bookId];

    if (book.numChapters <= 1) {
        navigateChapter(bookId, book.numChapters);
    } else {
        const chaptersNavigationNode = domNode(TAG_DIV, undefined, ID_SCRIPTURES_NAVIGATION);

        buildChaptersGrid(chaptersNavigationNode, book);
        replaceNodeContent(navElement, chaptersNavigationNode);
        configureBreadcrumbs(book.parentBookId, bookId);
    }
};

const navigateHome = function (volumeId?: number): void {
    const scripturesNavigationNode = domNode(TAG_DIV, undefined, ID_SCRIPTURES_NAVIGATION);

    buildVolumesGrid(scripturesNavigationNode, volumeId);
    replaceNodeContent(navElement, scripturesNavigationNode);

    configureBreadcrumbs(volumeId);
};

const volumeTitleNode = function (volume: Volume): HTMLElement {
    const titleNode = domNode(TAG_DIV, CLASS_VOLUME);
    const hyperlink = hyperlinkNode(`#${volume.id}`, volume.fullName);
    const headerNode = domNode(TAG_HEADER5, undefined, undefined, volume.fullName);

    hyperlink.appendChild(headerNode);
    titleNode.appendChild(hyperlink);

    return titleNode;
};

/*------------------------------------------------------------------
 *                      PUBLIC METHODS
 */
export const onHashChanged = function () {
    let [volumeIdString, bookIdString, chapterString] = hashParameters();

    if (volumeIdString === undefined) {
        navigateHome();
    } else if (bookIdString === undefined) {
        const volumeId = Number(volumeIdString);

        if (volumeIdIsValid(volumeId)) {
            navigateHome(volumeId);
        } else {
            navigateHome();
        }
    } else {
        const bookId = Number(bookIdString);

        if (books[bookId] === undefined) {
            navigateHome();
        } else {
            if (chapterString === undefined) {
                navigateBook(bookId);
            } else {
                const chapter = Number(chapterString);

                if (bookChapterValid(bookId, chapter)) {
                    navigateChapter(bookId, chapter);
                } else {
                    navigateHome();
                }
            }
        }
    }
};
