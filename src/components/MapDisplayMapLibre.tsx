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
import { cn } from "@/lib/utils";

import {
	MapControls,
	Map as MapLibreMap,
	MapMarker,
	type MapRef,
	MarkerContent,
	MarkerPopup,
	MarkerTooltip,
	useMap,
} from "@/components/ui/map";
import { useFocusedGeoplaceContext, useGeoplacesContext } from "../context/MapDataContextHook";
import { MapBoundsUpdaterMapLibre } from "./MapBoundsUpdaterMapLibre";
import { MapTerrainLayer } from "./MapTerrainLayer";

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
		if (stored === "clean") {
			return "clean";
		}
	} catch {
		/* localStorage unavailable */
	}
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
		<div className="absolute top-2.5 right-2.5 z-[1]">
			<button
				type="button"
				onClick={onToggle}
				aria-label={`Switch to ${mapStyle === "terrain" ? "clean" : "terrain"} map`}
				title={mapStyle === "terrain" ? "Clean view" : "Terrain view"}
				className="flex items-center gap-1.5 bg-[var(--surface-container-lowest)] text-[var(--on-surface-variant)] border border-[var(--outline-variant)] rounded-[var(--radius-sm)] px-2.5 py-1.5 min-h-[2.5rem] font-sans text-[0.7rem] font-medium tracking-[0.02em] cursor-pointer [transition:background-color_150ms_var(--ease-out),color_150ms_var(--ease-out),box-shadow_150ms_var(--ease-out)] shadow-[var(--shadow-subtle)] hover:bg-[var(--surface-container-low)] hover:text-[var(--on-surface)] active:scale-[0.96]"
			>
				{mapStyle === "terrain" ? (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
						width="16"
						height="16"
						aria-hidden="true"
						className="shrink-0 opacity-70"
					>
						<rect x="3" y="3" width="18" height="18" rx="2" />
						<path d="M3 12h18" />
					</svg>
				) : (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
						width="16"
						height="16"
						aria-hidden="true"
						className="shrink-0 opacity-70"
					>
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
	const mapRef = useRef<MapRef | null>(null);

	const hasFocus = focusedGeoplace !== null;

	const toggleStyle = useCallback(() => {
		setMapStyle((prev) => {
			const next = prev === "terrain" ? "clean" : "terrain";
			try {
				localStorage.setItem(STYLE_KEY, next);
			} catch {
				/* noop */
			}
			return next;
		});
	}, []);

	const markers = useMemo(
		() =>
			geoplaces
				? Object.entries(geoplaces).map(([key, geoplace]) => {
						const isFocused =
							focusedGeoplace &&
							geoplace.latitude === focusedGeoplace.latitude &&
							geoplace.longitude === focusedGeoplace.longitude;
						const markerClass = cn("geoplace-marker", isFocused && "focused", hasFocus && !isFocused && "dimmed");

						return (
							<MapMarker key={key} longitude={geoplace.longitude} latitude={geoplace.latitude}>
								<MarkerContent>
									<div className={markerClass}>
										<div className="marker-dot" aria-hidden="true" />
										<div className="label">{geoplace.placename}</div>
									</div>
								</MarkerContent>
								<MarkerPopup className="font-serif bg-[var(--surface-container-lowest)] rounded-[var(--radius-md)] px-3.5 py-2.5 shadow-[var(--shadow-ambient)] max-w-[200px]">
									<p className="text-[0.8rem] font-semibold text-[var(--on-surface)] m-0 leading-tight">{geoplace.placename}</p>
									<p className="font-sans text-[0.65rem] text-[var(--on-surface-variant)] mt-1 mb-0 tracking-[0.02em]">
										{geoplace.latitude.toFixed(4)}, {geoplace.longitude.toFixed(4)}
									</p>
								</MarkerPopup>
								<MarkerTooltip>{geoplace.placename}</MarkerTooltip>
							</MapMarker>
						);
					})
				: [],
		[geoplaces, focusedGeoplace, hasFocus],
	);

	const showEmptyState = geoplaces !== null && Object.keys(geoplaces).length === 0;

	return (
		<section className="relative h-full bg-[var(--body-background-color)] rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-ambient)]" aria-label="Map of scripture locations">
			<MapLibreMap ref={mapRef} center={JERUSALEM_CENTER} zoom={DEFAULT_ZOOM} styles={STYLE_CONFIG[mapStyle]}>
				{markers}
				<MapControls position="bottom-right" showZoom showCompass />
				<MapStyleSwitcher mapStyle={mapStyle} onToggle={toggleStyle} />
				<MapBoundsUpdaterMapLibre />
				<MapTerrainLayer enabled={mapStyle === "terrain"} />
				<PitchTransition mapStyle={mapStyle} />
			</MapLibreMap>
			{geoplaces && Object.keys(geoplaces).length > 0 && (
				<div className="absolute bottom-3 left-3 z-10 max-h-48 overflow-y-auto rounded-lg bg-[var(--surface)] shadow-lg border border-[var(--outline-variant)] p-2 text-sm">
					<div className="text-xs font-medium text-[var(--on-surface-variant)] px-2 py-1 mb-1">
						Locations ({Object.keys(geoplaces).length})
					</div>
					{Object.entries(geoplaces).map(([key, gp]) => (
						<button
							key={key}
							type="button"
							className="block w-full text-left px-2 py-1 rounded-md text-[var(--on-surface)] hover:bg-[var(--surface-container)] transition-colors text-sm cursor-pointer"
							onClick={() => setFocusedGeoplace(gp)}
						>
							{gp.placename}
						</button>
					))}
				</div>
			)}
			{showEmptyState && <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[var(--surface-container-lowest)] text-[var(--on-surface-variant)] px-4 py-2 rounded-[var(--radius-lg,0.625rem)] font-serif italic text-[0.8rem] pointer-events-none whitespace-nowrap z-[var(--z-nav-overlay)] shadow-[var(--shadow-subtle)] animate-[fadeInSlide_400ms_cubic-bezier(0.23,1,0.32,1)_both] [animation-delay:200ms]">No geographic locations in this chapter.</div>}
		</section>
	);
}
