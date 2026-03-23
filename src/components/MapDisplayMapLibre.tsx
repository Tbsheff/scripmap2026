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
import { useCallback, useMemo, useRef, useState } from "react";

import { Map, MapControls, MapMarker, MarkerContent, MarkerPopup, MarkerTooltip, useMap, type MapRef } from "@/components/ui/map";
import { MapBoundsUpdaterMapLibre } from "./MapBoundsUpdaterMapLibre";
import { MapTerrainLayer } from "./MapTerrainLayer";
import { useGeoplacesContext, useFocusedGeoplaceContext } from "../context/MapDataContextHook";

/*----------------------------------------------------------------------
 *                      CONSTANTS
 */
const DEFAULT_ZOOM = 8;
const JERUSALEM_CENTER: [number, number] = [35.234725, 31.778407]; // [lng, lat] for MapLibre
const STYLE_KEY = "scripmap-map-style";

type MapStyle = "terrain" | "clean";

const STYLE_CONFIG = {
    terrain: {
        light: "https://tiles.openfreemap.org/styles/liberty",
        dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
    },
    clean: {
        light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
        dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
    },
} as const;

function getStoredStyle(): MapStyle {
    try {
        const stored = localStorage.getItem(STYLE_KEY);
        if (stored === "clean") return "clean";
    } catch { /* localStorage unavailable */ }
    return "terrain";
}

/*----------------------------------------------------------------------
 *                      COMPONENT
 */
/*----------------------------------------------------------------------
 *                      STYLE SWITCHER (child of Map)
 */
function MapStyleSwitcher({ mapStyle, onToggle }: { mapStyle: MapStyle; onToggle: () => void }) {
    return (
        <div className="map-style-switcher">
            <button
                onClick={onToggle}
                aria-label={`Switch to ${mapStyle === "terrain" ? "clean" : "terrain"} map`}
                title={mapStyle === "terrain" ? "Clean view" : "Terrain view"}
            >
                {mapStyle === "terrain" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M3 12h18" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                        <path d="m8 3 4 8 5-5 2 15H2L8 3z" />
                    </svg>
                )}
                <span>{mapStyle === "terrain" ? "Clean" : "Terrain"}</span>
            </button>
        </div>
    );
}

/*----------------------------------------------------------------------
 *                      PITCH HANDLER (child of Map)
 */
function PitchTransition({ mapStyle }: { mapStyle: MapStyle }) {
    const { map, isLoaded } = useMap();
    const prevStyle = useRef(mapStyle);

    if (map && isLoaded && prevStyle.current !== mapStyle) {
        prevStyle.current = mapStyle;
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const targetPitch = mapStyle === "terrain" ? 40 : 0;

        if (prefersReducedMotion) {
            map.jumpTo({ pitch: targetPitch });
        } else {
            map.easeTo({ pitch: targetPitch, duration: 600 });
        }
    }

    return null;
}

/*----------------------------------------------------------------------
 *                      COMPONENT
 */
export default function MapDisplayMapLibre() {
    const { geoplaces } = useGeoplacesContext();
    const { focusedGeoplace, setFocusedGeoplace } = useFocusedGeoplaceContext();
    const [mapStyle, setMapStyle] = useState<MapStyle>(getStoredStyle);
    const mapRef = useRef<MapRef>(null);

    const hasFocus = focusedGeoplace !== null;

    const toggleStyle = useCallback(() => {
        setMapStyle((prev) => {
            const next = prev === "terrain" ? "clean" : "terrain";
            try { localStorage.setItem(STYLE_KEY, next); } catch { /* noop */ }
            return next;
        });
    }, []);

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
                ref={mapRef}
                center={JERUSALEM_CENTER}
                zoom={DEFAULT_ZOOM}
                styles={STYLE_CONFIG[mapStyle]}
            >
                {markers}
                <MapControls position="bottom-right" showZoom showCompass />
                <MapStyleSwitcher mapStyle={mapStyle} onToggle={toggleStyle} />
                <MapBoundsUpdaterMapLibre />
                <MapTerrainLayer enabled={mapStyle === "terrain"} />
                <PitchTransition mapStyle={mapStyle} />
            </Map>
            {geoplaces && Object.keys(geoplaces).length > 0 && (
                <div className="absolute bottom-3 left-3 z-10 max-h-48 overflow-y-auto rounded-lg bg-[var(--surface)]/90 backdrop-blur-sm shadow-lg border border-[var(--outline-variant)] p-2 text-sm">
                    <div className="text-xs font-medium text-[var(--on-surface-variant)] px-2 py-1 mb-1">
                        Locations ({Object.keys(geoplaces).length})
                    </div>
                    {Object.entries(geoplaces).map(([key, gp]) => (
                        <button
                            key={key}
                            className="block w-full text-left px-2 py-1 rounded-md text-[var(--on-surface)] hover:bg-[var(--surface-container)] transition-colors text-sm cursor-pointer"
                            onClick={() => setFocusedGeoplace(gp)}
                        >
                            {gp.placename}
                        </button>
                    ))}
                </div>
            )}
            {showEmptyState && (
                <div className="map-empty-state">
                    Select a chapter to explore locations on the map
                </div>
            )}
        </section>
    );
}
