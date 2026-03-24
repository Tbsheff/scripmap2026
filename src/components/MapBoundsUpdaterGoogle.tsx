/*======================================================================
 * FILE:    MapBoundsUpdaterGoogle.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2026
 *
 * DESCRIPTION: Component to set the map position and zoom when needed.
 */

import { useMap } from "@vis.gl/react-google-maps";
/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import { useEffect } from "react";
import { useFocusedGeoplaceContext, useGeoplacesContext } from "../context/MapDataContextHook";
import type { GeoPlace } from "../Types";

/*----------------------------------------------------------------------
 *                      CONSTANTS
 */
const VIEW_ALTITUDE_DEFAULT = 5000;
const VIEW_ALTITUDE_CONVERSION_RATIO = 591657550.5;
const VIEW_ALTITUDE_ZOOM_ADJUST = -2;
const ZOOM_RATIO = 450;

/*----------------------------------------------------------------------
 *                      PRIVATE HELPERS
 */
function boundsForCurrentMarkers(geoplaces: GeoPlace[]) {
	const bounds = new google.maps.LatLngBounds();

	for (const place of geoplaces) {
		bounds.extend({ lat: place.latitude, lng: place.longitude });
	}

	return bounds;
}

function zoomLevelForAltitude(viewAltitude: number) {
	let zoomLevel = viewAltitude / ZOOM_RATIO;

	if (viewAltitude !== VIEW_ALTITUDE_DEFAULT) {
		zoomLevel = Math.log2(VIEW_ALTITUDE_CONVERSION_RATIO / viewAltitude) + VIEW_ALTITUDE_ZOOM_ADJUST;
	}

	return zoomLevel;
}

/*----------------------------------------------------------------------
 *                      COMPONENT
 */
export function MapBoundsUpdater() {
	const map = useMap();
	const { geoplaces } = useGeoplacesContext();
	const { focusedGeoplace } = useFocusedGeoplaceContext();

	useEffect(() => {
		if (!map || typeof google === "undefined") {
			// Ignore -- the map or API isn't fully loaded
			return;
		}

		if (focusedGeoplace) {
			map.setCenter({ lat: focusedGeoplace.latitude, lng: focusedGeoplace.longitude });
			map.setZoom(zoomLevelForAltitude(focusedGeoplace.viewAltitude));
		} else if (geoplaces && Object.keys(geoplaces).length > 0) {
			const places = Object.values(geoplaces);
			const firstPlace = places[0];

			if (!firstPlace) {
				return;
			}

			if (places.length <= 1) {
				map.setCenter({ lat: firstPlace.latitude, lng: firstPlace.longitude });
				map.setZoom(zoomLevelForAltitude(firstPlace.viewAltitude));
			} else {
				map.fitBounds(boundsForCurrentMarkers(places));
			}
		}
	}, [focusedGeoplace, geoplaces, map]);

	return null;
}
