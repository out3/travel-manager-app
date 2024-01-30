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


function TravelManager() {
    // Toast hook (corner notification)
    const {toastError} = useCustomToast();

    // List of every travels
    const [travels, setTravels] = useState<Travel[]>([]);
    // Travel displayed
    const [currentTravel, setCurrentTravel] = useState<Travel | undefined>();

    useEffect(() => {
        // Get every travels
        updateTravels();

        // Test if currentTravel is cached
        let cachedTravel = localStorage.getItem("current-travel");
        // If yes, set currentTravel from its ID
        if (cachedTravel) {
            setCurrentTravelHandler(parseInt(cachedTravel))
        }
    }, [travels]);

    function updateTravels(): void {
        (invoke('get_travels') as Promise<Travel[]>)
            .then((data: Travel[]) => {
                setTravels(data);
            })
            .catch((err: string) => toastError(err));
    }

    function setCurrentTravelHandler(travelId: number): void {
        (invoke('get_travel', {travelId: travelId}) as Promise<Travel>)
            .then((travel) => {
                localStorage.setItem("current-travel", String(travelId))
                setCurrentTravel(travel);
            })
            .catch((err: string) => toastError(err))
    }

    function displayEditButton() {
        if (currentTravel) {
            return (
                <div className="ml-4">
                    <TravelEditButtonDialog
                        currentTravel={currentTravel}
                    />
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
                setCurrentTravelHandler={setCurrentTravelHandler}
            />
            {/* Edit travel button + form */}
            {displayEditButton()}
            {/* Add a new travel button + form */}
            <div className="ml-4">
                <TravelAddButtonDialog/>
            </div>
        </header>
        {/*  Travel data  */}
        <li>ID: {String(currentTravel?.rowid)}</li>
        <li>country: {currentTravel?.country.name}</li>
        <li>currency: {currentTravel?.currency.code}</li>
        <li>date_start: {currentTravel?.start_date?.toString()}</li>
        <li>date_end: {currentTravel?.end_date?.toString()}</li>
    </>)
}

export default TravelManager
