/*======================================================================
 * FILE:    BookComponent.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2025
 *
 * DESCRIPTION: Book component displaying grid of chapters.
 */

/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import { Link, Navigate, useParams } from "react-router-dom";
import { CLASS_BUTTON } from "../Constants";
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

    const chaptersList = [];
    let chapter = 1;

    while (chapter <= book.numChapters) {
        chaptersList.push(
            <Link
                className={`${CLASS_BUTTON} chapter-btn`}
                id={`c${chapter}`}
                key={`k${chapter}`}
                to={`/${book.parentBookId}/${book.id}/${chapter}`}
            >
                {chapter}
            </Link>
        );
        chapter += 1;
    }

    return (
        <div className="booksContainer">
            <div className="volume">
                <h5>{book.fullName}</h5>
            </div>
            <div className="books padded">{chaptersList}</div>
        </div>
    );
}
