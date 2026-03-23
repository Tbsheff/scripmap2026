/*======================================================================
 * FILE:    NextPreviousComponent.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2026
 *
 * DESCRIPTION: Component to handle next/previous chapter navigation.
 */

/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import { memo, ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import {
    ANIMATION_KEY_NEXT,
    ANIMATION_KEY_PREVIOUS,
    ICON_NEXT,
    ICON_NEXT_SMALL,
    ICON_PREVIOUS,
    ICON_PREVIOUS_SMALL
} from "../Constants";
import { Book, Books } from "../Types";
import "./NextPreviousComponent.css";
import { useScripturesDataContext } from "../context/ScripturesDataContextHook";
import { chapterDataCache } from "./ChapterLoader";
import extractGeoplaces from "./MapHelper";
import { fetchChapterHtml } from "../ServerApi";

/*----------------------------------------------------------------------
 *                      CONSTANTS
 */
const NEXT_STATE = { animationKey: ANIMATION_KEY_NEXT };
const PREV_STATE = { animationKey: ANIMATION_KEY_PREVIOUS };

/*----------------------------------------------------------------------
 *                      PRIVATE TYPES
 */
interface NextPreviousParameters {
    volumeId: number;
    bookId: number;
    chapter: number;
    title: string;
}

/*----------------------------------------------------------------------
 *                      PRIVATE HELPERS
 */

function chapterNavigationNode(
    { volumeId, bookId, chapter, title }: NextPreviousParameters,
    icon: ReactNode,
    textBefore: string,
    textAfter: string
) {
    const isNext = icon === ICON_NEXT || icon === ICON_NEXT_SMALL;

    return (
        <Link
            to={`/${volumeId}/${bookId}/${chapter}`}
            key={`np${bookId}-${chapter}`}
            title={title}
            aria-label={title}
            state={isNext ? NEXT_STATE : PREV_STATE}
            onMouseEnter={() => {
                const key = `${bookId}:${chapter}`;
                if (!chapterDataCache.has(key)) {
                    void fetchChapterHtml(bookId, chapter).then((html) => {
                        if (html) {
                            chapterDataCache.set(key, { html, geoplaces: extractGeoplaces(html) });
                        }
                    }).catch(() => {});
                }
            }}
        >
            {textBefore !== "" ? <div className="nav-text">{textBefore}</div> : null}
            <div className="icon waves-effect">{icon}</div>
            {textAfter !== "" ? <div className="nav-text">{textAfter}</div> : null}
        </Link>
    );
}

export function nextChapter(bookId: number, chapter: number, books: Books): NextPreviousParameters {
    const book = books[bookId];

    if (book !== undefined) {
        if (chapter < book.numChapters) {
            return {
                volumeId: book.parentBookId,
                bookId,
                chapter: chapter + 1,
                title: titleForBookChapter(book, chapter + 1)
            };
        }

        const nextBook = books[bookId + 1];

        if (nextBook !== undefined) {
            let nextChapterValue = 0;

            if (nextBook.numChapters > 0) {
                nextChapterValue = 1;
            }

            return {
                volumeId: nextBook.parentBookId,
                bookId: nextBook.id,
                chapter: nextChapterValue,
                title: titleForBookChapter(nextBook, nextChapterValue)
            };
        }
    }

    return { volumeId: 0, bookId: 0, chapter: 0, title: "" };
}

function nextMarkup(
    nextParameters: NextPreviousParameters,
    textBefore: string = "",
    textAfter: string = "",
    useSmall: boolean = false
) {
    return nextParameters.bookId > 0
        ? chapterNavigationNode(
              nextParameters,
              useSmall ? ICON_NEXT_SMALL : ICON_NEXT,
              textBefore,
              textAfter
          )
        : null;
}

export function previousChapter(bookId: number, chapter: number, books: Books): NextPreviousParameters {
    const book = books[bookId];

    if (book !== undefined) {
        if (chapter > 1) {
            return {
                volumeId: book.parentBookId,
                bookId,
                chapter: chapter - 1,
                title: titleForBookChapter(book, chapter - 1)
            };
        }

        const previousBook = books[bookId - 1];

        if (previousBook !== undefined) {
            // "Previous" is last chapter of previous book
            return {
                volumeId: previousBook.parentBookId,
                bookId: previousBook.id,
                chapter: previousBook.numChapters,
                title: titleForBookChapter(previousBook, previousBook.numChapters)
            };
        }
    }

    // There is no previous chapter
    return { volumeId: 0, bookId: 0, chapter: 0, title: "" };
}

function previousMarkup(
    previousParameters: NextPreviousParameters,
    textBefore = "",
    textAfter = "",
    useSmall: boolean = false
) {
    return previousParameters.bookId > 0
        ? chapterNavigationNode(
              previousParameters,
              useSmall ? ICON_PREVIOUS_SMALL : ICON_PREVIOUS,
              textBefore,
              textAfter
          )
        : null;
}

export function titleForBookChapter(book: Book, chapter: number): string {
    if (chapter > 0) {
        return `${book.tocName} ${chapter}`;
    }

    return book.tocName;
}

/*----------------------------------------------------------------------
 *                      COMPONENTS
 */
export default function NextPreviousComponent() {
    const { books } = useScripturesDataContext();
    const { bookId, chapter } = useParams();

    return (
        <div className="next-prev-wrapper">
            <div className="previous-link">
                {previousMarkup(
                    previousChapter(Number(bookId), Number(chapter), books),
                    "",
                    "Previous",
                    true
                )}
            </div>
            <div className="next-link">
                {nextMarkup(nextChapter(Number(bookId), Number(chapter), books), "Next", "", true)}
            </div>
        </div>
    );
}

export const PreviousSideComponent = memo(function PreviousSideComponent({ bookId, chapter }: { bookId?: string; chapter?: string }) {
    const { books } = useScripturesDataContext();

    return (
        <div className="nav-previous">
            {previousMarkup(previousChapter(Number(bookId), Number(chapter), books))}
        </div>
    );
});

export const NextSideComponent = memo(function NextSideComponent({ bookId, chapter }: { bookId?: string; chapter?: string }) {
    const { books } = useScripturesDataContext();

    return (
        <div className="nav-next">
            {nextMarkup(nextChapter(Number(bookId), Number(chapter), books))}
        </div>
    );
});
