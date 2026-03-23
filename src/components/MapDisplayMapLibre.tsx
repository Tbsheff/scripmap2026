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

import { Map, MapControls, MapMarker, MarkerContent, MarkerPopup, MarkerTooltip } from "@/components/ui/map";
import { MapBoundsUpdaterMapLibre } from "./MapBoundsUpdaterMapLibre";
import { MapTerrainLayer } from "./MapTerrainLayer";
import { useGeoplacesContext, useFocusedGeoplaceContext } from "../context/MapDataContextHook";
import "./MapDisplay.css";

/*----------------------------------------------------------------------
 *                      CONSTANTS
 */
const DEFAULT_ZOOM = 8;
const JERUSALEM_CENTER: [number, number] = [35.234725, 31.778407]; // [lng, lat] for MapLibre
const STYLES = {
    light: "https://tiles.openfreemap.org/styles/liberty",
    dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
};

/*----------------------------------------------------------------------
 *                      COMPONENT
 */
export default function MapDisplayMapLibre() {
    const { geoplaces } = useGeoplacesContext();
    const { focusedGeoplace } = useFocusedGeoplaceContext();

    const hasFocus = focusedGeoplace !== null;

    const markers = useMemo(
        () =>
            geoplaces
                ? Object.entries(geoplaces).map(([key, geoplace]) => {
                      const isFocused = focusedGeoplace
                          && geoplace.latitude === focusedGeoplace.latitude
                          && geoplace.longitude === focusedGeoplace.longitude;
                      const markerClass = [
                          "geoplace-marker",
                          isFocused ? "focused" : "",
                          hasFocus && !isFocused ? "dimmed" : "",
                      ].filter(Boolean).join(" ");

                      return (
                          <MapMarker key={key} longitude={geoplace.longitude} latitude={geoplace.latitude}>
                              <MarkerContent>
                                  <div className={markerClass}>
                                      <div className="marker-dot" aria-hidden="true" />
                                      <div className="label">{geoplace.placename}</div>
                                  </div>
                              </MarkerContent>
                              <MarkerPopup className="marker-popup">
                                  <p className="marker-popup-name">{geoplace.placename}</p>
                                  <p className="marker-popup-coords">
                                      {geoplace.latitude.toFixed(4)}, {geoplace.longitude.toFixed(4)}
                                  </p>
                              </MarkerPopup>
                              <MarkerTooltip>{geoplace.placename}</MarkerTooltip>
                          </MapMarker>
                      );
                  })
                : [],
        [geoplaces, focusedGeoplace, hasFocus]
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
