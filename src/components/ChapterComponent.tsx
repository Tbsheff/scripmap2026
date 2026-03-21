/*======================================================================
 * FILE:    ChapterComponent.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2025
 *
 * DESCRIPTION: Chapter component displaying a chapter's HTML.
 */

/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import { useEffect, useState } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import { ANIMATION_MARKER_DELAY } from "../Constants";
import { ChapterCacheEntry } from "../Types";
import { NextSideComponent, PreviousSideComponent } from "./NextPreviousComponent";
import { useScripturesDataContext } from "../context/ScripturesDataContextHook";
import "./ChapterComponent.css";

/*----------------------------------------------------------------------
 *                      COMPONENT
 */
export default function ChapterComponent() {
    const { bookId, chapter } = useParams();
    const { setFocusedGeoplace, setGeoplaces } = useScripturesDataContext();
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const loaderData = useLoaderData() as ChapterCacheEntry | undefined;
    const [cachedData, setCachedData] = useState(loaderData);

    useEffect(() => {
        if (loaderData) {
            setCachedData(loaderData);

            const timer = setTimeout(() => {
                setGeoplaces(loaderData.geoplaces);
                setFocusedGeoplace(null);
            }, ANIMATION_MARKER_DELAY);

            return () => { clearTimeout(timer); };
        } else {
            setGeoplaces(null);
        }
    }, [loaderData, setCachedData, setFocusedGeoplace, setGeoplaces]);

    const html = loaderData?.html ?? cachedData?.html;

    if (!html) {
        return null;
    }

    return (
        <div className="with-nav-buttons">
            <PreviousSideComponent bookId={bookId} chapter={chapter} />
            <div className="chapter-content" dangerouslySetInnerHTML={{ __html: html }} />
            <NextSideComponent bookId={bookId} chapter={chapter} />
        </div>
    );
}
