/*======================================================================
 * FILE:    animation.ts
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2025
 *
 * DESCRIPTION: Module for managing animation of nav and breadcrumbs
 *              content in the Scriptures Mapped.
 */

/*------------------------------------------------------------------------
 *                      IMPORTS
 */
import { replaceNodeContent } from "./html.js";
import { AnimationType } from "./types.js";

/*------------------------------------------------------------------------
 *                      CONSTANTS
 */
const ID_CRUMBS1 = "crumbs1";
const ID_CRUMBS2 = "crumbs2";

/*------------------------------------------------------------------------
 *                      PRIVATE VARIABLES
 */
let offscreenCrumbs: HTMLElement | null;
let offscreenNav: HTMLElement | null;
let onscreenCrumbs: HTMLElement | null;
let onscreenNav: HTMLElement | null;

/*------------------------------------------------------------------------
 *                      PRIVATE METHODS
 */
const animateToNewContent = function (
    content: HTMLElement,
    animationType = AnimationType.crossFade,
    [onscreenDiv, offscreenDiv]: [HTMLElement, HTMLElement]
): void {
    prepareToAnimate(content, animationType, offscreenDiv);
    performAnimation(animationType, [onscreenDiv, offscreenDiv]);

    if (onscreenDiv === onscreenNav) {
        swapNavDivs();
    } else {
        swapCrumbDivs();
    }
};

const performAnimation = function (
    animationType: AnimationType,
    [onscreenDiv, offscreenDiv]: [HTMLElement, HTMLElement]
): void {
    onscreenDiv.classList.remove("onscreen");
    onscreenDiv.classList.add(`${animationType}-offscreen`);
    offscreenDiv.className = "animationUnit onscreen";
};

const prepareToAnimate = function (
    content: HTMLElement,
    animationType: AnimationType,
    offscreenDiv: HTMLElement
) {
    offscreenDiv.className = `animationUnit ${animationType}-prepare-offscreen`;
    replaceNodeContent(offscreenDiv, content);
    offscreenDiv.scrollTop = 0;
};

const swapCrumbDivs = function () {
    [onscreenCrumbs, offscreenCrumbs] = [offscreenCrumbs, onscreenCrumbs];
};

const swapNavDivs = function () {
    [onscreenNav, offscreenNav] = [offscreenNav, onscreenNav];
};

/*------------------------------------------------------------------------
 *                      PUBLIC METHODS
 */
export const animateToNewCrumbs = function (newCrumbs: HTMLElement): void {
    if (onscreenCrumbs && offscreenCrumbs) {
        animateToNewContent(newCrumbs, AnimationType.crossFade, [onscreenCrumbs, offscreenCrumbs]);
    }
};

export const animationInit = function (): void {
    offscreenCrumbs = document.getElementById(ID_CRUMBS1);
    onscreenCrumbs = document.getElementById(ID_CRUMBS2);
};
