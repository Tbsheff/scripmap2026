/*======================================================================
 * FILE:    VolumesList.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2026
 *
 * DESCRIPTION: Editorial scripture selection hub with bento layout.
 */

/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import { Link, useParams } from "react-router-dom";
import { VOLUME_LABELS } from "../Constants";
import { useScripturesDataContext } from "../context/ScripturesDataContextHook";
import type { Book, Volume } from "../Types";
import { volumeBySlug } from "../utils/scriptureNavigation";
import LoadingIndicator from "./LoadingIndicator";

/*----------------------------------------------------------------------
 *                      SUB-COMPONENTS
 */
function BookCard({ volume, book }: { volume: Volume; book: Book }) {
	return (
		<Link
			className="book-card flex flex-col bg-[var(--surface-container-lowest)] px-3 pt-3 pb-2.5 sm:px-5 sm:pt-5 sm:pb-4 rounded-xl no-underline text-[var(--on-surface)] text-left relative overflow-hidden active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
			id={String(book.id)}
			to={`/${volume.urlPath}/${book.urlPath}`}
		>
			<span className="book-abbr block font-sans text-[0.65rem] font-bold tracking-[0.12em] uppercase text-[var(--on-surface-variant)] mb-1 max-sm:hidden">
				{book.citeAbbr}
			</span>
			<span className="font-serif text-[1.05rem] font-medium leading-tight max-sm:text-[0.9rem]">{book.fullName}</span>
		</Link>
	);
}

function VolumeSection({ volume, label }: { volume: Volume; label: string }) {
	return (
		<section className="vol-section">
			<div className="flex items-end justify-between mb-6 pb-4 border-b border-[var(--outline-variant)] border-l-[3px] border-l-[var(--primary)] pl-4">
				<div>
					<span className="block font-sans text-[0.7rem] font-bold tracking-[0.15em] uppercase text-[var(--primary)] mb-1">
						{label}
					</span>
					<h2 className="font-serif text-[1.875rem] max-sm:text-2xl font-bold text-[var(--on-surface)] m-0 tracking-[-0.01em]">
						{volume.fullName}
					</h2>
				</div>
			</div>
			<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
				{volume.books.map((book) => (
					<BookCard volume={volume} book={book} key={book.id} />
				))}
			</div>
		</section>
	);
}

/*----------------------------------------------------------------------
 *                      COMPONENT
 */
export default function VolumesList() {
	const { error, isLoading, volumes } = useScripturesDataContext();
	const { volumeSlug } = useParams();

	if (isLoading) {
		return <LoadingIndicator />;
	}

	if (error) {
		return (
			<div role="alert" className="p-8 text-center">
				{error}
				<button
					type="button"
					onClick={() => window.location.reload()}
					className="mt-3 text-sm text-[var(--primary)] hover:underline cursor-pointer block mx-auto"
				>
					Reload page
				</button>
			</div>
		);
	}

	if (volumeSlug) {
		const volume = volumeBySlug(volumeSlug);
		if (!volume) {
			return (
				<div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
					<p className="m-0">Volume not found.</p>
					<Link
						to="/"
						className="text-[var(--header-text-color)] bg-[var(--header-background-color)] px-6 py-2.5 min-h-[2.5rem] rounded-xl mt-4 no-underline inline-flex items-center"
					>
						Return to All Volumes
					</Link>
				</div>
			);
		}
		const label = VOLUME_LABELS[volume.id - 1] ?? `Volume ${volume.id}`;
		return (
			<div className="max-w-[75rem] mx-auto px-4 pt-5 pb-16 sm:px-10 sm:pt-8 sm:pb-24">
				<VolumeSection volume={volume} label={label} />
			</div>
		);
	}

	return (
		<div className="max-w-[75rem] mx-auto px-4 pt-5 pb-16 sm:px-10 sm:pt-8 sm:pb-24">
			<header className="hub-header mb-14 max-sm:mb-8">
				<h1 className="font-serif text-5xl max-sm:text-[2rem] font-bold tracking-tight text-[var(--on-surface)] m-0 mb-4">{`The Scriptures Mapped`}</h1>
				<p className="font-serif text-[1.05rem] max-sm:text-[0.9rem] text-[var(--on-surface-variant)] max-w-[36rem] leading-relaxed m-0">
					Explore scripture and geography together.
				</p>
			</header>

			<div className="flex flex-col gap-16 max-sm:gap-10">
				{volumes.map((volume, i) => (
					<VolumeSection key={volume.id} volume={volume} label={VOLUME_LABELS[i] ?? `Volume ${volume.id}`} />
				))}
			</div>
		</div>
	);
}
