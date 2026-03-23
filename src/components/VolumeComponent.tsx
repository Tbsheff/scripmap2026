/*======================================================================
 * FILE:    VolumeComponent.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2026
 *
 * DESCRIPTION: Single volume display component with editorial book cards.
 */

/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import { memo } from "react";
import { Link } from "react-router-dom";
import { VolumeProps } from "../Types";

/*----------------------------------------------------------------------
 *                      CONSTANTS
 */
const VOLUME_LABELS = ["Volume I", "Volume II", "Volume III", "Volume IV", "Volume V"];

/*----------------------------------------------------------------------
 *                      COMPONENT
 */
export default memo(function VolumeComponent({ volume }: VolumeProps) {
    if (!volume) {
        return null;
    }

    const volumeLabel = VOLUME_LABELS[volume.id - 1] ?? `Volume ${volume.id}`;

    return (
        <section className="volume">
            <div className="volume-header">
                <div>
                    <span className="volume-label">{volumeLabel}</span>
                    <h2 className="volume-title">{volume.fullName}</h2>
                </div>
            </div>
            <div className="book-cards">
                {volume.books.map((book) => (
                    <Link
                        className="book-card"
                        id={String(book.id)}
                        key={`bk${book.id}`}
                        to={`/${volume.id}/${book.id}`}
                    >
                        <span className="book-abbr">{book.citeAbbr}</span>
                        <span className="book-name">{book.gridName}</span>
                    </Link>
                ))}
            </div>
        </section>
    );
});
