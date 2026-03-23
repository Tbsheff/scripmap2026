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
                    className="chapter-pill flex items-center justify-center bg-[var(--surface-container-lowest)] text-[var(--on-surface)] font-sans text-[0.85rem] max-sm:text-[0.8rem] font-semibold aspect-square rounded-xl no-underline active:scale-[0.96] tabular-nums focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
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
        <div className="w-full overflow-y-auto h-full px-10 py-10 max-w-[1400px] mx-auto max-sm:px-4 max-sm:py-5 max-sm:pb-12">
            <div className="mb-8 pb-4 border-b border-[var(--outline-variant)]">
                <span className="block font-sans text-[0.7rem] font-bold tracking-[0.15em] uppercase text-[var(--primary)] mb-1">Chapters</span>
                <h2 className="font-serif text-[1.875rem] max-sm:text-2xl font-bold text-[var(--on-surface)] m-0 tracking-[-0.01em]">{book.fullName}</h2>
            </div>
            <div className="chapter-grid grid gap-[0.625rem] max-sm:gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(3.5rem, 1fr))" }}>{chaptersList}</div>
        </div>
    );
}
