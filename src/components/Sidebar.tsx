/*======================================================================
 * FILE:    Sidebar.tsx
 * AUTHOR:  Tyler Sheffield
 * DATE:    Winter 2026
 *
 * DESCRIPTION: Left sidebar with scripture tree navigation.
 */

import { useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { useScripturesDataContext } from "../context/ScripturesDataContextHook";
import { Volume } from "../Types";

const VOLUME_ICONS: Record<number, string> = {
    1: "menu_book",
    2: "auto_stories",
    3: "history_edu",
    4: "church",
    5: "star",
};

function VolumeTree({ volume, isActive }: { volume: Volume; isActive: boolean }) {
    const [expanded, setExpanded] = useState(isActive);
    const { bookSlug } = useParams();

    const toggle = useCallback(() => setExpanded((prev) => !prev), []);
    const icon = VOLUME_ICONS[volume.id] ?? "book";

    return (
        <div>
            <button
                className={`flex items-center gap-2.5 w-full px-6 py-2.5 border-none bg-transparent cursor-pointer
                    font-[Manrope] text-[0.7rem] font-bold tracking-[0.05em] uppercase text-left
                    rounded-r-full transition-all duration-200
                    ${isActive
                        ? "bg-[var(--primary-container)] text-[var(--primary)] opacity-100"
                        : "text-[var(--on-surface)] opacity-70 hover:bg-[var(--surface-container-lowest)] hover:opacity-100"
                    }`}
                onClick={toggle}
                aria-expanded={expanded}
            >
                <span className="material-symbols-outlined text-xl shrink-0">{icon}</span>
                <span className="flex-1 min-w-0 leading-tight">{volume.fullName}</span>
                <span className={`material-symbols-outlined text-xl shrink-0 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}>
                    expand_more
                </span>
            </button>

            {expanded && (
                <ul className="list-none m-0 py-1 pl-0">
                    {volume.books.map((book) => {
                        const active = bookSlug === book.urlPath;
                        return (
                            <li key={book.id}>
                                <Link
                                    className={`block py-1.5 pl-14 pr-6 mr-3 font-serif text-[0.8rem] no-underline
                                        rounded-r-full transition-all duration-200
                                        ${active
                                            ? "text-[var(--primary)] font-semibold bg-[var(--primary-container)]"
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

export default function Sidebar() {
    const { isLoading, volumes } = useScripturesDataContext();
    const { volumeSlug } = useParams();

    return (
        <aside className="hidden lg:flex flex-col w-[18rem] shrink-0 overflow-y-auto overflow-x-hidden pt-6"
        >

            <div className="px-6 pb-6">
                <span className="block font-serif text-lg italic text-[var(--on-surface)]">
                    The Scriptures Mapped
                </span>
            </div>

            {!isLoading && volumes.length > 0 && (
                <nav className="flex flex-col gap-0.5 pr-3" aria-label="Scripture volumes">
                    {volumes.map((volume) => (
                        <VolumeTree
                            key={volume.id}
                            volume={volume}
                            isActive={volumeSlug === volume.urlPath}
                        />
                    ))}
                </nav>
            )}
        </aside>
    );
}
