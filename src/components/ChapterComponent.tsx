/*======================================================================
 * FILE:    ChapterComponent.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2026
 *
 * DESCRIPTION: Chapter component displaying a chapter's HTML.
 */

/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import { useEffect, useMemo, useRef } from "react";
import { Link, useLoaderData, useParams } from "react-router-dom";
import { ANIMATION_MARKER_DELAY } from "../Constants";
import { ChapterCacheEntry } from "../Types";
import { NextSideComponent, PreviousSideComponent } from "./NextPreviousComponent";
import { useGeoplacesContext, useFocusedGeoplaceContext } from "../context/MapDataContextHook";
import "./ChapterComponent.css";

/*----------------------------------------------------------------------
 *                      COMPONENT
 */
export default function ChapterComponent() {
    const { bookId, chapter } = useParams();
    const { setGeoplaces } = useGeoplacesContext();
    const { setFocusedGeoplace } = useFocusedGeoplaceContext();
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const loaderData = useLoaderData() as ChapterCacheEntry | undefined;
    const cachedDataRef = useRef(loaderData);
    if (loaderData) {
        cachedDataRef.current = loaderData;
    }

    useEffect(() => {
        if (loaderData) {
            const timer = setTimeout(() => {
                setGeoplaces(loaderData.geoplaces);
                setFocusedGeoplace(null);
            }, ANIMATION_MARKER_DELAY);

            return () => {
                clearTimeout(timer);
            };
        } else {
            setGeoplaces(null);
        }
    }, [loaderData, setFocusedGeoplace, setGeoplaces]);

    const html = loaderData?.html ?? cachedDataRef.current?.html;
    const innerHtml = useMemo(() => ({ __html: html ?? "" }), [html]);

    if (!html) {
        return (
            <div className="chapter-empty">
                <p>No content available for this chapter.</p>
                <Link to="/">Return to All Volumes</Link>
            </div>
        );
    }

    return (
        <div className="with-nav-buttons">
            <PreviousSideComponent bookId={bookId} chapter={chapter} />
            <div className="chapter-content" dangerouslySetInnerHTML={innerHtml} />
            <NextSideComponent bookId={bookId} chapter={chapter} />
        </div>
    );
}
