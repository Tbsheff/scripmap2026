/*======================================================================
 * FILE:    Breadcrumbs.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2026
 *
 * DESCRIPTION: Breadcrumb navigation component with inline dropdown controls.
 */

/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useScripturesDataContext } from "../context/ScripturesDataContextHook";
import { cn } from "../lib/utils";
import { bookBySlug, volumeBySlug } from "../utils/scriptureNavigation";

/*----------------------------------------------------------------------
 *                      SUBCOMPONENTS
 */
function BreadcrumbDropdown({ label, items, className }: {
	label: string;
	items: { name: string; to: string }[];
	className?: string;
}) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();

	useEffect(() => {
		if (!open) return;
		const handler = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, [open]);

	useEffect(() => {
		if (!open) return;
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false);
		};
		document.addEventListener("keydown", handler);
		return () => document.removeEventListener("keydown", handler);
	}, [open]);

	return (
		<div ref={ref} className="relative inline-flex">
			<button
				type="button"
				onClick={() => setOpen(!open)}
				className={cn(
					"inline-flex items-center gap-0.5 rounded px-1 py-0.5 text-inherit hover:bg-[var(--surface-container)] transition-colors",
					className,
				)}
			>
				<span className="truncate max-w-[8rem]">{label}</span>
				<ChevronDown className={cn("size-3 shrink-0 opacity-50 transition-transform", open && "rotate-180")} />
			</button>
			{open && (
				<div className="absolute top-full left-0 mt-1 z-50 min-w-[10rem] max-h-[16rem] overflow-y-auto rounded-lg bg-[var(--surface)] shadow-lg border border-[var(--outline-variant)] py-1">
					{items.map((item) => (
						<button
							key={item.to}
							type="button"
							className="block w-full text-left px-3 py-1.5 text-sm hover:bg-[var(--surface-container)] transition-colors truncate tabular-nums"
							onClick={() => {
								navigate(item.to);
								setOpen(false);
							}}
						>
							{item.name}
						</button>
					))}
				</div>
			)}
		</div>
	);
}

/*----------------------------------------------------------------------
 *                      COMPONENT
 */
export default function Breadcrumbs() {
	const { volumeSlug, bookSlug, chapter } = useParams();
	const { volumes } = useScripturesDataContext();

	const volume = volumeBySlug(volumeSlug ?? "");
	const book = bookBySlug(bookSlug ?? "");

	const volumeItems = volumes.map((v) => ({
		name: v.fullName,
		to: `/${v.urlPath}`,
	}));

	const bookItems = volume?.books?.map((b) => ({
		name: b.tocName,
		to: `/${volume.urlPath}/${b.urlPath}`,
	})) ?? [];

	const chapterItems = book
		? Array.from({ length: book.numChapters }, (_, i) => ({
			name: String(i + 1),
			to: `/${volume?.urlPath}/${book.urlPath}/${i + 1}`,
		}))
		: [];

	return (
		<div className="flex items-center gap-0.5 min-w-0 text-sm text-[var(--on-surface-variant)]">
			<Link
				to="/"
				className="shrink-0 text-[var(--on-surface-variant)] no-underline hover:text-[var(--primary)] transition-colors hidden sm:inline"
			>
				Home
			</Link>

			{volumeSlug && volume && (
				<>
					<span className="text-[var(--on-surface-variant)] opacity-40 mx-0.5 hidden sm:inline">›</span>
					{bookSlug ? (
						<BreadcrumbDropdown label={volume.fullName} items={volumeItems} />
					) : (
						<span className="truncate font-medium text-[var(--on-surface)]">{volume.fullName}</span>
					)}
				</>
			)}

			{bookSlug && book && (
				<>
					<span className="text-[var(--on-surface-variant)] opacity-40 mx-0.5">›</span>
					{chapter ? (
						<BreadcrumbDropdown label={book.tocName} items={bookItems} />
					) : (
						<span className="truncate font-medium text-[var(--on-surface)]">{book.tocName}</span>
					)}
				</>
			)}

			{chapter && (
				<>
					<span className="text-[var(--on-surface-variant)] opacity-40 mx-0.5">›</span>
					{book && book.numChapters > 1 ? (
						<BreadcrumbDropdown label={chapter} items={chapterItems} />
					) : (
						<span className="tabular-nums font-medium text-[var(--on-surface)]">{chapter}</span>
					)}
				</>
			)}
		</div>
	);
}
