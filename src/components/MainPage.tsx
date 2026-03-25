/*======================================================================
 * FILE:    MainPage.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2026
 *
 * DESCRIPTION: App shell with sidebar + inset main container.
 */

/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import { X } from "lucide-react";
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import { MapErrorBoundary } from "./MapErrorBoundary";

const MapDisplay = lazy(() => import("./MapDisplay"));

import { ANIMATION_KEY_NEXT, ANIMATION_KEY_PREVIOUS } from "../Constants";
import { FocusedGeoplaceContext, GeoplacesContext } from "../context/MapData";
import { useScripturesDataContext } from "../context/ScripturesDataContextHook";
import type { GeoPlace, GeoPlaces } from "../Types";
import { bookBySlug } from "../utils/scriptureNavigation";
import Navigation from "./Navigation";
import { nextChapter, previousChapter } from "./NextPreviousComponent";
import Sidebar from "./Sidebar";

/*----------------------------------------------------------------------
 *                      COMPONENT
 */
export default function MainPage() {
	const [focusedGeoplace, setFocusedGeoplace] = useState<GeoPlace | null>(null);
	const [geoplaces, setGeoplaces] = useState<GeoPlaces | null>(null);
	const [mapOpen, setMapOpen] = useState(false);
	const [sidebarOpen, setSidebarOpen] = useState(() =>
		typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches
	);
	const { bookSlug, chapter } = useParams();
	const isChapterView = Boolean(chapter);
	const navigate = useNavigate();
	const location = useLocation();
	const { books, volumes } = useScripturesDataContext();
	const book = useMemo(() => bookBySlug(bookSlug ?? ""), [bookSlug, books]);
	const numericBookId = book?.id ?? 0;
	const chapterNum = Number(chapter);
	const prev = useMemo(
		() => previousChapter(numericBookId, chapterNum, books, volumes),
		[numericBookId, chapterNum, books, volumes],
	);
	const next = useMemo(
		() => nextChapter(numericBookId, chapterNum, books, volumes),
		[numericBookId, chapterNum, books, volumes],
	);

	const toggleMap = useCallback(() => setMapOpen((prev) => !prev), []);
	const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), []);

	useEffect(() => {
		if (window.matchMedia("(max-width: 1023px)").matches) {
			setSidebarOpen(false);
		}
	}, [location.pathname]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "b" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				toggleSidebar();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [toggleSidebar]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!isChapterView) {
				return;
			}
			const tag = (document.activeElement?.tagName ?? "").toLowerCase();
			if (tag === "input" || tag === "textarea") {
				return;
			}

			if (e.key === "ArrowLeft" && prev !== null) {
				navigate(`/${prev.volumeSlug}/${prev.bookSlug}/${prev.chapter}`, {
					state: { animationKey: ANIMATION_KEY_PREVIOUS },
				});
			}
			if (e.key === "ArrowRight" && next !== null) {
				navigate(`/${next.volumeSlug}/${next.bookSlug}/${next.chapter}`, {
					state: { animationKey: ANIMATION_KEY_NEXT },
				});
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isChapterView, prev, next, navigate]);

	useEffect(() => {
		window.showLocation = (_id, placename, latitude, longitude, viewAltitude) => {
			setFocusedGeoplace({ latitude, longitude, placename, viewAltitude });
			setMapOpen(true);
		};

		const handleScriptureClick = (e: MouseEvent) => {
			const target = (e.target as HTMLElement).closest?.(".scripturewrapper a");
			if (target) {
				for (const el of document.querySelectorAll(".place-active")) {
					el.classList.remove("place-active");
				}
				target.classList.add("place-active");
			}
		};
		document.addEventListener("click", handleScriptureClick);

		return () => {
			window.showLocation = undefined;
			document.removeEventListener("click", handleScriptureClick);
		};
	}, []);

	const geoplacesValue = useMemo(() => ({ geoplaces, setGeoplaces }), [geoplaces]);
	const focusedValue = useMemo(() => ({ focusedGeoplace, setFocusedGeoplace }), [focusedGeoplace]);

	return (
		<GeoplacesContext value={geoplacesValue}>
			<FocusedGeoplaceContext value={focusedValue}>
				<a className="absolute -left-[9999px] z-[var(--z-modal)] px-4 py-2 bg-[var(--header-background-color)] text-[var(--header-text-color)] focus:left-0 focus:top-0" href="#scripture-content">
					Skip to content
				</a>

				{/* Outer shell — full viewport, flex row */}
				<div className="flex h-dvh w-full overflow-hidden bg-[var(--surface-container-low)]">
					{sidebarOpen && (
						<div
							className="fixed inset-0 z-40 bg-black/30 lg:hidden"
							onClick={toggleSidebar}
						/>
					)}
					<Sidebar open={sidebarOpen} />

					{/* Main area — flex column with inset container */}
					<div className="flex min-h-0 min-w-0 flex-1 flex-col p-0 lg:p-2 lg:pl-0">
						{/* Inset card container */}
						<div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden lg:rounded-xl bg-[var(--surface)]">
							{/* Header */}
							<Header
								mapOpen={isChapterView && mapOpen}
								onToggleMap={isChapterView ? toggleMap : undefined}
								onToggleSidebar={toggleSidebar}
								prevChapter={isChapterView ? prev : null}
								nextChapter={isChapterView ? next : null}
							/>

							{/* Content + optional map */}
							<div
								className="flex min-h-0 min-w-0 flex-1 overflow-hidden"
								data-map-open={(isChapterView && mapOpen) || undefined}
							>
								{/* Scripture content */}
								<div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
									<Navigation />
								</div>

								{/* Map panel */}
								{isChapterView && mapOpen && (
									<div className="hidden sm:flex h-full w-[45%] min-w-[300px] max-w-[55%] p-2 pl-0">
										<div className="flex-1 h-full overflow-hidden rounded-lg">
											<MapErrorBoundary>
												<Suspense fallback={null}>
													<MapDisplay />
												</Suspense>
											</MapErrorBoundary>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Mobile map sheet */}
				{isChapterView && mapOpen && (
					<div className="sm:hidden fixed inset-0 z-40 flex flex-col bg-[var(--surface)] overflow-hidden pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]">
						<div className="relative flex items-center justify-end px-3 pt-5 pb-2 border-b border-[var(--outline-variant)]">
							<div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1.5 rounded-full bg-[var(--outline-variant)]" />
							<button
								type="button"
								onClick={toggleMap}
								className="flex items-center justify-center h-11 w-11 rounded-full text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)] hover:text-[var(--on-surface)] transition-colors"
								aria-label="Close map"
							>
								<X className="size-5" strokeWidth={1.5} />
							</button>
						</div>
						<div className="flex-1 min-h-0">
							<MapErrorBoundary>
								<Suspense fallback={null}>
									<MapDisplay />
								</Suspense>
							</MapErrorBoundary>
						</div>
					</div>
				)}
			</FocusedGeoplaceContext>
		</GeoplacesContext>
	);
}
