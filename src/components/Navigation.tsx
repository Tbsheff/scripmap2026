/*======================================================================
 * FILE:    Navigation.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2026
 *
 * DESCRIPTION: Component for the navigation panel.
 */

/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import { createRef, RefObject, useEffect, useMemo, useRef } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { LRUCache } from "lru-cache";
import {
    ANIMATION_DURATION,
    ANIMATION_KEY_NEXT,
    ANIMATION_KEY_PREVIOUS,
    MS_PER_HOUR
} from "../Constants";
import { AnimationState } from "../Types";
import "./Navigation.css";

/*----------------------------------------------------------------------
 *                      PRIVATE VARIABLES
 */
const nodeRefCache = new LRUCache<string, RefObject<HTMLDivElement>>({
    max: 30,
    ttl: 8 * MS_PER_HOUR,
    updateAgeOnGet: true
});

/*----------------------------------------------------------------------
 *                      PRIVATE HELPERS
 */
function classNamesFor(state: AnimationState | null) {
    if (state && state.animationKey) {
        if (state.animationKey === ANIMATION_KEY_NEXT) {
            return "slide-left";
        } else if (state.animationKey === ANIMATION_KEY_PREVIOUS) {
            return "slide-right";
        }
    }

    return "cross-fade";
}

/*----------------------------------------------------------------------
 *                      COMPONENT
 */
export default function Navigation() {
    const location = useLocation();
    const { pathname } = location;
    const state = location.state as AnimationState | null;
    const currentOutlet = useOutlet();
    const navRef = useRef<HTMLElement>(null);

    useEffect(() => {
        navRef.current?.focus();
    }, [pathname]);

    const nodeRef = useMemo(() => {
        if (!nodeRefCache.has(pathname)) {
            nodeRefCache.set(pathname, createRef<HTMLDivElement>());
        }
        return nodeRefCache.get(pathname)!;
    }, [pathname]);

    return (
        <nav id="scripture-content" ref={navRef} tabIndex={-1} aria-label="Scripture navigation" className="container">
            <TransitionGroup>
                <CSSTransition
                    key={pathname}
                    nodeRef={nodeRef}
                    timeout={ANIMATION_DURATION}
                    classNames={classNamesFor(state)}
                    unmountOnExit
                >
                    <div ref={nodeRef} className="nav-content">
                        {currentOutlet}
                    </div>
                </CSSTransition>
            </TransitionGroup>
        </nav>
    );
}
