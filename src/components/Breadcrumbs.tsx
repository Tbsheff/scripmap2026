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
import { Link, Route, Routes, useParams } from "react-router-dom";
import { HOME_BREADCRUMB } from "../Constants";
import { useScripturesDataContext } from "../context/ScripturesDataContextHook";
import "./Breadcrumbs.css";

/*----------------------------------------------------------------------
 *                      PRIVATE HELPERS
 */
function BreadcrumbsContent() {
    const { volumeId, bookId, chapter } = useParams();
    const { volumes, books } = useScripturesDataContext();
    const volume = volumes[Number(volumeId) - 1];
    const book = books[bookId ?? ""];

    const crumbs = [];

    if (volume === undefined) {
        crumbs.push(<li key="t">{HOME_BREADCRUMB}</li>);
    } else {
        crumbs.push(
            <li key="t">
                <Link to="/">{HOME_BREADCRUMB}</Link>
            </li>
        );

        if (book === undefined) {
            crumbs.push(<li key={`v${volume.id}`}>{volume.fullName}</li>);
        } else {
            crumbs.push(
                <li key={`v${volume.id}`}>
                    <Link to={`/${volume.id}`}>{volume.fullName}</Link>
                </li>
            );

            if (chapter === undefined || Number(chapter) <= 0) {
                crumbs.push(<li key={`b${book.id}`}>{book.tocName}</li>);
            } else {
                crumbs.push(
                    <li key={`b${book.id}`}>
                        <Link to={`/${volume.id}/${book.id}`}>{book.tocName}</Link>
                    </li>
                );

                crumbs.push(<li key={`c${chapter}`}>{chapter}</li>);
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
    return (
        <Routes>
            <Route path="/:volumeId?/:bookId?/:chapter?" element={<BreadcrumbsContent />} />
        </Routes>
    );
}
