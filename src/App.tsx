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
import LoadingIndicator, { ChapterLoadingIndicator, ScriptureLoadingIndicator } from "./components/LoadingIndicator";
import MainPage from "./components/MainPage";
import { ScripturesDataProvider } from "./context/ScripturesDataProvider";

function lazyWithRetry(factory: () => Promise<{ default: React.ComponentType }>) {
	return lazy(() =>
		factory().catch(() => {
			window.location.reload();
			return factory();
		}),
	);
}

const BookComponent = lazyWithRetry(() => import("./components/BookComponent"));
const ChapterComponent = lazyWithRetry(() => import("./components/ChapterComponent"));
const VolumesList = lazyWithRetry(() => import("./components/VolumesList"));
import "./App.css";
import "./styles/transitions.css";
import "./styles/content.css";

/*----------------------------------------------------------------------
 *                      PRIVATE HELPERS
 */
function ErrorPage() {
	return (
		<div
			role="alert"
			className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center bg-[var(--body-background-color)] text-[var(--body-text-color)]"
		>
			<h2 className="m-0 text-[var(--header-background-color)]">Something went wrong.</h2>
			<p className="m-0">Unable to load this page.</p>
			<Link
				to="/"
				className="text-[var(--header-text-color)] bg-[var(--header-background-color)] px-6 py-2.5 min-h-[2.5rem] rounded-xl no-underline mt-4 inline-flex items-center"
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
			{
				path: "",
				element: (
					<Suspense fallback={<LoadingIndicator />}>
						<VolumesList />
					</Suspense>
				),
			},
			{
				path: ":volumeSlug",
				element: (
					<Suspense fallback={<LoadingIndicator />}>
						<VolumesList />
					</Suspense>
				),
			},
			{
				path: ":volumeSlug/:bookSlug",
				element: (
					<Suspense fallback={<ChapterLoadingIndicator />}>
						<BookComponent />
					</Suspense>
				),
			},
			{
				path: ":volumeSlug/:bookSlug/:chapter",
				element: (
					<Suspense fallback={<ScriptureLoadingIndicator />}>
						<ChapterComponent />
					</Suspense>
				),
				hydrateFallbackElement: <ScriptureLoadingIndicator />,
				loader: chapterLoader,
			},
		],
	},
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
