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
import type { Book, Books, Volume } from "../Types";

/*----------------------------------------------------------------------
 *                      PRIVATE TYPES
 */
export interface NextPreviousParameters {
	volumeSlug: string;
	bookSlug: string;
	bookId: number;
	chapter: number;
	title: string;
}

export function nextChapter(bookId: number, chapter: number, books: Books, volumes: Volume[]): NextPreviousParameters | null {
	const book = books[bookId];

	if (book !== undefined) {
		if (chapter < book.numChapters) {
			const volume = volumes.find((v) => v.id === book.parentBookId);
			if (!volume) return null;

			return {
				volumeSlug: volume.urlPath,
				bookSlug: book.urlPath,
				bookId,
				chapter: chapter + 1,
				title: titleForBookChapter(book, chapter + 1),
			};
		}

		const nextBook = books[bookId + 1];

		if (nextBook !== undefined) {
			let nextChapterValue = 0;

			if (nextBook.numChapters > 0) {
				nextChapterValue = 1;
			}

			const nextVolume = volumes.find((v) => v.id === nextBook.parentBookId);
			if (!nextVolume) return null;

			return {
				volumeSlug: nextVolume.urlPath,
				bookSlug: nextBook.urlPath,
				bookId: nextBook.id,
				chapter: nextChapterValue,
				title: titleForBookChapter(nextBook, nextChapterValue),
			};
		}
	}

	return null;
}

export function previousChapter(
	bookId: number,
	chapter: number,
	books: Books,
	volumes: Volume[],
): NextPreviousParameters | null {
	const book = books[bookId];

	if (book !== undefined) {
		if (chapter > 1) {
			const volume = volumes.find((v) => v.id === book.parentBookId);
			if (!volume) return null;

			return {
				volumeSlug: volume.urlPath,
				bookSlug: book.urlPath,
				bookId,
				chapter: chapter - 1,
				title: titleForBookChapter(book, chapter - 1),
			};
		}

		const previousBook = books[bookId - 1];

		if (previousBook !== undefined) {
			const prevVolume = volumes.find((v) => v.id === previousBook.parentBookId);
			if (!prevVolume) return null;

			return {
				volumeSlug: prevVolume.urlPath,
				bookSlug: previousBook.urlPath,
				bookId: previousBook.id,
				chapter: previousBook.numChapters,
				title: titleForBookChapter(previousBook, previousBook.numChapters),
			};
		}
	}

	return null;
}

export function titleForBookChapter(book: Book, chapter: number): string {
	if (chapter > 0) {
		return `${book.tocName} ${chapter}`;
	}

	return book.tocName;
}
