/*======================================================================
 * FILE:    MapDisplay.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2026
 *
 * DESCRIPTION: Google Maps component.
 */

/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import { useMemo } from "react";
import { AdvancedMarker, APIProvider, ControlPosition, Map } from "@vis.gl/react-google-maps";
import { MapBoundsUpdater } from "./MapBoundsUpdater";
import { useMapContext } from "../context/MapDataContextHook";
import "./MapDisplay.css";

/*----------------------------------------------------------------------
 *                      CONSTANTS
 */
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
const CLASS_GEOPLACE_MARKER = "geoplace-marker";
const CLASS_LABEL = "label";
const CLASS_PIN = "pin";
const DEFAULT_GESTURE_HANDLING = "greedy";
const DEFAULT_MAP_TYPE_ID = "terrain";
const DEFAULT_ZOOM = 8;
const JERUSALEM_LOCATION = { lat: 31.778407, lng: 35.234725 };
const MAP_ID = "dd27f636464f8569";

/*----------------------------------------------------------------------
 *                      COMPONENT
 */
export default function MapDisplay() {
    const { geoplaces } = useMapContext();

    if (!API_KEY) {
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
            >
                <div className={CLASS_GEOPLACE_MARKER}>
                    <div className={CLASS_PIN}></div>
                    <div className={CLASS_LABEL}>{geoplace.placename}</div>
                </div>
            </AdvancedMarker>
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
                        position: ControlPosition.TOP_RIGHT
                    }}
                    mapTypeId={DEFAULT_MAP_TYPE_ID}
                    streetViewControl={false}
                    fullscreenControl={false}
                    zoomControl={true}
                    zoomControlOptions={{
                        position: ControlPosition.RIGHT_BOTTOM
                    }}
                >
                    {markers}
                </Map>
                <MapBoundsUpdater />
            </section>
        </APIProvider>
    );
}
