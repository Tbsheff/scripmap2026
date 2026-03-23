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
import "./VolumesList.css";

/*----------------------------------------------------------------------
 *                      CONSTANTS
 */
const VOLUME_LABELS = ["Volume I", "Volume II", "Volume III", "Volume IV", "Volume V"];
const VOLUME_ICONS: Record<number, string> = {
    1: "menu_book",
    2: "auto_stories",
    3: "history_edu",
    4: "church",
    5: "star",
};

/*----------------------------------------------------------------------
 *                      SUB-COMPONENTS
 */
function BookCard({ volume, book, variant = "default" }: {
    volume: Volume;
    book: { id: number; citeAbbr: string; fullName: string };
    variant?: "default" | "surface" | "glass";
}) {
    const cls = variant === "surface" ? "book-card book-card--surface"
        : variant === "glass" ? "book-card book-card--glass"
        : "book-card";

    return (
        <Link className={cls} id={String(book.id)} to={`/${volume.id}/${book.id}`}>
            <span className="book-abbr">{book.citeAbbr}</span>
            <span className="book-name">{book.fullName}</span>
        </Link>
    );
}

function VolumeStandard({ volume, label }: { volume: Volume; label: string }) {
    return (
        <section className="vol-section">
            <div className="vol-section__header">
                <div>
                    <span className="vol-label">{label}</span>
                    <h2 className="vol-title">{volume.fullName}</h2>
                </div>
            </div>
            <div className="vol-grid vol-grid--standard">
                {volume.books.map((book) => (
                    <BookCard volume={volume} book={book} key={book.id} />
                ))}
            </div>
        </section>
    );
}

function VolumeAsymmetric({ volume, label, description }: {
    volume: Volume; label: string; description: string;
}) {
    return (
        <section className="vol-section vol-section--asymmetric">
            <div className="vol-aside">
                <span className="vol-label">{label}</span>
                <h2 className="vol-title">{volume.fullName}</h2>
                <p className="vol-description">{description}</p>
            </div>
            <div className="vol-grid vol-grid--asymmetric">
                {volume.books.map((book) => (
                    <BookCard volume={volume} book={book} variant="surface" key={book.id} />
                ))}
            </div>
        </section>
    );
}

function VolumeCompact({ volume, label, tinted = false }: {
    volume: Volume; label: string; tinted?: boolean;
}) {
    const icon = VOLUME_ICONS[volume.id] ?? "book";

    return (
        <div className={`vol-compact ${tinted ? "vol-compact--tinted" : "vol-compact--neutral"}`}>
            <div className="vol-compact__header">
                <div>
                    <span className="vol-label">{label}</span>
                    <h2 className="vol-title vol-title--sm">{volume.fullName}</h2>
                </div>
                <span className="material-symbols-outlined vol-icon">{icon}</span>
            </div>
            <div className="vol-grid vol-grid--compact">
                {volume.books.map((book) => (
                    <BookCard volume={volume} book={book} variant="glass" key={book.id} />
                ))}
            </div>
        </div>
    );
}

/*----------------------------------------------------------------------
 *                      COMPONENT
 */
export default function VolumesList() {
    const { error, isLoading, volumes } = useScripturesDataContext();
    const { volumeId } = useParams();
    const volumeIdNumber = Number(volumeId);

    if (isLoading) {
        return <LoadingIndicator />;
    }

    if (error) {
        return <div role="alert" className="volumes-error">{error}</div>;
    }

    // Single volume view
    if (!isNaN(volumeIdNumber)) {
        const volume = volumes.find((v) => v.id === volumeIdNumber);
        if (!volume) return null;
        const label = VOLUME_LABELS[volume.id - 1] ?? `Volume ${volume.id}`;
        return (
            <div className="volumesListComponent">
                <VolumeStandard volume={volume} label={label} />
            </div>
        );
    }

    // All volumes — bento layout
    const [ot, nt, bom, dc, pgp] = volumes;

    return (
        <div className="volumesListComponent">
            <header className="hub-header">
                <h1 className="hub-title">Scripture Selection Hub</h1>
                <p className="hub-subtitle">
                    A curated bridge between the sacred word and the maps of time.
                    Choose a volume to begin your geographic and spiritual exploration.
                </p>
            </header>

            <div className="hub-content">
                {ot && <VolumeStandard volume={ot} label="Volume I" />}

                {nt && (
                    <VolumeAsymmetric
                        volume={nt}
                        label="Volume II"
                        description="From the humble birth in Bethlehem to the revelations on Patmos. Explore the covenant fulfilled."
                    />
                )}

                <section className="vol-section--paired">
                    {bom && <VolumeCompact volume={bom} label="Volume III" tinted />}
                    <div className="vol-paired-stack">
                        {dc && <VolumeCompact volume={dc} label="Volume IV" />}
                        {pgp && <VolumeCompact volume={pgp} label="Volume V" />}
                    </div>
                </section>
            </div>
        </div>
    );
}
