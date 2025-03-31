/*======================================================================
 * FILE:    ScripturesDataProvider.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2025
 *
 * DESCRIPTION: Provider component of our context pattern.
 */

/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import { ReactNode, useState } from "react";
import { useFetchScripturesData } from "../ServerApi";
import { ScripturesDataContext } from "./ScripturesData";
import { GeoPlaces } from "../Types";

/*----------------------------------------------------------------------
 *                      COMPONENT
 */
export function ScripturesDataProvider({ children }: { children: ReactNode }) {
    const { books, isLoading, volumes } = useFetchScripturesData();
    const [geoplaces, setGeoplaces] = useState(null as GeoPlaces | null);

    return (
        <ScripturesDataContext value={{ books, geoplaces, isLoading, setGeoplaces, volumes }}>
            {children}
        </ScripturesDataContext>
    );
}
