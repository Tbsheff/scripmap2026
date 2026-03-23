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
import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import BookComponent from "./components/BookComponent";
import ChapterComponent from "./components/ChapterComponent";
import chapterLoader from "./components/ChapterLoader";
import LoadingIndicator from "./components/LoadingIndicator";
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
    return (
        <div
            role="alert"
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                gap: "1rem",
                padding: "2rem",
                textAlign: "center",
                backgroundColor: "var(--body-background-color)",
                color: "var(--body-text-color)",
            }}
        >
            <h2 style={{ margin: 0, color: "var(--header-background-color)" }}>
                Something went wrong
            </h2>
            <p style={{ margin: 0 }}>Unable to load this page.</p>
            <Link
                to="/"
                style={{
                    color: "var(--header-text-color)",
                    backgroundColor: "var(--header-background-color)",
                    padding: "0.5rem 1.25rem",
                    borderRadius: "4px",
                    textDecoration: "none",
                    fontWeight: "bold",
                }}
            >
                Return to All Volumes
            </Link>
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
