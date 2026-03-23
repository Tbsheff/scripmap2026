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
import { memo } from "react";
import Breadcrumbs from "./Breadcrumbs";
import "./Header.css";

/*----------------------------------------------------------------------
 *                      TYPES
 */
interface HeaderProps {
    mapOpen?: boolean;
    onToggleMap?: () => void;
}

/*----------------------------------------------------------------------
 *                      COMPONENT
 */
export default memo(function Header({ mapOpen = false, onToggleMap }: HeaderProps) {
    const prefetchMap = () => void import("./MapDisplay");

    return (
        <header>
            <div className="centerhead">
                <div className="title">The Scriptures Mapped</div>
            </div>
            <Breadcrumbs />
            {onToggleMap && (
                <button
                    className="map-toggle-btn"
                    onClick={onToggleMap}
                    onMouseEnter={prefetchMap}
                    onFocus={prefetchMap}
                    aria-label={mapOpen ? "Close map" : "Open map"}
                    title={mapOpen ? "Close map" : "Open map"}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                        {mapOpen ? (
                            <path d="M18 6L6 18M6 6l12 12" />
                        ) : (
                            <>
                                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                                <line x1="8" y1="2" x2="8" y2="18" />
                                <line x1="16" y1="6" x2="16" y2="22" />
                            </>
                        )}
                    </svg>
                </button>
            )}
        </header>
    );
});
