/*======================================================================
 * FILE:    Constants.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2025
 *
 * DESCRIPTION: Shared constants for the Scriptures Mapped.
 */

/*----------------------------------------------------------------------
 *                      CONSTANTS
 */
export const ANIMATION_KEY_NEXT = "n";
export const ANIMATION_KEY_PREVIOUS = "p";
export const CLASS_BUTTON = "waves-effect waves-custom waves-ripple btn";
export const HOME_BREADCRUMB = "The Scriptures";

export const ICON_NEXT = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 53.59 182">
        <polyline
            className="nav-icon"
            points="6.5 6.5 48 91 6.5 175.5"
            fill="none"
            stroke="#231f20"
            stroke-linecap="round"
            stroke-miterlimit="13"
            stroke-width="13"
        />
    </svg>
);

export const ICON_NEXT_SMALL = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60.59 220">
        <polyline
            className="nav-icon"
            points="13.5 51.5 55 129 13.5 206.5"
            fill="none"
            stroke="#231f20"
            stroke-linecap="round"
            stroke-miterlimit="20"
            stroke-width="20"
        />
    </svg>
);

export const ICON_PREVIOUS = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 53.59 182">
        <polyline
            points="47.09 6.5 5.59 91 47.09 175.5"
            className="nav-icon"
            fill="none"
            stroke="#231f20"
            stroke-linecap="round"
            stroke-miterlimit="13"
            stroke-width="13"
        />
    </svg>
);

export const ICON_PREVIOUS_SMALL = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60.59 220">
        <polyline
            points="54.09 51.5 12.59 129 54.09 206.5"
            className="nav-icon"
            fill="none"
            stroke="#231f20"
            stroke-linecap="round"
            stroke-miterlimit="20"
            stroke-width="20"
        />
    </svg>
);

export const MS_PER_HOUR = 1000 * 60 * 60;
