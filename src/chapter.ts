/*========================================================================
 * FILE:    chapter.js
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2025
 *
 * DESCRIPTION: Module for managing chapter text
 */

/*------------------------------------------------------------------------
 *                      IMPORTS
 */
import { configureBreadcrumbs } from "./breadcrumbs.js";
import { domNode, hyperlinkNode, replaceNodeContent, TAG_DIV, TAG_I } from "./html.js";
import { setupMarkers } from "./mapHelper.js";
import { books, requestChapterText } from "./mapScripApi.js";
import { navElement } from "./scriptures.js";
import { Book, NextPreviousParameters } from "./types.js";

/*------------------------------------------------------------------------
 *                      CONSTANTS
 */
const CLASS_ICON = "material-icons";
const CLASS_NAV_HEADING = "navheading";
const CLASS_NEXT_PREV = "nextprev";
const ICON_NEXT = "skip_next";
const ICON_PREVIOUS = "skip_previous";

/*------------------------------------------------------------------------
 *                      PRIVATE VARIABLES
 */
let requestedBookId: number;
let requestedChapter: number;

/*------------------------------------------------------------------------
 *                      PRIVATE FUNCTIONS
 */
const chapterNavigationNode = function (
    parameters: NextPreviousParameters,
    icon: string
): HTMLElement {
    // Build a node for next/previous chapter navigation

    if (parameters) {
        const [bookId, chapter, title] = parameters;
        const node = hyperlinkNode(`#0:${bookId}:${chapter}`, title);

        node.appendChild(domNode(TAG_I, CLASS_ICON, undefined, icon));

        return node;
    }

    return domNode(TAG_DIV);
};

const getScripturesFailure = function (): void {
    replaceNodeContent(navElement, document.createTextNode("Unable to retrieve chapter contents."));
};

const getScripturesSuccess = async function (chapterHtml: Promise<string>): Promise<void> {
    navElement.innerHTML = await chapterHtml;

    injectNextPrevious();
    configureBreadcrumbs(0, requestedBookId, requestedChapter);
    setupMarkers();
};

const injectNextPrevious = function (): void {
    // Find next/previous chapter information and add buttons to
    // any "navheading" elements for next/previous chapter navigation

    const previousParameters = previousChapter(requestedBookId, requestedChapter);
    const nextParameters = nextChapter(requestedBookId, requestedChapter);
    const navheadingNodes = Array.from(document.getElementsByClassName(CLASS_NAV_HEADING));

    navheadingNodes.forEach((element) => {
        element.appendChild(nextPreviousNode(previousParameters, nextParameters));
    });
};

const nextChapter = function (bookId: number, chapter: number): NextPreviousParameters {
    let book = books[bookId];

    if (book !== undefined) {
        if (chapter < book.numChapters) {
            // This is the easy case: just add one to the current chapter
            return [bookId, chapter + 1, titleForBookChapter(book, chapter + 1)];
        }

        let nextBook = books[bookId + 1];

        if (nextBook !== undefined) {
            // "Next" is first chapter of next book
            let nextChapterValue = 0;

            if (nextBook.numChapters > 0) {
                nextChapterValue = 1;
            }

            return [nextBook.id, nextChapterValue, titleForBookChapter(nextBook, nextChapterValue)];
        }
    }

    // There is no next chapter
    return null;
};

const nextPreviousNode = function (
    previousParameters: NextPreviousParameters,
    nextParameters: NextPreviousParameters
) {
    const nextPreviousNode = domNode(TAG_DIV, CLASS_NEXT_PREV);

    if (Array.isArray(previousParameters) && previousParameters.length > 0) {
        nextPreviousNode.appendChild(chapterNavigationNode(previousParameters, ICON_PREVIOUS));
    }

    if (Array.isArray(nextParameters) && nextParameters.length > 0) {
        nextPreviousNode.appendChild(chapterNavigationNode(nextParameters, ICON_NEXT));
    }

    return nextPreviousNode;
};

const previousChapter = function (bookId: number, chapter: number): NextPreviousParameters {
    let book = books[bookId];

    if (chapter > 1) {
        return [bookId, chapter - 1, titleForBookChapter(book, chapter - 1)];
    }

    let previousBook = books[bookId - 1];

    if (previousBook !== undefined) {
        // "Previous" is last chapter of previous book
        return [
            previousBook.id,
            previousBook.numChapters,
            titleForBookChapter(previousBook, previousBook.numChapters)
        ];
    }

    // There is no previous chapter
    return null;
};

const titleForBookChapter = function (book: Book, chapter: number): string {
    if (book !== undefined) {
        if (chapter > 0) {
            return `${book.tocName} ${chapter}`;
        }

        return book.tocName;
    }

    return "";
};

/*------------------------------------------------------------------------
 *                      PUBLIC FUNCTIONS
 */
export const navigateChapter = function (bookId: number, chapter: number): void {
    requestedBookId = bookId;
    requestedChapter = chapter;

    requestChapterText(bookId, chapter, getScripturesSuccess, getScripturesFailure);
};
