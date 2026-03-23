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
import LoadingIndicator from "./LoadingIndicator";
import { useScripturesDataContext } from "../context/ScripturesDataContextHook";
import "./BookComponent.css";

/*----------------------------------------------------------------------
 *                      COMPONENT
 */
export default function BookComponent() {
    const { isLoading, books } = useScripturesDataContext();
    const { bookId } = useParams();
    const book = bookId ? books[bookId] : undefined;

    if (isLoading || !book) {
        return <LoadingIndicator />;
    }

    if (book.numChapters <= 1) {
        return <Navigate to={`/${book.parentBookId}/${book.id}/${book.numChapters}`} replace />;
    }

    const chaptersList = Array.from({ length: book.numChapters }, (_, i) => i + 1).map(
        (chapter) => (
            <Link
                className="chapter-pill"
                id={`c${chapter}`}
                key={`k${chapter}`}
                to={`/${book.parentBookId}/${book.id}/${chapter}`}
            >
                {chapter}
            </Link>
        )
    );

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
