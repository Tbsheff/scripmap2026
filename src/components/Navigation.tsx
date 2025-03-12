import { useOutlet } from "react-router-dom";
import LoadingIndicator from "./LoadingIndicator";
import { useScripturesDataContext } from "../context/ScripturesDataContextHook";

export function Navigation() {
    const { books, isLoading, volumes } = useScripturesDataContext();

    const currentOutlet = useOutlet();

    return isLoading ? (
        <LoadingIndicator />
    ) : (
        <div>
            {currentOutlet}
            <p>{Object.keys(books).length}</p>
            <p>{volumes[1].fullName}</p>
        </div>
    );
}
