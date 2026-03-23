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

/*----------------------------------------------------------------------
 *                      COMPONENT
 */
export default function ChapterComponent() {
    const { bookSlug, chapter } = useParams();
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
            <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
                <p className="m-0">No content available for this chapter.</p>
                <Link to="/" className="text-[var(--header-text-color)] bg-[var(--header-background-color)] px-6 py-2.5 min-h-[2.5rem] rounded-xl text-decoration-none mt-4 no-underline inline-flex items-center">Return to All Volumes</Link>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full">
            <PreviousSideComponent bookSlug={bookSlug} chapter={chapter} />
            <div className="chapter-content" dangerouslySetInnerHTML={innerHtml} />
            <NextSideComponent bookSlug={bookSlug} chapter={chapter} />
        </div>
    );
}
