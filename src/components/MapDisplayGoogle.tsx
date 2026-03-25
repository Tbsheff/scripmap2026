/*======================================================================
 * FILE:    MapDisplayGoogle.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2026
 *
 * DESCRIPTION: Google Maps component.
 */

import { AdvancedMarker, APIProvider, ControlPosition, Map as GoogleMap } from "@vis.gl/react-google-maps";
/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import { useMemo } from "react";
import { useGeoplacesContext } from "../context/MapDataContextHook";
import { MapBoundsUpdater } from "./MapBoundsUpdaterGoogle";

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
const MAP_TYPE_CONTROL_OPTIONS = { position: ControlPosition.TOP_RIGHT };
const ZOOM_CONTROL_OPTIONS = { position: ControlPosition.RIGHT_BOTTOM };

/*----------------------------------------------------------------------
 *                      COMPONENT
 */
export default function MapDisplayGoogle() {
	const { geoplaces } = useGeoplacesContext();

	if (!API_KEY) {
		throw new Error("Google Maps API key not configured. Set VITE_GOOGLE_MAPS_API_KEY in .env.local");
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
					<div className={CLASS_PIN} aria-hidden="true"></div>
					<div className={CLASS_LABEL}>{geoplace.placename}</div>
				</div>
			</AdvancedMarker>
		));
	}, [geoplaces]);

	const showEmptyState = geoplaces !== null && Object.keys(geoplaces).length === 0;

	return (
		<APIProvider apiKey={API_KEY}>
			<section className="relative h-full bg-[var(--body-background-color)] rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-ambient)]" aria-label="Map of scripture locations">
				<GoogleMap
					defaultCenter={JERUSALEM_LOCATION}
					defaultZoom={DEFAULT_ZOOM}
					mapId={MAP_ID}
					gestureHandling={DEFAULT_GESTURE_HANDLING}
					mapTypeControl={true}
					mapTypeControlOptions={MAP_TYPE_CONTROL_OPTIONS}
					mapTypeId={DEFAULT_MAP_TYPE_ID}
					streetViewControl={false}
					fullscreenControl={false}
					zoomControl={true}
					zoomControlOptions={ZOOM_CONTROL_OPTIONS}
				>
					{markers}
				</GoogleMap>
				<MapBoundsUpdater />
				{showEmptyState && <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[var(--surface-container-lowest)] text-[var(--on-surface-variant)] px-4 py-2 rounded-[var(--radius-lg,0.625rem)] font-serif italic text-[0.8rem] pointer-events-none whitespace-nowrap z-[var(--z-nav-overlay)] shadow-[var(--shadow-subtle)] animate-[fadeInSlide_400ms_cubic-bezier(0.23,1,0.32,1)_both] [animation-delay:200ms]">No geographic locations in this chapter.</div>}
			</section>
		</APIProvider>
	);
}
