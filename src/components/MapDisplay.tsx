/*======================================================================
 * FILE:    MapDisplay.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2025
 *
 * DESCRIPTION: Google Maps component.
 */

/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps";
import "./MapDisplay.css";
import { useScripturesDataContext } from "../context/ScripturesDataContextHook";
import { useMemo } from "react";

/*----------------------------------------------------------------------
 *                      CONSTANTS
 */
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const DEFAULT_GESTURE_HANDLING = "greedy";
const DEFAULT_MAP_TYPE_ID = "terrain";
const DEFAULT_ZOOM = 8;
const JERUSALEM_LOCATION = { lat: 31.778407, lng: 35.234725 };
const MAP_ID = "dd27f636464f8569";
const POSITION_RIGHT_TOP = 3;
const POSITION_RIGHT_BOTTOM = 9;

/*----------------------------------------------------------------------
 *                      COMPONENT
 */
export default function MapDisplay() {
    const { geoplaces } = useScripturesDataContext();

    if (!API_KEY || !MAP_ID) {
        throw new Error("Unable to display Google Map.");
    }

    const markers = useMemo(() => {
        if (!geoplaces) {
            return [];
        }

        return Object.entries(geoplaces).map(([key, geoplace]) => (
            <AdvancedMarker
                key={key}
                position={{ lat: geoplace.latitude, lng: geoplace.longitude }}
                title={geoplace.placename}
            />
        ));
    }, [geoplaces]);

    return (
        <APIProvider apiKey={API_KEY}>
            <section className="MapDisplay">
                <Map
                    defaultCenter={JERUSALEM_LOCATION}
                    defaultZoom={DEFAULT_ZOOM}
                    mapId={MAP_ID}
                    gestureHandling={DEFAULT_GESTURE_HANDLING}
                    mapTypeControl={true}
                    mapTypeControlOptions={{
                        position: POSITION_RIGHT_TOP
                    }}
                    mapTypeId={DEFAULT_MAP_TYPE_ID}
                    streetViewControl={false}
                    fullscreenControl={false}
                    zoomControl={true}
                    zoomControlOptions={{
                        position: POSITION_RIGHT_BOTTOM
                    }}
                >
                    {markers}
                </Map>
            </section>
        </APIProvider>
    );
}
