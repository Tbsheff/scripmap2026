/*======================================================================
 * FILE:    App.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2025
 *
 * DESCRIPTION: Top-level app component of our React app.
 */

/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import BookComponent from "./components/BookComponent";
import ChapterComponent from "./components/ChapterComponent.js";
import chapterLoader from "./components/ChapterLoader.js";
import LoadingIndicator from "./components/LoadingIndicator.js";
import MainPage from "./components/MainPage";
import { ScripturesDataProvider } from "./context/ScripturesDataProvider";
import VolumesList from "./components/VolumesList";
import "./App.css";
import "./Waves.js";
import "./Waves.css";

/*----------------------------------------------------------------------
 *                      PRIVATE HELPERS
 */
function ErrorPage() {
    return <div>There was a routing error.</div>;
}

/*----------------------------------------------------------------------
 *                      ROUTER
 */
const router = createBrowserRouter([
    {
        path: "*",
        element: <MainPage />,
        errorElement: <ErrorPage />,
        children: [
            { path: "", element: <VolumesList /> },
            { path: ":volumeId", element: <VolumesList /> },
            { path: ":volumeId/:bookId", element: <BookComponent /> },
            {
                path: ":volumeId/:bookId/:chapter",
                element: <ChapterComponent />,
                hydrateFallbackElement: <LoadingIndicator />,
                loader: chapterLoader
            }
        ]
    }
]);

/*----------------------------------------------------------------------
 *                      COMPONENT
 */
export default function App() {
    return (
        <ScripturesDataProvider>
            <RouterProvider router={router} />
        </ScripturesDataProvider>
    );
}
