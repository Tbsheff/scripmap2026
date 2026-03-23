/*======================================================================
 * FILE:    Header.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2026
 *
 * DESCRIPTION: Header component with glass nav, title, and breadcrumbs.
 */

/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import { memo } from "react";
import Breadcrumbs from "./Breadcrumbs";

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
        <header className="flex items-center justify-between gap-4 px-6 h-14 shrink-0 border-b border-[var(--outline-variant)]">
            {/* Title — visible on mobile (no sidebar), hidden on desktop (sidebar has it) */}
            <div className="flex lg:hidden items-center whitespace-nowrap pr-4 mr-1 border-r border-[var(--outline-variant)]">
                <span className="font-serif text-base italic text-[var(--on-surface)]">
                    The Scriptures Mapped
                </span>
            </div>

            {/* Breadcrumbs */}
            <Breadcrumbs />

            {/* Map toggle — only in chapter view */}
            {onToggleMap && (
                <button
                    className="map-toggle-btn"
                    onClick={onToggleMap}
                    onMouseEnter={prefetchMap}
                    onFocus={prefetchMap}
                    aria-label={mapOpen ? "Close map" : "Open map"}
                    title={mapOpen ? "Close map" : "Open map"}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="block w-[22px] h-[22px]">
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
