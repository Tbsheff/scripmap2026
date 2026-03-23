/*======================================================================
 * FILE:    Header.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2026
 *
 * DESCRIPTION: Header with sidebar toggle, breadcrumbs, and map toggle.
 */

import { memo } from "react";
import { Map, PanelLeft, X } from "lucide-react";
import Breadcrumbs from "./Breadcrumbs";

interface HeaderProps {
    mapOpen?: boolean;
    onToggleMap?: () => void;
    onToggleSidebar?: () => void;
}

export default memo(function Header({ mapOpen = false, onToggleMap, onToggleSidebar }: HeaderProps) {
    const prefetchMap = () => void import("./MapDisplay");

    return (
        <header className="flex items-center gap-3 px-3 h-12 shrink-0 border-b border-[var(--outline-variant)]">
            {/* Sidebar toggle */}
            <button
                className="hidden lg:flex items-center justify-center h-7 w-7 rounded-md shrink-0
                           text-[var(--on-surface-variant)] transition-colors
                           hover:bg-[var(--surface-container)] hover:text-[var(--on-surface)]"
                onClick={onToggleSidebar}
                aria-label="Toggle sidebar"
                type="button"
            >
                <PanelLeft className="h-4 w-4" strokeWidth={1.5} />
            </button>

            {/* Title — mobile only */}
            <div className="flex lg:hidden items-center whitespace-nowrap pr-3 mr-1 border-r border-[var(--outline-variant)]">
                <span className="font-serif text-base italic text-[var(--on-surface)]">
                    The Scriptures Mapped
                </span>
            </div>

            {/* Breadcrumbs */}
            <div className="flex-1 min-w-0">
                <Breadcrumbs />
            </div>

            {/* Map toggle — chapter view only */}
            {onToggleMap && (
                <button
                    className="map-toggle-btn"
                    onClick={onToggleMap}
                    onMouseEnter={prefetchMap}
                    onFocus={prefetchMap}
                    aria-label={mapOpen ? "Close map" : "Open map"}
                    title={mapOpen ? "Close map" : "Open map"}
                >
                    {mapOpen
                        ? <X className="h-5 w-5" strokeWidth={1.5} />
                        : <Map className="h-5 w-5" strokeWidth={1.5} />
                    }
                </button>
            )}
        </header>
    );
});
