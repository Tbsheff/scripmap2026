/*======================================================================
 * FILE:    Sidebar.tsx
 * AUTHOR:  Tyler Sheffield
 * DATE:    Winter 2026
 *
 * DESCRIPTION: Left sidebar with scripture tree navigation.
 */

import { BookOpen, ChevronDown, Church, Layers, ScrollText, Star } from "lucide-react";
import { memo, type ReactNode, useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useScripturesDataContext } from "../context/ScripturesDataContextHook";
import type { Volume } from "../Types";

const VOLUME_ICONS: Record<number, ReactNode> = {
	1: <BookOpen className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />,
	2: <ScrollText className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />,
	3: <Layers className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />,
	4: <Church className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />,
	5: <Star className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />,
};

function VolumeTree({ volume, isActive }: { volume: Volume; isActive: boolean }) {
	const [expanded, setExpanded] = useState(isActive);

	// Sync expanded state when active volume changes (e.g., navigation)
	useEffect(() => {
		if (isActive) {
			setExpanded(true);
		}
	}, [isActive]);
	const { bookSlug } = useParams();

	const toggle = useCallback(() => setExpanded((prev) => !prev), []);
	const icon = VOLUME_ICONS[volume.id];

	return (
		<div>
			<button
				className={`flex items-center gap-2 w-full px-6 py-2 border-none bg-transparent cursor-pointer
                    font-[Manrope] text-[0.9rem] font-medium text-left
                    rounded-r-full transition-all duration-200
                    ${
											isActive
												? "bg-[var(--surface-container)] text-[var(--on-surface)] font-semibold"
												: "text-[var(--on-surface)] opacity-80 hover:bg-[var(--surface-container-lowest)] hover:opacity-100"
										}`}
				type="button"
				onClick={toggle}
				aria-expanded={expanded}
			>
				{icon}
				<span className="flex-1 min-w-0 leading-tight">{volume.fullName}</span>
				<ChevronDown
					className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 opacity-50 ${expanded ? "rotate-180" : ""}`}
					strokeWidth={1.5}
				/>
			</button>

			{expanded && (
				<ul className="list-none m-0 py-0.5 pl-0">
					{volume.books.map((book) => {
						const active = bookSlug === book.urlPath;
						return (
							<li key={book.id}>
								<Link
									className={`block py-1.5 pl-12 pr-6 mr-3 text-[0.9rem] no-underline
                                        rounded-r-full transition-all duration-200
                                        ${
																					active
																						? "text-[var(--primary)] font-semibold bg-[var(--surface-container)]"
																						: "text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-lowest)] hover:text-[var(--on-surface)]"
																				}`}
									to={`/${volume.urlPath}/${book.urlPath}`}
								>
									{book.tocName}
								</Link>
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
}

export default memo(function Sidebar({ open = true }: { open?: boolean }) {
	const { isLoading, volumes } = useScripturesDataContext();
	const { volumeSlug } = useParams();

	return (
		<aside
			className={`hidden lg:flex flex-col shrink-0 overflow-y-auto overflow-x-hidden px-3 py-2
                        transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
                        ${open ? "w-60" : "w-0 px-0"}`}
		>
			<div className={`transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
				{/* Logo / Title */}
				<div className="flex h-12 shrink-0 items-center px-3">
					<Link to="/" className="flex items-center gap-2.5 no-underline text-[var(--on-surface)]">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" className="shrink-0" aria-hidden="true">
							<rect width="32" height="32" rx="6" fill="var(--primary)" />
							<g
								transform="translate(6 5)"
								fill="none"
								stroke="#ffffff"
								strokeWidth="1.8"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<polygon points="0 4 0 20 6.5 16.5 13.5 20 20 16.5 20 0.5 13.5 4 6.5 0 0 4" />
								<line x1="6.5" y1="0" x2="6.5" y2="16.5" />
								<line x1="13.5" y1="4" x2="13.5" y2="20" />
							</g>
						</svg>
						<span className="truncate font-semibold text-[0.9rem]">The Scriptures Mapped</span>
					</Link>
				</div>

				{/* Volume tree */}
				{!isLoading && volumes.length > 0 && (
					<nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto pb-2" aria-label="Scripture volumes">
						{volumes.map((volume) => (
							<VolumeTree key={volume.id} volume={volume} isActive={volumeSlug === volume.urlPath} />
						))}
					</nav>
				)}
			</div>
		</aside>
	);
});
