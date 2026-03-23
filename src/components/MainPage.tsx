/*======================================================================
 * FILE:    MainPage.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2026
 *
 * DESCRIPTION: App shell with sidebar + inset main container.
 */

/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import { MapErrorBoundary } from "./MapErrorBoundary";

const MapDisplay = lazy(() => import("./MapDisplay"));
import Navigation from "./Navigation";
import NextPreviousComponent from "./NextPreviousComponent";
import Sidebar from "./Sidebar";
import { GeoplacesContext, FocusedGeoplaceContext } from "../context/MapData";
import { GeoPlace, GeoPlaces } from "../Types";

/*----------------------------------------------------------------------
 *                      COMPONENT
 */
export default function MainPage() {
    const [focusedGeoplace, setFocusedGeoplace] = useState<GeoPlace | null>(null);
    const [geoplaces, setGeoplaces] = useState<GeoPlaces | null>(null);
    const [mapOpen, setMapOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { chapter } = useParams();
    const isChapterView = Boolean(chapter);

    const toggleMap = useCallback(() => setMapOpen((prev) => !prev), []);
    const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), []);

    // Cmd/Ctrl+B to toggle sidebar
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "b" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                toggleSidebar();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggleSidebar]);

    useEffect(() => {
        if (!isChapterView) {
            setMapOpen(false);
        }
    }, [isChapterView]);

    useEffect(() => {
        window.showLocation = (_id, placename, latitude, longitude, viewAltitude) => {
            setFocusedGeoplace({ latitude, longitude, placename, viewAltitude });
            setMapOpen(true);
        };
        return () => {
            delete window.showLocation;
        };
    }, []);

    const geoplacesValue = useMemo(() => ({ geoplaces, setGeoplaces }), [geoplaces, setGeoplaces]);
    const focusedValue = useMemo(() => ({ focusedGeoplace, setFocusedGeoplace }), [focusedGeoplace, setFocusedGeoplace]);

    return (
        <GeoplacesContext value={geoplacesValue}>
            <FocusedGeoplaceContext value={focusedValue}>
                <a className="skip-to-content" href="#scripture-content">Skip to content</a>

                {/* Outer shell — full viewport, flex row */}
                <div className="flex h-dvh w-full overflow-hidden bg-[var(--surface-container-low)]">
                    {/* Sidebar — desktop only, collapsible */}
                    <Sidebar open={sidebarOpen} />

                    {/* Main area — flex column with inset container */}
                    <div className="flex min-h-0 flex-1 flex-col p-0 lg:p-2 lg:pl-0">
                        {/* Inset card container */}
                        <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:rounded-xl bg-[var(--surface)]">
                            {/* Header */}
                            <Header
                                mapOpen={isChapterView && mapOpen}
                                onToggleMap={isChapterView ? toggleMap : undefined}
                                onToggleSidebar={toggleSidebar}
                            />

                            {/* Content + optional map */}
                            <div className="flex min-h-0 flex-1 overflow-hidden"
                                 data-map-open={(isChapterView && mapOpen) || undefined}>
                                {/* Scripture content */}
                                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                                    <Navigation />
                                    <NextPreviousComponent />
                                </div>

                                {/* Map panel */}
                                {isChapterView && mapOpen && (
                                    <div className="hidden sm:flex w-[45%] min-w-[300px] max-w-[55%] border-l border-[var(--outline-variant)] p-2 pl-0">
                                        <div className="flex-1 overflow-hidden rounded-lg">
                                            <MapErrorBoundary>
                                                <Suspense fallback={null}>
                                                    <MapDisplay />
                                                </Suspense>
                                            </MapErrorBoundary>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </FocusedGeoplaceContext>
        </GeoplacesContext>
    );
}
