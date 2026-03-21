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
import { MapContextType } from "../Types";

/*----------------------------------------------------------------------
 *                      PUBLIC VARIABLE
 */
export const MapDataContext = createContext<MapContextType | null>(null);
