/*======================================================================
 * FILE:    main.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2026
 *
 * DESCRIPTION: Code to mount our React app in the main web page.
 */

/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

/*----------------------------------------------------------------------
 *                      MAIN LOGIC
 */
const rootDiv = document.getElementById("root");

if (rootDiv) {
    createRoot(rootDiv).render(
        <StrictMode>
            <App />
        </StrictMode>
    );
}
