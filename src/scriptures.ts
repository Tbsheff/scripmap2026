/*======================================================================
 * FILE:    scriptures.ts
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2025
 *
 * DESCRIPTION: Front-end JavaScript code for the Scriptures Mapped,
 *              IS 542, Winter 2025, BYU.
 */

/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import { mapInit, showLocation } from "./mapHelper.js";
import { apiInit } from "./mapScripApi.js";
import { onHashChanged } from "./navigation.js";

/*------------------------------------------------------------------
 *                      CONSTANTS
 */
const ID_NAV_ELEMENT = "nav-root";

/*------------------------------------------------------------------
 *                      PRIVATE VARIABLES
 */
export let navElement: HTMLElement;

/*------------------------------------------------------------------
 *                      PUBLIC METHODS
 */
export function init(callback: () => void): void {
    apiInit(callback);
    mapInit();

    // look up all the DOM elements we want to manipulate
    const nav = document.getElementById(ID_NAV_ELEMENT);

    if (nav) {
        navElement = nav;
    }
}

export { onHashChanged };

export const panAndZoom = function (lat: number, lng: number, viewAltitude: number): void {
    showLocation(lat, lng, viewAltitude);
};
