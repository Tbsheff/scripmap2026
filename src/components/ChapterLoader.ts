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
import { LoaderFunctionArgs } from "react-router-dom";
import { MS_PER_HOUR } from "../Constants";
import extractGeoplaces from "./MapHelper";
import { fetchChapterHtml } from "../ServerApi";
import { ChapterCacheEntry } from "../Types";
import { bookBySlug } from "../utils/scriptureNavigation";

/*----------------------------------------------------------------------
 *                      PRIVATE VARIABLES
 */
export const chapterDataCache = new LRUCache<string, ChapterCacheEntry>({
    max: 50,
    ttl: 8 * MS_PER_HOUR,
    updateAgeOnGet: true
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
    if (chapter > 1) prefetch(chapter - 1);
}

/*----------------------------------------------------------------------
 *                      LOADER
 */
export default async function chapterLoader({ params, request }: LoaderFunctionArgs) {
    const { bookSlug, chapter } = params;
    const book = bookBySlug(bookSlug ?? "");
    if (!book) {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw new Response("Book not found", { status: 404 });
    }
    const bookId = book.id;
    const key = `${bookId}:${chapter}`;

    if (chapterDataCache.has(key)) {
        return chapterDataCache.get(key);
    }

    const html = await fetchChapterHtml(bookId, Number(chapter), request.signal);

    if (!html) {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw new Response("Chapter not found", { status: 404 });
    }

    const geoplaces = extractGeoplaces(html);
    const entry = { html, geoplaces };

    chapterDataCache.set(key, entry);
    void prefetchAdjacentChapters(bookId, Number(chapter));

    return entry;
}
