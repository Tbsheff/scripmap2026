/*======================================================================
 * FILE:    MainPage.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2025
 *
 * DESCRIPTION: Component with major high-level components of app.
 */

/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import { useEffect } from "react";
import Header from "./Header";
import MapDisplay from "./MapDisplay";
import Navigation from "./Navigation";
import NextPreviousComponent from "./NextPreviousComponent";
import { useScripturesDataContext } from "../context/ScripturesDataContextHook";

/*----------------------------------------------------------------------
 *                      COMPONENT
 */
export default function MainPage() {
    const { setFocusedGeoplace } = useScripturesDataContext();

    useEffect(() => {
        window.showLocation = (
            _id,
            placename,
            latitude,
            longitude,
            viewAltitude
        ) => {
            setFocusedGeoplace({ latitude, longitude, placename, viewAltitude });
        };
    }, [setFocusedGeoplace]);

    return (
        <main>
            <Header />
            <Navigation />
            <NextPreviousComponent />
            <MapDisplay />
        </main>
    );
}
