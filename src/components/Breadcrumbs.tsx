/*======================================================================
 * FILE:    Breadcrumbs.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2026
 *
 * DESCRIPTION: Breadcrumb navigation component.
 */

/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { HOME_BREADCRUMB } from "../Constants";
import { bookBySlug, volumeBySlug } from "../utils/scriptureNavigation";

/*----------------------------------------------------------------------
 *                      COMPONENT
 */
export default function Breadcrumbs() {
	const { volumeSlug, bookSlug, chapter } = useParams();
	const volume = volumeBySlug(volumeSlug ?? "");
	const book = bookBySlug(bookSlug ?? "");

	const crumbs = useMemo(() => {
		const items = [];

		if (!volumeSlug || volume === undefined) {
			items.push(
				<li key="t" aria-current="page" className="min-w-0 truncate">
					{HOME_BREADCRUMB}
				</li>,
			);
		} else {
			items.push(
				<li key="t" className="hidden sm:block min-w-0 truncate">
					<Link to="/">{HOME_BREADCRUMB}</Link>
				</li>,
			);

			if (!bookSlug || book === undefined) {
				items.push(
					<li key={`v${volume.id}`} aria-current="page" className="min-w-0 truncate">
						{volume.fullName}
					</li>,
				);
			} else {
				items.push(
					<li key={`v${volume.id}`} className="min-w-0 truncate">
						<Link to={`/${volume.urlPath}`}>{volume.fullName}</Link>
					</li>,
				);

				if (chapter === undefined || Number(chapter) <= 0) {
					items.push(
						<li key={`b${book.id}`} aria-current="page" className="min-w-0 truncate">
							{book.tocName}
						</li>,
					);
				} else {
					items.push(
						<li key={`b${book.id}`} className="min-w-0 truncate">
							<Link to={`/${volume.urlPath}/${book.urlPath}`}>{book.tocName}</Link>
						</li>,
					);

					items.push(
						<li key={`c${chapter}`} aria-current="page" className="min-w-0 truncate tabular-nums">
							{chapter}
						</li>,
					);
				}
			}
		}

		return items;
	}, [volumeSlug, bookSlug, chapter, volume, book]);

	return (
		<div className="flex-auto min-w-0 overflow-hidden">
			<div className="crumbs">
				<ul className="flex items-center p-0 m-0 list-none whitespace-nowrap overflow-hidden text-ellipsis">
					{crumbs}
				</ul>
			</div>
		</div>
	);
}
