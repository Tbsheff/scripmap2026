/*======================================================================
 * FILE:    ScripturesDataProvider.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2026
 *
 * DESCRIPTION: Provider component of our context pattern.
 */

/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import { ReactNode, useMemo } from "react";
import { useFetchScripturesData } from "../ServerApi";
import { ScripturesDataContext } from "./ScripturesData";

/*----------------------------------------------------------------------
 *                      COMPONENT
 */
export function ScripturesDataProvider({ children }: { children: ReactNode }) {
    const { books, error, isLoading, volumes } = useFetchScripturesData();

    const contextValue = useMemo(
        () => ({ books, error, isLoading, volumes }),
        [books, error, isLoading, volumes]
    );

    return (
        <ScripturesDataContext
            value={contextValue}
        >
            {children}
        </ScripturesDataContext>
    );
}
