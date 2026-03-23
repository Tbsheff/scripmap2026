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
import { useEffect, useState } from "react";
import { Link, useLoaderData, useParams } from "react-router-dom";
import { ANIMATION_MARKER_DELAY } from "../Constants";
import { ChapterCacheEntry } from "../Types";
import { NextSideComponent, PreviousSideComponent } from "./NextPreviousComponent";
import { useMapContext } from "../context/MapDataContextHook";
import "./ChapterComponent.css";

/*----------------------------------------------------------------------
 *                      COMPONENT
 */
export default function ChapterComponent() {
    const { bookId, chapter } = useParams();
    const { setFocusedGeoplace, setGeoplaces } = useMapContext();
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

            return () => {
                clearTimeout(timer);
            };
        } else {
            setGeoplaces(null);
        }
    }, [loaderData, setCachedData, setFocusedGeoplace, setGeoplaces]);

    const html = loaderData?.html ?? cachedData?.html;

    if (!html) {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    gap: "1rem",
                    padding: "2rem",
                    textAlign: "center",
                    color: "var(--body-text-color)",
                }}
            >
                <p style={{ margin: 0 }}>No content available for this chapter.</p>
                <Link
                    to="/"
                    style={{
                        color: "var(--header-text-color)",
                        backgroundColor: "var(--header-background-color)",
                        padding: "0.4rem 1rem",
                        borderRadius: "4px",
                        textDecoration: "none",
                        fontWeight: "bold",
                    }}
                >
                    Return to All Volumes
                </Link>
            </div>
        );
    }

    return (
        <div className="with-nav-buttons">
            <PreviousSideComponent bookId={bookId} chapter={chapter} />
            <div className="chapter-content" dangerouslySetInnerHTML={{ __html: html }} />
            <NextSideComponent bookId={bookId} chapter={chapter} />
        </div>
    );
}
