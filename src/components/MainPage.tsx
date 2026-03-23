/*======================================================================
 * FILE:    MainPage.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2026
 *
 * DESCRIPTION: Component with major high-level components of app.
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
import { GeoplacesContext, FocusedGeoplaceContext } from "../context/MapData";
import { GeoPlace, GeoPlaces } from "../Types";

/*----------------------------------------------------------------------
 *                      COMPONENT
 */
export default function MainPage() {
    const [focusedGeoplace, setFocusedGeoplace] = useState<GeoPlace | null>(null);
    const [geoplaces, setGeoplaces] = useState<GeoPlaces | null>(null);
    const [mapOpen, setMapOpen] = useState(false);
    const { chapter } = useParams();
    const isChapterView = Boolean(chapter);

    const toggleMap = useCallback(() => setMapOpen((prev) => !prev), []);

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
                <main data-map-open={(isChapterView && mapOpen) || undefined}>
                    <Header mapOpen={isChapterView && mapOpen} onToggleMap={isChapterView ? toggleMap : undefined} />
                    <Navigation />
                    <NextPreviousComponent />
                    <div className="map-panel">
                        <MapErrorBoundary>
                            <Suspense fallback={null}>
                                <MapDisplay />
                            </Suspense>
                        </MapErrorBoundary>
                    </div>
                </main>
            </FocusedGeoplaceContext>
        </GeoplacesContext>
    );
}
