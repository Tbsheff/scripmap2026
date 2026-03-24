/*======================================================================
 * FILE:    MapData.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2026
 *
 * DESCRIPTION: Variable for holding the map context.
 */

/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import { createContext } from "react";
import type { GeoPlace, GeoPlaces } from "../Types";

/*----------------------------------------------------------------------
 *                      PUBLIC VARIABLES
 */
export type GeoplacesContextType = {
	geoplaces: GeoPlaces | null;
	setGeoplaces: (geoplaces: GeoPlaces | null) => void;
};

export type FocusedGeoplaceContextType = {
	focusedGeoplace: GeoPlace | null;
	setFocusedGeoplace: (geoplace: GeoPlace | null) => void;
};

export const GeoplacesContext = createContext<GeoplacesContextType | null>(null);
export const FocusedGeoplaceContext = createContext<FocusedGeoplaceContextType | null>(null);
