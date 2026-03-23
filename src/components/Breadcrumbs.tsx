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
import { useScripturesDataContext } from "../context/ScripturesDataContextHook";
import "./Breadcrumbs.css";

/*----------------------------------------------------------------------
 *                      PRIVATE HELPERS
 */
function BreadcrumbsContent() {
    const { volumeId, bookId, chapter } = useParams();
    const { volumes, books } = useScripturesDataContext();
    const volume = volumes.find((v) => v.id === Number(volumeId));
    const book = books[bookId ?? ""];

    const crumbs = [];

    if (volume === undefined) {
        crumbs.push(<li key="t" aria-current="page">{HOME_BREADCRUMB}</li>);
    } else {
        crumbs.push(
            <li key="t">
                <Link to="/">{HOME_BREADCRUMB}</Link>
            </li>
        );

        if (book === undefined) {
            crumbs.push(<li key={`v${volume.id}`} aria-current="page">{volume.fullName}</li>);
        } else {
            crumbs.push(
                <li key={`v${volume.id}`}>
                    <Link to={`/${volume.id}`}>{volume.fullName}</Link>
                </li>
            );

            if (chapter === undefined || Number(chapter) <= 0) {
                crumbs.push(<li key={`b${book.id}`} aria-current="page">{book.tocName}</li>);
            } else {
                crumbs.push(
                    <li key={`b${book.id}`}>
                        <Link to={`/${volume.id}/${book.id}`}>{book.tocName}</Link>
                    </li>
                );

                crumbs.push(<li key={`c${chapter}`} aria-current="page">{chapter}</li>);
            }
        }
    }

    return (
        <div className="crumbs-wrapper">
            <div className="crumbs">
                <ul>{crumbs}</ul>
            </div>
        </div>
    );
}

/*----------------------------------------------------------------------
 *                      COMPONENT
 */
export default function Breadcrumbs() {
    return <BreadcrumbsContent />;
}
