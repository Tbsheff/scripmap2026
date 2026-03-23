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
 *                      COMPONENT
 */
export function MapTerrainLayer() {
    const { map, isLoaded } = useMap();

    useEffect(() => {
        if (!map || !isLoaded) {
            return;
        }

        // Guard against React strict mode double-mount
        if (map.getSource("terrain")) {
            return;
        }

        map.addSource("terrain", {
            type: "raster-dem",
            tiles: ["https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"],
            encoding: "terrarium",
            tileSize: 256,
        });

        map.setTerrain({ source: "terrain", exaggeration: 1.5 });

        map.addLayer({
            id: "hillshade",
            type: "hillshade",
            source: "terrain",
            paint: {
                "hillshade-shadow-color": "#473B24",
            },
        });
    }, [map, isLoaded]);

    return null;
}
