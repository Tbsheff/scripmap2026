/*======================================================================
 * FILE:    ChapterLoader.ts
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2025
 *
 * DESCRIPTION: Asynchronous loader for the chapter component.
 */

/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import { LRUCache } from "lru-cache";
import { LoaderFunctionArgs } from "react-router-dom";
import { MS_PER_HOUR } from "../Constants";
import { fetchChapterHtml } from "../ServerApi";
import { ChapterCacheEntry } from "../Types";
import { extractGeoplaces } from "./MapHelper";

/*----------------------------------------------------------------------
 *                      PRIVATE VARIABLES
 */
const chapterDataCache = new LRUCache<string, ChapterCacheEntry>({
    max: 20,
    ttl: 8 * MS_PER_HOUR,
    updateAgeOnGet: true
});

/*----------------------------------------------------------------------
 *                      LOADER
 */
export default async function chapterLoader({ params }: LoaderFunctionArgs) {
    const { bookId, chapter } = params;
    const key = `${bookId}:${chapter}`;

    if (chapterDataCache.has(key)) {
        return chapterDataCache.get(key);
    }

    const html = await fetchChapterHtml(Number(bookId), Number(chapter));

    if (!html) {
        throw new Response("Chapter not found", { status: 404 });
    }

    const geoplaces = extractGeoplaces(html);

    chapterDataCache.set(key, { html, geoplaces });

    return chapterDataCache.get(key);
}
