/*======================================================================
 * FILE:    App.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2026
 *
 * DESCRIPTION: Top-level app component of our React app.
 */

/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import { lazy, Suspense } from "react";
import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import chapterLoader from "./components/ChapterLoader";
import LoadingIndicator from "./components/LoadingIndicator";
import MainPage from "./components/MainPage";
import { ScripturesDataProvider } from "./context/ScripturesDataProvider";

const BookComponent = lazy(() => import("./components/BookComponent"));
const ChapterComponent = lazy(() => import("./components/ChapterComponent"));
const VolumesList = lazy(() => import("./components/VolumesList"));
import "./App.css";
import "./Waves.js";
import "./Waves.css";

/*----------------------------------------------------------------------
 *                      PRIVATE HELPERS
 */
function ErrorPage() {
    return (
        <div role="alert" className="error-page">
            <h2>Something went wrong</h2>
            <p>Unable to load this page.</p>
            <Link to="/">Return to All Volumes</Link>
        </div>
    );
}

/*----------------------------------------------------------------------
 *                      ROUTER
 */
const router = createBrowserRouter([
    {
        path: "/",
        element: <MainPage />,
        errorElement: <ErrorPage />,
        children: [
            { path: "", element: <Suspense fallback={<LoadingIndicator />}><VolumesList /></Suspense> },
            { path: ":volumeId", element: <Suspense fallback={<LoadingIndicator />}><VolumesList /></Suspense> },
            { path: ":volumeId/:bookId", element: <Suspense fallback={<LoadingIndicator />}><BookComponent /></Suspense> },
            {
                path: ":volumeId/:bookId/:chapter",
                element: <Suspense fallback={<LoadingIndicator />}><ChapterComponent /></Suspense>,
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
