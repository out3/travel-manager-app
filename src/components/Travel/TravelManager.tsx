// Tauri API
import {invoke} from "@tauri-apps/api/tauri";
// React
import {useEffect, useState} from "react";
import {useCustomToast} from "@/lib/toastHandlers.tsx";
// Types
import {Travel} from "@/types.ts";
// Components
import TravelAddButtonDialog from "@/components/Travel/TravelAddButtonDialog.tsx";
import TravelEditButtonDialog from "@/components/Travel/TravelEditButtonDialog.tsx";
import TravelList from "@/components/Travel/TravelList.tsx";


// Props interface
type TravelManagerProps = {
    currentTravel: Travel | undefined,
    updateCurrentTravel: (travel?: Travel) => void
}


function TravelManager({currentTravel, updateCurrentTravel}: TravelManagerProps) {
    // Toast hook (corner notification)
    const {toastError} = useCustomToast();

    // List of every travels
    const [travels, setTravels] = useState<Travel[]>([]);

    // At component mount => Fetch travels and define currentTravel
    useEffect(() => {
        // Update the list of travels and the current travel
        (invoke('get_travels') as Promise<Travel[]>)
            .then((allTravels: Travel[]) => {
                // Set the list of travels
                setTravels(allTravels);

                // If it's empty, unset the currentTravel, return
                if (allTravels.length === 0) {
                    updateCurrentTravel();
                    return;
                }

                // If currentTravel is already set, return
                if (currentTravel) {
                    return;
                }

                // Get the cached travel id
                const cachedTravelId = localStorage.getItem("current-travel");
                const parsedCachedTravelId = cachedTravelId ? parseInt(cachedTravelId) : null;
                const cachedTravel = allTravels.find((travel: Travel): boolean => travel.rowid === parsedCachedTravelId)

                // If cached travel is not found
                if (!cachedTravel) {
                    // Set the first travel as the current travel
                    updateCurrentTravel(allTravels[0]);
                } else {
                    // Else, set the cached travel as the current travel
                    updateCurrentTravel(cachedTravel);
                }
            })
            .catch((err: string) => toastError(err));
    }, [currentTravel]);

    function displayEditButton() {
        if (currentTravel) {
            return (
                <div className="ml-4">
                    <TravelEditButtonDialog
                        currentTravel={currentTravel}
                        updateCurrentTravel={updateCurrentTravel}
                    />
                </div>
            )
        }
    }

    return (
        <>
            {/* Travel list dropdown */}
            <TravelList
                travelsList={travels}
                currentTravel={currentTravel}
                updateCurrentTravel={updateCurrentTravel}
            />
            {/* Edit travel button + form */}
            {displayEditButton()}
            {/* Add a new travel button + form */}
            <div className="ml-4">
                <TravelAddButtonDialog
                    updateCurrentTravel={updateCurrentTravel}
                />
            </div>
        </>
    )
}

export default TravelManager
