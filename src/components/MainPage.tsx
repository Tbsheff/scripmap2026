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
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const { bookSlug, chapter } = useParams();
	const isChapterView = Boolean(chapter);
	const navigate = useNavigate();
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
		if (!isChapterView) {
			setMapOpen(false);
		}
	}, [isChapterView]);

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
				<a className="skip-to-content" href="#scripture-content">
					Skip to content
				</a>

				{/* Outer shell — full viewport, flex row */}
				<div className="flex h-dvh w-full overflow-hidden bg-[var(--surface-container-low)]">
					{/* Sidebar — desktop only, collapsible */}
					<Sidebar open={sidebarOpen} />

					{/* Main area — flex column with inset container */}
					<div className="flex min-h-0 flex-1 flex-col p-0 lg:p-2 lg:pl-0">
						{/* Inset card container */}
						<div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:rounded-xl bg-[var(--surface)]">
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
								className="flex min-h-0 flex-1 overflow-hidden"
								data-map-open={(isChapterView && mapOpen) || undefined}
							>
								{/* Scripture content */}
								<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
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
			</FocusedGeoplaceContext>
		</GeoplacesContext>
	);
}
