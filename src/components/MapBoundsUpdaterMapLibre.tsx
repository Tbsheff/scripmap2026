/*======================================================================
 * FILE:    MapBoundsUpdaterMapLibre.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2026
 *
 * DESCRIPTION: Component to set the MapLibre map position and zoom.
 */

import { LngLatBounds } from "maplibre-gl";
import { useEffect } from "react";
import { useMap } from "@/components/ui/map";
import { useFocusedGeoplaceContext, useGeoplacesContext } from "../context/MapDataContextHook";
import type { GeoPlace } from "../Types";

const VIEW_ALTITUDE_DEFAULT = 5000;
const VIEW_ALTITUDE_CONVERSION_RATIO = 591657550.5;
const VIEW_ALTITUDE_ZOOM_ADJUST = -2;
const ZOOM_RATIO = 450;

function zoomLevelForAltitude(viewAltitude: number) {
	let zoomLevel = viewAltitude / ZOOM_RATIO;

	if (viewAltitude !== VIEW_ALTITUDE_DEFAULT) {
		zoomLevel = Math.log2(VIEW_ALTITUDE_CONVERSION_RATIO / viewAltitude) + VIEW_ALTITUDE_ZOOM_ADJUST;
	}

	return zoomLevel;
}

function boundsForCurrentMarkers(geoplaces: GeoPlace[]) {
	const bounds = new LngLatBounds();

	for (const place of geoplaces) {
		bounds.extend([place.longitude, place.latitude]);
	}

	return bounds;
}

export function MapBoundsUpdaterMapLibre() {
	const { map, isLoaded } = useMap();
	const { geoplaces } = useGeoplacesContext();
	const { focusedGeoplace } = useFocusedGeoplaceContext();

	useEffect(() => {
		if (!(map && isLoaded)) {
			return;
		}

		const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const navigate = prefersReducedMotion
			? map.jumpTo.bind(map)
			: (opts: Parameters<typeof map.flyTo>[0]) => map.flyTo({ ...opts, duration: 1500 });

		if (focusedGeoplace) {
			navigate({
				center: [focusedGeoplace.longitude, focusedGeoplace.latitude],
				zoom: zoomLevelForAltitude(focusedGeoplace.viewAltitude),
			});
		} else if (geoplaces && Object.keys(geoplaces).length > 0) {
			const places = Object.values(geoplaces);
			const firstPlace = places[0];

			if (!firstPlace) {
				return;
			}

			if (places.length <= 1) {
				navigate({
					center: [firstPlace.longitude, firstPlace.latitude],
					zoom: zoomLevelForAltitude(firstPlace.viewAltitude),
				});
			} else {
				map.fitBounds(boundsForCurrentMarkers(places), {
					padding: 50,
				});
			}
		}
	}, [focusedGeoplace, geoplaces, map, isLoaded]);

	return null;
}
