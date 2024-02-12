// When using the Tauri API npm package:
import {invoke} from '@tauri-apps/api/tauri'

// Types
import {Travel} from '@/types.ts';

// React hooks
import {useEffect, useState} from 'react';
import {useCustomToast} from "@/lib/toastHandlers.tsx";

// Components
import TravelList from "./TravelList.tsx";
import TravelAddButtonDialog from "@/components/Travel/TravelAddButtonDialog.tsx";
import TravelEditButtonDialog from "@/components/Travel/TravelEditButtonDialog.tsx";
import TravelInfo from "./TravelInfo.tsx";
import {Skeleton} from "@/components/ui/skeleton"


function TravelManager() {
    // Toast hook (corner notification)
    const {toastError} = useCustomToast();

    // List of every travels
    const [travels, setTravels] = useState<Travel[]>([]);
    // Travel displayed
    const [currentTravel, setCurrentTravel] = useState<Travel | undefined>();

    // At component mount => Fetch travels and currentTravel
    useEffect(() => {
        // Update the list of travels and the current travel
        // Api call to retrieve travels
        (invoke('get_travels') as Promise<Travel[]>)
            .then((data: Travel[]) => {
                // Set the list of travels
                setTravels(data);

                // If it's empty, delete the cached travel id and unset the currentTravel, return
                if (data.length === 0) {
                    localStorage.removeItem("current-travel");
                    setCurrentTravel(undefined);
                    return;
                }

                // If currentTravel is already set, return
                if (currentTravel) {
                    return;
                }

                // Get the cached travel id
                const cachedTravelId = localStorage.getItem("current-travel");
                const parsedCachedTravelId = cachedTravelId ? parseInt(cachedTravelId) : null;

                // If cached travel is not set
                // Or, it is set, but the actual cached id is not on the list of travels
                if (!cachedTravelId ||
                    (cachedTravelId && !(data.find((travel: Travel): boolean => travel.rowid === parsedCachedTravelId)))
                ) {
                    // Set the first travel as the current travel
                    localStorage.setItem("current-travel", String(data[0].rowid));
                }

                // Set current Travel
                updateCurrentTravel(parseInt(localStorage.getItem("current-travel")!));
            })
            .catch((err: string) => toastError(err));
    }, [currentTravel]);

    function updateCurrentTravel(travelId: number): void {
        (invoke('get_travel', {travelId: travelId}) as Promise<Travel>)
            .then((travel) => {
                // Fix date format
                travel.created_at = new Date(travel.created_at);
                travel.start_date = travel.start_date ? new Date(travel.start_date) : undefined;
                travel.end_date = travel.end_date ? new Date(travel.end_date) : undefined;
                localStorage.setItem("current-travel", String(travel.rowid))
                setCurrentTravel(travel);
            })
            .catch((err: string) => toastError(err))
    }

    function displayEditButton() {
        if (currentTravel) {
            return (
                <>
                    <div className="ml-4">
                        <TravelEditButtonDialog
                            updateCurrentTravel={updateCurrentTravel}
                            currentTravel={currentTravel}
                        />
                    </div>
                </>
            )
        }
    }

    function displayTravelInfo() {
        if (currentTravel) {
            return (
                <TravelInfo currentTravel={currentTravel}/>
            )
        } else {
            return (
                <div className="flex justify-between">
                    <Skeleton className="h-56 w-56 rounded-3xl"/>
                    <Skeleton className="h-56 w-56 rounded-3xl"/>
                    <Skeleton className="h-56 w-56 rounded-3xl"/>
                </div>
            )
        }
    }

    return (<>
        {/* Travel list*/}
        <header className="m-5 flex">
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
        </header>
        {/*  Travel data  */}
        <main className="m-5">
            {displayTravelInfo()}
        </main>
    </>)
}

export default TravelManager
