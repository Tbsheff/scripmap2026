import { useOutlet } from "react-router-dom";
import LoadingIndicator from "./LoadingIndicator";
import { useScripturesDataContext } from "../context/ScripturesDataContextHook";

export function Navigation() {
    const { books, isLoading, volumes } = useScripturesDataContext();
    console.log(books, isLoading, volumes);

    const currentOutlet = useOutlet();

    return isLoading ? <LoadingIndicator /> : <>{currentOutlet}</>;
}
