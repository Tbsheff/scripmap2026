/*======================================================================
 * FILE:    ScripturesDataContextHook.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2026
 *
 * DESCRIPTION: Custom hook for accessing our app's context.
 */

/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import { use } from "react";
import type { ScripturesContextType } from "../Types";
import { ScripturesDataContext } from "./ScripturesData";

/*----------------------------------------------------------------------
 *                      CUSTOM HOOK
 */
export function useScripturesDataContext(): ScripturesContextType {
	const context = use(ScripturesDataContext);

	if (!context) {
		throw new Error("useScripturesDataContext must be used within a ScripturesDataProvider");
	}

	return context;
}
