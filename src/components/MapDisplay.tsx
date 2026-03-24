/*======================================================================
 * FILE:    MapDisplay.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2026
 *
 * DESCRIPTION: Map display router — renders MapLibre (default) or
 *              lazy-loaded Google Maps based on user preference.
 */

/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import { lazy, Suspense } from "react";
import MapDisplayMapLibre from "./MapDisplayMapLibre";

/*----------------------------------------------------------------------
 *                      LAZY IMPORTS
 */
const MapDisplayGoogle = lazy(() => import("./MapDisplayGoogle"));

/*----------------------------------------------------------------------
 *                      CONSTANTS
 */
const STORAGE_KEY = "scripmap-map-provider";

/*----------------------------------------------------------------------
 *                      HELPERS
 */
function getStoredProvider(): "maplibre" | "google" {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored === "google") {
			return "google";
		}
	} catch {
		// localStorage unavailable
	}
	return "maplibre";
}

/*----------------------------------------------------------------------
 *                      COMPONENT
 */
export default function MapDisplay() {
	const provider = getStoredProvider();

	if (provider === "google") {
		return (
			<Suspense fallback={null}>
				<MapDisplayGoogle />
			</Suspense>
		);
	}

	return <MapDisplayMapLibre />;
}
