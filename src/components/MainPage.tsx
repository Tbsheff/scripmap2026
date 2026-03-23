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
import { useEffect, useState } from "react";
import Header from "./Header";
import MapDisplay from "./MapDisplay";
import { MapErrorBoundary } from "./MapErrorBoundary";
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

    useEffect(() => {
        window.showLocation = (_id, placename, latitude, longitude, viewAltitude) => {
            setFocusedGeoplace({ latitude, longitude, placename, viewAltitude });
        };
        return () => {
            delete window.showLocation;
        };
    }, []);

    return (
        <MapDataContext value={{ focusedGeoplace, geoplaces, setFocusedGeoplace, setGeoplaces }}>
            <main>
                <Header />
                <Navigation />
                <NextPreviousComponent />
                <MapErrorBoundary>
                    <MapDisplay />
                </MapErrorBoundary>
            </main>
        </MapDataContext>
    );
}
