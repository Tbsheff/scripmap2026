/*======================================================================
 * FILE:    MapDisplayMapLibre.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2026
 *
 * DESCRIPTION: MapLibre GL map component using mapcn and OpenFreeMap.
 */

/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import { useMemo } from "react";

import { Map, MapControls, MapMarker, MarkerContent, MarkerTooltip } from "@/components/ui/map";
import { MapBoundsUpdaterMapLibre } from "./MapBoundsUpdaterMapLibre";
import { MapTerrainLayer } from "./MapTerrainLayer";
import { useGeoplacesContext } from "../context/MapDataContextHook";
import "./MapDisplay.css";

/*----------------------------------------------------------------------
 *                      CONSTANTS
 */
const DEFAULT_ZOOM = 8;
const JERUSALEM_CENTER: [number, number] = [35.234725, 31.778407]; // [lng, lat] for MapLibre
const STYLES = {
    light: "https://tiles.openfreemap.org/styles/liberty",
    dark: "https://tiles.openfreemap.org/styles/liberty",
};

/*----------------------------------------------------------------------
 *                      COMPONENT
 */
export default function MapDisplayMapLibre() {
    const { geoplaces } = useGeoplacesContext();

    const markers = useMemo(
        () =>
            geoplaces
                ? Object.entries(geoplaces).map(([key, geoplace]) => (
                      <MapMarker key={key} longitude={geoplace.longitude} latitude={geoplace.latitude}>
                          <MarkerContent>
                              <div className="geoplace-marker">
                                  <div className="pin" aria-hidden="true"></div>
                                  <div className="label">{geoplace.placename}</div>
                              </div>
                          </MarkerContent>
                          <MarkerTooltip>{geoplace.placename}</MarkerTooltip>
                      </MapMarker>
                  ))
                : [],
        [geoplaces]
    );

    const showEmptyState = geoplaces !== null && Object.keys(geoplaces).length === 0;


    return (
        <section className="MapDisplay" aria-label="Map of scripture locations">
            <Map
                center={JERUSALEM_CENTER}
                zoom={DEFAULT_ZOOM}
                styles={STYLES}
            >
                {markers}
                <MapControls position="bottom-right" showZoom showCompass />
                <MapBoundsUpdaterMapLibre />
                <MapTerrainLayer />
            </Map>
            {showEmptyState && (
                <div className="map-empty-state">
                    Select a chapter to explore locations on the map
                </div>
            )}
        </section>
    );
}
