/*======================================================================
 * FILE:    Breadcrumbs.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2026
 *
 * DESCRIPTION: Breadcrumb navigation component.
 */

/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { HOME_BREADCRUMB } from "../Constants";
import { bookBySlug, volumeBySlug } from "../utils/scriptureNavigation";
import "./Breadcrumbs.css";

/*----------------------------------------------------------------------
 *                      COMPONENT
 */
export default function Breadcrumbs() {
    const { volumeSlug, bookSlug, chapter } = useParams();
    const volume = volumeBySlug(volumeSlug ?? "");
    const book = bookBySlug(bookSlug ?? "");

    const crumbs = useMemo(() => {
        const items = [];

        if (!volumeSlug || volume === undefined) {
            items.push(<li key="t" aria-current="page">{HOME_BREADCRUMB}</li>);
        } else {
            items.push(
                <li key="t">
                    <Link to="/">{HOME_BREADCRUMB}</Link>
                </li>
            );

            if (!bookSlug || book === undefined) {
                items.push(<li key={`v${volume.id}`} aria-current="page">{volume.fullName}</li>);
            } else {
                items.push(
                    <li key={`v${volume.id}`}>
                        <Link to={`/${volume.urlPath}`}>{volume.fullName}</Link>
                    </li>
                );

                if (chapter === undefined || Number(chapter) <= 0) {
                    items.push(<li key={`b${book.id}`} aria-current="page">{book.tocName}</li>);
                } else {
                    items.push(
                        <li key={`b${book.id}`}>
                            <Link to={`/${volume.urlPath}/${book.urlPath}`}>{book.tocName}</Link>
                        </li>
                    );

                    items.push(<li key={`c${chapter}`} aria-current="page">{chapter}</li>);
                }
            }
        }

        return items;
    }, [volumeSlug, bookSlug, chapter, volume, book]);

    return (
        <div className="crumbs-wrapper">
            <div className="crumbs">
                <ul>{crumbs}</ul>
            </div>
        </div>
    );
}
