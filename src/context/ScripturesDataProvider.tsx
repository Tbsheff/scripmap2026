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
import { ReactNode } from "react";
import { useFetchScripturesData } from "../ServerApi";
import { ScripturesDataContext } from "./ScripturesData";

/*----------------------------------------------------------------------
 *                      COMPONENT
 */
export function ScripturesDataProvider({ children }: { children: ReactNode }) {
    const { books, error, isLoading, volumes } = useFetchScripturesData();

    return (
        <ScripturesDataContext
            value={{
                books,
                error,
                isLoading,
                volumes
            }}
        >
            {children}
        </ScripturesDataContext>
    );
}
