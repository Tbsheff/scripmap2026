/*======================================================================
 * FILE:    NextPreviousComponent.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2025
 *
 * DESCRIPTION: Component to handle next/previous chapter navigation.
 */

/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import { ReactNode } from "react";
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

const chapterNavigationNode = function (
    { volumeId, bookId, chapter, title }: NextPreviousParameters,
    icon: ReactNode,
    textBefore: string,
    textAfter: string
) {
    const animationKey =
        icon === ICON_NEXT || icon === ICON_NEXT_SMALL
            ? ANIMATION_KEY_NEXT
            : ANIMATION_KEY_PREVIOUS;

    return (
        <Link
            to={`/${volumeId}/${bookId}/${chapter}`}
            key={`np{bookId}-${chapter}`}
            title={title}
            state={{
                animationKey
            }}
        >
            {textBefore !== "" ? <div className="nav-text">{textBefore}</div> : null}
            <div className="icon waves-effect">{icon}</div>
            {textAfter !== "" ? <div className="nav-text">{textAfter}</div> : null}
        </Link>
    );
};

const nextChapter = function (
    bookId: number,
    chapter: number,
    books: Books
): NextPreviousParameters {
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
};

const nextMarkup = function (
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
};

const previousChapter = function (
    bookId: number,
    chapter: number,
    books: Books
): NextPreviousParameters {
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
};

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

const titleForBookChapter = function (book: Book, chapter: number): string {
    if (book !== undefined) {
        if (chapter > 0) {
            return `${book.tocName} ${chapter}`;
        }

        return book.tocName;
    }

    return "";
};

/*----------------------------------------------------------------------
 *                      COMPONENT
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
