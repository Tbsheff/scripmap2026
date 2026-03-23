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
 *                      COMPONENT
 */
export default function Breadcrumbs() {
    const { volumeId, bookId, chapter } = useParams();
    const { volumes, books } = useScripturesDataContext();
    const volume = volumes.find((v) => v.id === Number(volumeId));
    const book = books[bookId ?? ""];

    const crumbs = useMemo(() => {
        const items = [];

        if (volume === undefined) {
            items.push(<li key="t" aria-current="page">{HOME_BREADCRUMB}</li>);
        } else {
            items.push(
                <li key="t">
                    <Link to="/">{HOME_BREADCRUMB}</Link>
                </li>
            );

            if (book === undefined) {
                items.push(<li key={`v${volume.id}`} aria-current="page">{volume.fullName}</li>);
            } else {
                items.push(
                    <li key={`v${volume.id}`}>
                        <Link to={`/${volume.id}`}>{volume.fullName}</Link>
                    </li>
                );

                if (chapter === undefined || Number(chapter) <= 0) {
                    items.push(<li key={`b${book.id}`} aria-current="page">{book.tocName}</li>);
                } else {
                    items.push(
                        <li key={`b${book.id}`}>
                            <Link to={`/${volume.id}/${book.id}`}>{book.tocName}</Link>
                        </li>
                    );

                    items.push(<li key={`c${chapter}`} aria-current="page">{chapter}</li>);
                }
            }
        }

        return items;
    }, [volumeId, bookId, chapter, volumes, books]);

    return (
        <div className="crumbs-wrapper">
            <div className="crumbs">
                <ul>{crumbs}</ul>
            </div>
        </div>
    );
}
