/*======================================================================
 * FILE:    MapDataContextHook.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2026
 *
 * DESCRIPTION: Custom hooks for accessing the map contexts.
 */

/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import { use } from "react";
import { GeoplacesContext, GeoplacesContextType, FocusedGeoplaceContext, FocusedGeoplaceContextType } from "./MapData";

/*----------------------------------------------------------------------
 *                      CUSTOM HOOKS
 */
export function useGeoplacesContext(): GeoplacesContextType {
    const context = use(GeoplacesContext);

    if (!context) {
        throw new Error("useGeoplacesContext must be used within a GeoplacesContext provider");
    }

    return context;
}

export function useFocusedGeoplaceContext(): FocusedGeoplaceContextType {
    const context = use(FocusedGeoplaceContext);

    if (!context) {
        throw new Error("useFocusedGeoplaceContext must be used within a FocusedGeoplaceContext provider");
    }

    return context;
}
