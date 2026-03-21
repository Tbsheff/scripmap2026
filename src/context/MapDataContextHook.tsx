/*======================================================================
 * FILE:    MapDataContextHook.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2026
 *
 * DESCRIPTION: Custom hook for accessing the map context.
 */

/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import { use } from "react";
import { MapContextType } from "../Types";
import { MapDataContext } from "./MapData";

/*----------------------------------------------------------------------
 *                      CUSTOM HOOK
 */
export function useMapContext(): MapContextType {
    const context = use(MapDataContext);

    if (!context) {
        throw new Error("useMapContext must be used within a MapDataContext provider");
    }

    return context;
}
