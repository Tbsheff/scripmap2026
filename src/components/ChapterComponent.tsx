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
import { useLoaderData, useParams } from "react-router-dom";
import "./ChapterComponent.css";
import { NextSideComponent, PreviousSideComponent } from "./NextPreviousComponent";
import { useScripturesDataContext } from "../context/ScripturesDataContextHook";
import { useEffect } from "react";

/*----------------------------------------------------------------------
 *                      COMPONENT
 */
export default function ChapterComponent() {
    const { bookId, chapter } = useParams();
    const { setGeoplaces } = useScripturesDataContext();
    const { html, geoplaces } = useLoaderData();

    useEffect(() => {
        const timer = setTimeout(() => {
            setGeoplaces(geoplaces);
        }, 300);

        return () => clearTimeout(timer);
    }, [geoplaces, setGeoplaces]);

    return (
        <div className="with-nav-buttons">
            <PreviousSideComponent bookId={bookId} chapter={chapter} />
            <div className="chapter-content" dangerouslySetInnerHTML={{ __html: html }} />
            <NextSideComponent bookId={bookId} chapter={chapter} />
        </div>
    );
}
