/*======================================================================
 * FILE:    VolumesList.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2026
 *
 * DESCRIPTION: Component listing all requested volumes.
 */

/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import { useParams } from "react-router-dom";
import LoadingIndicator from "./LoadingIndicator";
import { useScripturesDataContext } from "../context/ScripturesDataContextHook";
import VolumeComponent from "./VolumeComponent";
import "./VolumesList.css";

/*----------------------------------------------------------------------
 *                      COMPONENT
 */
export default function VolumesList() {
    const { isLoading, volumes } = useScripturesDataContext();
    const { volumeId } = useParams();
    const volumeIdNumber = Number(volumeId);

    if (isLoading) {
        return <LoadingIndicator />;
    }

    return (
        <div className="volumesListComponent">
            {volumes.map((volume) =>
                isNaN(volumeIdNumber) || volumeIdNumber === volume.id ? (
                    <VolumeComponent volume={volume} key={`vk${volume.id}`} />
                ) : null
            )}
        </div>
    );
}
