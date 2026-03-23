/*======================================================================
 * FILE:    BookComponent.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2026
 *
 * DESCRIPTION: Book component displaying grid of chapters.
 */

/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import { useMemo } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ChapterLoadingIndicator } from "./LoadingIndicator";
import { useScripturesDataContext } from "../context/ScripturesDataContextHook";
import { bookBySlug } from "../utils/scriptureNavigation";
import "./BookComponent.css";

/*----------------------------------------------------------------------
 *                      COMPONENT
 */
export default function BookComponent() {
    const { isLoading } = useScripturesDataContext();
    const { bookSlug, volumeSlug } = useParams();
    const book = bookBySlug(bookSlug ?? "");

    const chaptersList = useMemo(() =>
        book
            ? Array.from({ length: book.numChapters }, (_, i) => i + 1).map((chapter) => (
                <Link
                    className="chapter-pill"
                    id={`c${chapter}`}
                    key={`k${chapter}`}
                    to={`/${volumeSlug}/${book.urlPath}/${chapter}`}
                >
                    {chapter}
                </Link>
            ))
            : [],
        [book, bookSlug, volumeSlug]
    );

    if (isLoading || !book) {
        return <ChapterLoadingIndicator />;
    }

    if (book.numChapters <= 1) {
        return <Navigate to={`/${volumeSlug}/${book.urlPath}/${book.numChapters}`} replace />;
    }

    return (
        <div className="booksContainer">
            <div className="book-header">
                <span className="book-header-label">Chapters</span>
                <h2 className="book-header-title">{book.fullName}</h2>
            </div>
            <div className="chapter-grid">{chaptersList}</div>
        </div>
    );
}
