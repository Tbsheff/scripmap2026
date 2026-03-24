/*======================================================================
 * FILE:    ChapterLoader.ts
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2026
 *
 * DESCRIPTION: Asynchronous loader for the chapter component.
 */

/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import { LRUCache } from "lru-cache";
import type { LoaderFunctionArgs } from "react-router-dom";
import { MS_PER_HOUR } from "../Constants";
import { fetchChapterHtml, getScripturesData } from "../ServerApi";
import type { ChapterCacheEntry } from "../Types";
import { bookBySlug } from "../utils/scriptureNavigation";
import extractGeoplaces from "./MapHelper";

/*----------------------------------------------------------------------
 *                      PRIVATE VARIABLES
 */
export const chapterDataCache = new LRUCache<string, ChapterCacheEntry>({
	max: 50,
	ttl: 8 * MS_PER_HOUR,
	updateAgeOnGet: true,
});

/*----------------------------------------------------------------------
 *                      PRIVATE FUNCTIONS
 */
function prefetchAdjacentChapters(bookId: number, chapter: number): void {
	const prefetch = (ch: number) => {
		const key = `${bookId}:${ch}`;
		if (!chapterDataCache.has(key)) {
			fetchChapterHtml(bookId, ch)
				.then((html) => {
					if (html) {
						chapterDataCache.set(key, { html, geoplaces: extractGeoplaces(html) });
					}
				})
				.catch(() => {});
		}
	};
	prefetch(chapter + 1);
	if (chapter > 1) {
		prefetch(chapter - 1);
	}
}

/*----------------------------------------------------------------------
 *                      LOADER
 */
export default async function chapterLoader({ params, request }: LoaderFunctionArgs) {
	await getScripturesData();

	const { bookSlug, chapter } = params;
	const chapterNum = Number(chapter);
	if (!Number.isFinite(chapterNum) || chapterNum < 0) {
		// eslint-disable-next-line @typescript-eslint/only-throw-error
		throw new Response("Invalid chapter", { status: 404 });
	}
	const book = bookBySlug(bookSlug ?? "");
	if (!book) {
		// eslint-disable-next-line @typescript-eslint/only-throw-error
		throw new Response("Book not found", { status: 404 });
	}
	const bookId = book.id;
	const key = `${bookId}:${chapter}`;

	const cached = chapterDataCache.get(key);
	if (cached) return cached;

	const html = await fetchChapterHtml(bookId, chapterNum, request.signal);

	if (!html) {
		// eslint-disable-next-line @typescript-eslint/only-throw-error
		throw new Response("Chapter not found", { status: 404 });
	}

	const geoplaces = extractGeoplaces(html);
	const entry = { html, geoplaces };

	chapterDataCache.set(key, entry);
	void prefetchAdjacentChapters(bookId, chapterNum);

	return entry;
}
