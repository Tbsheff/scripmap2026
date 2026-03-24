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
import { createRef, type RefObject, useEffect, useMemo, useRef } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { ANIMATION_DURATION, ANIMATION_KEY_NEXT, ANIMATION_KEY_PREVIOUS } from "../Constants";
import type { AnimationState } from "../Types";

/*----------------------------------------------------------------------
 *                      PRIVATE VARIABLES
 */
const nodeRefCache = new Map<string, RefObject<HTMLDivElement | null>>();

/*----------------------------------------------------------------------
 *                      PRIVATE HELPERS
 */
function classNamesFor(state: AnimationState | null) {
	if (state?.animationKey) {
		if (state.animationKey === ANIMATION_KEY_NEXT) {
			return "slide-left";
		}
		if (state.animationKey === ANIMATION_KEY_PREVIOUS) {
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
		let ref = nodeRefCache.get(pathname);
		if (!ref) {
			ref = createRef<HTMLDivElement>();
			nodeRefCache.set(pathname, ref);
			if (nodeRefCache.size > 30) {
				const firstKey = nodeRefCache.keys().next().value;
				if (firstKey !== undefined) {
					nodeRefCache.delete(firstKey);
				}
			}
		}
		return ref;
	}, [pathname]);

	return (
		<nav
			id="scripture-content"
			ref={navRef}
			tabIndex={-1}
			aria-label="Scripture navigation"
			className="grid grid-rows-[minmax(0,1fr)] overflow-hidden flex-1 min-h-0"
		>
			<TransitionGroup className="contents">
				<CSSTransition
					key={pathname}
					nodeRef={nodeRef}
					timeout={ANIMATION_DURATION}
					classNames={classNamesFor(state)}
					unmountOnExit
				>
					<div ref={nodeRef} className="[grid-area:1/1] overflow-y-auto min-h-0 scroll-smooth">
						{currentOutlet}
					</div>
				</CSSTransition>
			</TransitionGroup>
		</nav>
	);
}
