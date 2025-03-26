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
import Navigation from "./Navigation";
import NextPreviousComponent from "./NextPreviousComponent";

/*----------------------------------------------------------------------
 *                      PRIVATE HELPERS
 */
function MapDisplay() {
    return <section className="MapDisplay">MapDisplay</section>;
}

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
