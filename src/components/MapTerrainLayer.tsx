/*======================================================================
 * FILE:    MapTerrainLayer.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2026
 *
 * DESCRIPTION: Adds 3D terrain and hillshading to the MapLibre map
 *              using AWS Open Data elevation tiles.
 */

/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import { useEffect } from "react";

import { useMap } from "@/components/ui/map";

/*----------------------------------------------------------------------
 *                      CONSTANTS
 */
const TERRAIN_SOURCE_ID = "terrain";
const HILLSHADE_LAYER_ID = "hillshade";
const TERRAIN_TILES = "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png";
const TERRAIN_EXAGGERATION = 1.5;

/*----------------------------------------------------------------------
 *                      COMPONENT
 */
export function MapTerrainLayer({ enabled = true }: { enabled?: boolean }) {
    const { map, isLoaded } = useMap();

    useEffect(() => {
        if (!map || !isLoaded) {
            return;
        }

        if (enabled) {
            // Add terrain if not already present
            if (!map.getSource(TERRAIN_SOURCE_ID)) {
                map.addSource(TERRAIN_SOURCE_ID, {
                    type: "raster-dem",
                    tiles: [TERRAIN_TILES],
                    encoding: "terrarium",
                    tileSize: 256,
                });
            }

            map.setTerrain({ source: TERRAIN_SOURCE_ID, exaggeration: TERRAIN_EXAGGERATION });

            if (!map.getLayer(HILLSHADE_LAYER_ID)) {
                map.addLayer({
                    id: HILLSHADE_LAYER_ID,
                    type: "hillshade",
                    source: TERRAIN_SOURCE_ID,
                    paint: {
                        "hillshade-shadow-color": "#473B24",
                    },
                });
            }
        } else {
            // Remove terrain
            map.setTerrain(null);

            if (map.getLayer(HILLSHADE_LAYER_ID)) {
                map.removeLayer(HILLSHADE_LAYER_ID);
            }
        }
    }, [map, isLoaded, enabled]);

    return null;
}
