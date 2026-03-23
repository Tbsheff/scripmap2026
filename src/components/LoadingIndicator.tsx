/*======================================================================
 * FILE:    LoadingIndicator.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2026
 *
 * DESCRIPTION: Loading indicator to display when waiting for async
 *     operation to complete.
 */

import "./LoadingIndicator.css";

/*----------------------------------------------------------------------
 *                      COMPONENT
 */
export default function LoadingIndicator() {
    return (
        <div role="status" aria-live="polite" className="loading-skeleton">
            <span className="loading-skeleton__sr-only">Loading...</span>
            <div className="loading-skeleton__pill" />
            <div className="loading-skeleton__pill" />
            <div className="loading-skeleton__pill" />
            <div className="loading-skeleton__pill" />
        </div>
    );
}
