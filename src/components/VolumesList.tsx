/*======================================================================
 * FILE:    VolumesList.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2026
 *
 * DESCRIPTION: Editorial scripture selection hub with bento layout.
 */

/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import { Link, useParams } from "react-router-dom";
import LoadingIndicator from "./LoadingIndicator";
import { useScripturesDataContext } from "../context/ScripturesDataContextHook";
import { Volume } from "../Types";
import { volumeBySlug } from "../utils/scriptureNavigation";
import "./VolumesList.css";

/*----------------------------------------------------------------------
 *                      CONSTANTS
 */
const VOLUME_LABELS = ["Volume I", "Volume II", "Volume III", "Volume IV", "Volume V"];

/*----------------------------------------------------------------------
 *                      SUB-COMPONENTS
 */
function BookCard({ volume, book }: {
    volume: Volume;
    book: { id: number; citeAbbr: string; fullName: string; urlPath: string };
}) {
    return (
        <Link className="book-card" id={String(book.id)} to={`/${volume.urlPath}/${book.urlPath}`}>
            <span className="book-abbr">{book.citeAbbr}</span>
            <span className="book-name">{book.fullName}</span>
        </Link>
    );
}

function VolumeSection({ volume, label }: { volume: Volume; label: string }) {
    return (
        <section className="vol-section">
            <div className="vol-section__header">
                <div>
                    <span className="vol-label">{label}</span>
                    <h2 className="vol-title">{volume.fullName}</h2>
                </div>
            </div>
            <div className="vol-grid">
                {volume.books.map((book) => (
                    <BookCard volume={volume} book={book} key={book.id} />
                ))}
            </div>
        </section>
    );
}

/*----------------------------------------------------------------------
 *                      COMPONENT
 */
export default function VolumesList() {
    const { error, isLoading, volumes } = useScripturesDataContext();
    const { volumeSlug } = useParams();

    if (isLoading) {
        return <LoadingIndicator />;
    }

    if (error) {
        return <div role="alert" className="volumes-error">{error}</div>;
    }

    if (volumeSlug) {
        const volume = volumeBySlug(volumeSlug);
        if (!volume) return null;
        const label = VOLUME_LABELS[volume.id - 1] ?? `Volume ${volume.id}`;
        return (
            <div className="max-w-[75rem] mx-auto px-4 pt-5 pb-16 sm:px-10 sm:pt-8 sm:pb-24">
                <VolumeSection volume={volume} label={label} />
            </div>
        );
    }

    return (
        <div className="max-w-[75rem] mx-auto px-4 pt-5 pb-16 sm:px-10 sm:pt-8 sm:pb-24">
            <header className="hub-header">
                <h1 className="hub-title">The Scriptures</h1>
                <p className="hub-subtitle">Explore scripture and geography together.</p>
            </header>

            <div className="hub-content">
                {volumes.map((volume, i) => (
                    <VolumeSection
                        key={volume.id}
                        volume={volume}
                        label={VOLUME_LABELS[i] ?? `Volume ${volume.id}`}
                    />
                ))}
            </div>
        </div>
    );
}
