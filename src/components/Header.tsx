/*======================================================================
 * FILE:    Header.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2026
 *
 * DESCRIPTION: Header component with title and breadcrumbs.
 */

/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import Breadcrumbs from "./Breadcrumbs";
import "./Header.css";

/*----------------------------------------------------------------------
 *                      COMPONENT
 */
export default function Header() {
    return (
        <header>
            <div className="centerhead">
                <div className="title">The Scriptures Mapped</div>
                <div className="subtitle">By Stephen W. Liddle</div>
            </div>
            <Breadcrumbs />
        </header>
    );
}
