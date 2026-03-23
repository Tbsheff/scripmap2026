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
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import Header from "./Header";
import { MapErrorBoundary } from "./MapErrorBoundary";

const MapDisplay = lazy(() => import("./MapDisplay"));
import Navigation from "./Navigation";
import NextPreviousComponent from "./NextPreviousComponent";
import { MapDataContext } from "../context/MapData";
import { GeoPlace, GeoPlaces } from "../Types";

/*----------------------------------------------------------------------
 *                      COMPONENT
 */
export default function MainPage() {
    const [focusedGeoplace, setFocusedGeoplace] = useState<GeoPlace | null>(null);
    const [geoplaces, setGeoplaces] = useState<GeoPlaces | null>(null);
    const [mapOpen, setMapOpen] = useState(false);

    const toggleMap = () => setMapOpen((prev) => !prev);

    useEffect(() => {
        window.showLocation = (_id, placename, latitude, longitude, viewAltitude) => {
            setFocusedGeoplace({ latitude, longitude, placename, viewAltitude });
            setMapOpen(true);
        };
        return () => {
            delete window.showLocation;
        };
    }, []);

    const mapContextValue = useMemo(
        () => ({ focusedGeoplace, geoplaces, setFocusedGeoplace, setGeoplaces }),
        [focusedGeoplace, geoplaces, setFocusedGeoplace, setGeoplaces]
    );

    return (
        <MapDataContext value={mapContextValue}>
            <a className="skip-to-content" href="#scripture-content">Skip to content</a>
            <main data-map-open={mapOpen || undefined}>
                <Header mapOpen={mapOpen} onToggleMap={toggleMap} />
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
        </MapDataContext>
    );
}
