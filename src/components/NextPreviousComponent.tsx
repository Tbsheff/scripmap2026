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
import { Book, Books, Volume } from "../Types";

/*----------------------------------------------------------------------
 *                      PRIVATE TYPES
 */
interface NextPreviousParameters {
    volumeSlug: string;
    bookSlug: string;
    bookId: number;
    chapter: number;
    title: string;
}

export function nextChapter(bookId: number, chapter: number, books: Books, volumes: Volume[]): NextPreviousParameters {
    const book = books[bookId];

    if (book !== undefined) {
        if (chapter < book.numChapters) {
            const volume = volumes.find((v) => v.id === book.parentBookId);

            return {
                volumeSlug: volume?.urlPath ?? "",
                bookSlug: book.urlPath,
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

            const nextVolume = volumes.find((v) => v.id === nextBook.parentBookId);

            return {
                volumeSlug: nextVolume?.urlPath ?? "",
                bookSlug: nextBook.urlPath,
                bookId: nextBook.id,
                chapter: nextChapterValue,
                title: titleForBookChapter(nextBook, nextChapterValue)
            };
        }
    }

    return { volumeSlug: "", bookSlug: "", bookId: 0, chapter: 0, title: "" };
}

export function previousChapter(bookId: number, chapter: number, books: Books, volumes: Volume[]): NextPreviousParameters {
    const book = books[bookId];

    if (book !== undefined) {
        if (chapter > 1) {
            const volume = volumes.find((v) => v.id === book.parentBookId);

            return {
                volumeSlug: volume?.urlPath ?? "",
                bookSlug: book.urlPath,
                bookId,
                chapter: chapter - 1,
                title: titleForBookChapter(book, chapter - 1)
            };
        }

        const previousBook = books[bookId - 1];

        if (previousBook !== undefined) {
            const prevVolume = volumes.find((v) => v.id === previousBook.parentBookId);

            return {
                volumeSlug: prevVolume?.urlPath ?? "",
                bookSlug: previousBook.urlPath,
                bookId: previousBook.id,
                chapter: previousBook.numChapters,
                title: titleForBookChapter(previousBook, previousBook.numChapters)
            };
        }
    }

    return { volumeSlug: "", bookSlug: "", bookId: 0, chapter: 0, title: "" };
}

export function titleForBookChapter(book: Book, chapter: number): string {
    if (chapter > 0) {
        return `${book.tocName} ${chapter}`;
    }

    return book.tocName;
}

