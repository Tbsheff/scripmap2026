/*======================================================================
 * FILE:    VolumeComponent.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2026
 *
 * DESCRIPTION: Single volume display component with grid of books.
 */

/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import { Link } from "react-router-dom";
import { CLASS_BUTTON } from "../Constants";
import LoadingIndicator from "./LoadingIndicator";
import { useScripturesDataContext } from "../context/ScripturesDataContextHook";
import { VolumeProps } from "../Types";

/*----------------------------------------------------------------------
 *                      COMPONENT
 */
export default function VolumeComponent({ volume }: VolumeProps) {
    const { isLoading } = useScripturesDataContext();

    if (isLoading || !volume) {
        return <LoadingIndicator />;
    }

    return (
        <div className="volume">
            <h5>{volume.fullName}</h5>
            <div className="books">
                {volume.books.map((book) => (
                    <Link
                        className={CLASS_BUTTON}
                        id={String(book.id)}
                        key={`bk${book.id}`}
                        to={`/${volume.id}/${book.id}`}
                    >
                        {book.gridName}
                    </Link>
                ))}
            </div>
        </div>
    );
}
