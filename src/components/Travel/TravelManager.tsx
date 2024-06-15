// Tauri API
import {invoke} from "@tauri-apps/api/tauri";
// React
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useCustomToast} from "@/lib/toastHandlers.tsx";
import {useAppContext} from "@/context.ts";
// Types
import {Travel} from "@/types.ts";
// Components
import TravelAddButtonDialog from "@/components/Travel/TravelAddButtonDialog.tsx";
import TravelEditButtonDialog from "@/components/Travel/TravelEditButtonDialog.tsx";
import TravelList from "@/components/Travel/TravelList.tsx";


function TravelManager() {
    // React router redirection
    const navigate = useNavigate();

    // Toast hook (corner notification)
    const {toastError} = useCustomToast();
    
    // Retrieve CurrentTravel
    const {currentTravel, updateCurrentTravel} = useAppContext();
    
    // List of every travels
    const [travels, setTravels] = useState<Travel[]>([]);

    // At component mount => Fetch travels and define currentTravel
    useEffect(() => {
        // Update the list of travels and the current travel
        (invoke('get_travels') as Promise<Travel[]>)
            .then((allTravels: Travel[]) => {
                // Fix date format
                allTravels.forEach((travel: Travel) => {
                    travel.created_at = new Date(travel.created_at);
                    travel.start_date? travel.start_date = new Date(travel.start_date) : null;
                    travel.end_date? travel.end_date = new Date(travel.end_date) : null;
                });

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

                // Redirect to the dashboard on app launch
                navigate("/dashboard", {replace: true});

            })
            .catch((err: string) => toastError(err));
    }, [currentTravel, toastError, updateCurrentTravel]);

    function displayEditButton() {
        if (currentTravel) {
            return (
                <div className="ml-4">
                    <TravelEditButtonDialog/>
                </div>
            )
        }
    }

    return (
        <>
            {/* Travel list dropdown */}
            <TravelList
                travelsList={travels}
            />
            {/* Edit travel button + form */}
            {displayEditButton()}
            {/* Add a new travel button + form */}
            <div className="ml-4">
                <TravelAddButtonDialog/>
            </div>
        </>
    )
}

export default TravelManager
