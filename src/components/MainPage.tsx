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
import Header from "./Header";
import MapDisplay from "./MapDisplay";
import Navigation from "./Navigation";
import NextPreviousComponent from "./NextPreviousComponent";

/*----------------------------------------------------------------------
 *                      COMPONENT
 */
export default function MainPage() {
    return (
        <main>
            <Header />
            <Navigation />
            <NextPreviousComponent />
            <MapDisplay />
        </main>
    );
}
