/*======================================================================
 * FILE:    ChapterComponent.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2026
 *
 * DESCRIPTION: Chapter component displaying a chapter's HTML.
 */

/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import { useEffect, useMemo, useRef } from "react";
import { Link, useLoaderData, useParams } from "react-router-dom";
import { ANIMATION_KEY_NEXT, ANIMATION_KEY_PREVIOUS, ANIMATION_MARKER_DELAY } from "../Constants";
import { useFocusedGeoplaceContext, useGeoplacesContext } from "../context/MapDataContextHook";
import { useScripturesDataContext } from "../context/ScripturesDataContextHook";
import type { ChapterCacheEntry } from "../Types";
import { bookBySlug } from "../utils/scriptureNavigation";
import { nextChapter, previousChapter } from "./NextPreviousComponent";

/*----------------------------------------------------------------------
 *                      COMPONENT
 */
export default function ChapterComponent() {
	const { bookSlug, chapter } = useParams();
	const { setGeoplaces } = useGeoplacesContext();
	const { setFocusedGeoplace } = useFocusedGeoplaceContext();
	const { books, volumes } = useScripturesDataContext();
	const book = useMemo(() => bookBySlug(bookSlug ?? ""), [bookSlug]);
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
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
	const loaderData = useLoaderData() as ChapterCacheEntry | undefined;
	const cachedDataRef = useRef(loaderData);
	if (loaderData) {
		cachedDataRef.current = loaderData;
	}

	useEffect(() => {
		if (loaderData) {
			const timer = setTimeout(() => {
				setGeoplaces(loaderData.geoplaces);
				setFocusedGeoplace(null);
			}, ANIMATION_MARKER_DELAY);

			return () => {
				clearTimeout(timer);
			};
		}
		setGeoplaces(null);
	}, [loaderData, setFocusedGeoplace, setGeoplaces]);

	const html = loaderData?.html ?? cachedDataRef.current?.html;
	const innerHtml = useMemo(() => ({ __html: html ?? "" }), [html]);

	if (!html) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
				<p className="m-0">No content available for this chapter.</p>
				<Link
					to="/"
					className="text-[var(--header-text-color)] bg-[var(--header-background-color)] px-6 py-2.5 min-h-[2.5rem] rounded-xl mt-4 no-underline inline-flex items-center"
				>
					Return to All Volumes
				</Link>
			</div>
		);
	}

	return (
		<>
			{/* biome-ignore lint/security/noDangerouslySetInnerHtml: server-rendered scripture content */}
			<div className="chapter-content" dangerouslySetInnerHTML={innerHtml} />
			{(prev.bookId > 0 || next.bookId > 0) && (
				<div className="flex w-full max-w-[36rem] mx-auto px-12 py-8 mt-4 border-t border-[var(--outline-variant)]">
					<div className="flex-1">
						{prev.bookId > 0 && (
							<Link
								to={`/${prev.volumeSlug}/${prev.bookSlug}/${prev.chapter}`}
								state={{ animationKey: ANIMATION_KEY_PREVIOUS }}
								aria-label={`Previous: ${prev.title}`}
								className="inline-flex items-center gap-1 text-sm text-[var(--on-surface-variant)] hover:text-[var(--primary)] transition-colors"
							>
								<span aria-hidden="true">‹</span>
								<span className="font-medium">{prev.title}</span>
							</Link>
						)}
					</div>
					<div className="flex-1 text-right">
						{next.bookId > 0 && (
							<Link
								to={`/${next.volumeSlug}/${next.bookSlug}/${next.chapter}`}
								state={{ animationKey: ANIMATION_KEY_NEXT }}
								aria-label={`Next: ${next.title}`}
								className="inline-flex items-center gap-1 text-sm text-[var(--on-surface-variant)] hover:text-[var(--primary)] transition-colors"
							>
								<span className="font-medium">{next.title}</span>
								<span aria-hidden="true">›</span>
							</Link>
						)}
					</div>
				</div>
			)}
		</>
	);
}
