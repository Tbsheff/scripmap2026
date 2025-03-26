/*======================================================================
 * FILE:    Header.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2025
 *
 * DESCRIPTION: Header component with title and breadcrumbs.
 */

/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import { Link } from "react-router-dom";
import { ANIMATION_KEY_NEXT, ANIMATION_KEY_PREVIOUS } from "../Constants";
import Breadcrumbs from "./Breadcrumbs";
import "./Header.css";

/*----------------------------------------------------------------------
 *                      COMPONENT
 */
export default function Header() {
    return (
        <header>
            <Breadcrumbs />
            <Link to="/1/106/12" state={{ animationKey: ANIMATION_KEY_PREVIOUS }}>
                Go to Joshua 12
            </Link>
            <div className="centerhead">
                <div className="title">The Scriptures Mapped</div>
                <div className="subtitle">By Stephen W. Liddle</div>
            </div>
        </header>
    );
}
