import { Link } from "react-router-dom";
import { useScripturesDataContext } from "../context/ScripturesDataContextHook";
import { VolumeProps } from "../Types";
import LoadingIndicator from "./LoadingIndicator";
import { CLASS_BUTTON } from "../Constants";

export default function VolumeComponent({ volume }: VolumeProps) {
    const { volumes, isLoading } = useScripturesDataContext();

    if (isLoading || !volumes || !volume) {
        return <LoadingIndicator />;
    }

    return (
        <div>
            <h5>{volume?.fullName}</h5>
            <div className="books">
                {volume?.books.map((book) => (
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
