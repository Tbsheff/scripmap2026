import { LRUCache } from "lru-cache";
import { LoaderFunctionArgs } from "react-router-dom";
import { MS_PER_HOUR } from "../Constants";
import { fetchChapterHtml } from "../ServerApi";

const chapterDataCache = new LRUCache({
    max: 20,
    ttl: 8 * MS_PER_HOUR,
    updateAgeOnGet: true
});

export default async function chapterLoader({ params }: LoaderFunctionArgs) {
    const { bookId, chapter } = params;
    const key = `${bookId}:${chapter}`;

    if (chapterDataCache.has(key)) {
        return chapterDataCache.get(key);
    }

    const chapterHtml = await fetchChapterHtml(Number(bookId), Number(chapter));

    if (!chapterHtml) {
        throw new Response("Chapter not found", { status: 404 });
    }

    chapterDataCache.set(key, chapterHtml);

    return chapterHtml;
}
