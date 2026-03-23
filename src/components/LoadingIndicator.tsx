/*======================================================================
 * FILE:    LoadingIndicator.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2026
 *
 * DESCRIPTION: Editorial loading states that mirror the content layout.
 */

import "./LoadingIndicator.css";

/*----------------------------------------------------------------------
 *                      COMPONENTS
 */

/** Default loading — book card grid skeleton */
export default function LoadingIndicator() {
    return (
        <div role="status" aria-live="polite" className="loading-hub">
            <span className="sr-only">Loading...</span>

            {/* Volume header skeleton */}
            <div className="loading-header">
                <div className="skeleton skeleton--label" />
                <div className="skeleton skeleton--title" />
            </div>

            {/* Book card grid skeleton */}
            <div className="loading-grid">
                {Array.from({ length: 12 }, (_, i) => (
                    <div key={i} className="skeleton skeleton--card" style={{ animationDelay: `${i * 60}ms` }} />
                ))}
            </div>
        </div>
    );
}

/** Chapter grid loading skeleton */
export function ChapterLoadingIndicator() {
    return (
        <div role="status" aria-live="polite" className="loading-hub">
            <span className="sr-only">Loading chapters...</span>

            <div className="loading-header">
                <div className="skeleton skeleton--label" />
                <div className="skeleton skeleton--title" />
            </div>

            <div className="loading-chapter-grid">
                {Array.from({ length: 20 }, (_, i) => (
                    <div key={i} className="skeleton skeleton--chapter" style={{ animationDelay: `${i * 30}ms` }} />
                ))}
            </div>
        </div>
    );
}

/** Scripture reading loading skeleton */
export function ScriptureLoadingIndicator() {
    return (
        <div role="status" aria-live="polite" className="loading-scripture">
            <span className="sr-only">Loading scripture...</span>

            {/* Chapter heading skeleton */}
            <div className="loading-scripture__heading">
                <div className="skeleton skeleton--label-centered" />
                <div className="skeleton skeleton--display" />
                <div className="skeleton skeleton--label-centered" />
            </div>

            {/* Verse line skeletons */}
            <div className="loading-scripture__lines">
                {Array.from({ length: 8 }, (_, i) => (
                    <div
                        key={i}
                        className="skeleton skeleton--line"
                        style={{
                            animationDelay: `${200 + i * 50}ms`,
                            width: `${75 + Math.sin(i * 1.7) * 20}%`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
