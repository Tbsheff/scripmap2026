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
import { animationInit } from "./animation.js";
import { mapInit, showLocation } from "./mapHelper.js";
import { apiInit } from "./mapScripApi.js";
import { onHashChanged } from "./navigation.js";

/*------------------------------------------------------------------
 *                      PUBLIC METHODS
 */
export function init(callback: () => void): void {
    animationInit();
    apiInit(callback);
    mapInit();
}

export { onHashChanged };

export const panAndZoom = function (lat: number, lng: number, viewAltitude: number): void {
    showLocation(lat, lng, viewAltitude);
};
