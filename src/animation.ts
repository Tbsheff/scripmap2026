// Constants

const ID_CRUMBS1 = "crumbs1";
const ID_CRUMBS2 = "crumbs2";

// Enums

enum AnimationType {
    slideLeft,
    slideRight,
    crossFade
}

// Private variables
let offscreenCrumbs: HTMLElement | null;
let offscreenNav: HTMLElement;
let onscreenCrumbs: HTMLElement | null;
let onscreenNav: HTMLElement;

// Helper methods

const animateToNewContent = function (animationType = AnimationType.crossFade): void {
    prepareToAnimate(animationType);
    performAnimation(animationType);
    swapDivs();
};

const performAnimation = function (animationType: AnimationType): void {
    // onscreenDiv.classList.remove("onscreen");
    // onscreenDiv.classList.add(`${animationType}-offscreen`);
    // offscreenDiv.className = "chapter onscreen";
};

const prepareToAnimate = function (animationType: AnimationType) {
    // offscreenDiv.className = `chapter ${animationType}-prepare-offscreen`;
    // updateContentForDiv(offscreenDiv);
    // offscreenDiv.scrollTop = 0;
};

const swapDivs = function () {
    // [onscreenDiv, offscreenDiv] = [offscreenDiv, onscreenDiv];
};

/*
 *                      PUBLIC METHODS
 */
export const animationInit = () => {
    offscreenCrumbs = document.getElementById(ID_CRUMBS1);
    onscreenCrumbs = document.getElementById(ID_CRUMBS2);
};
