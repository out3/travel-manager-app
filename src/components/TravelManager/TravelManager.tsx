import './TravelManager.css'

// When using the Tauri API npm package:
import {invoke} from '@tauri-apps/api/tauri'

// Interfaces
import {Travel} from '../../interfaces/Travel.ts';

// React hooks
import {useEffect, useState} from 'react';

function TravelManager() {
    // List of every travels
    const [travels, setTravels] = useState<Travel[]>([]);
    // Travel displayed
    const [currentTravel, setCurrentTravel] = useState<Travel>();

    useEffect(() => {
        // Fetch every travel from database
        fetchTravels();
        // Test if travel is cached
        let cachedTravel = localStorage.getItem("current-travel");
        // If yes, set currentTravel from its ID
        if (cachedTravel) {
            setCurrentTravelHandler(parseInt(cachedTravel))
        }
    }, []);

    function fetchTravels(): void {
        (invoke('get_travels') as Promise<Travel[]>)
            .then((data: Travel[]) => {
                setTravels(data);
                setCurrentTravel(travels[0])
            })
            .catch((err: string) => console.error(err));
    }

    function setCurrentTravelHandler(travelId: number): void {
        (invoke('get_travel', {travelId: travelId}) as Promise<Travel>)
            .then((travel) => {
                localStorage.setItem("current-travel", String(travelId))
                setCurrentTravel(travel);
            })
            .catch((err: string) => console.error(err))
    }


    return (
        <>
            {/* Travel list*/}
            <header className="m-5 flex">
                {/* Travel list button */}
                <div className="dropdown mb-1 flex-1">
                    <div tabIndex={0} role="button" className="
                        btn btn-lg shadow
                        w-auto flex justify-between
                        ">
                        <div className="flex flex-col items-start">
                            <p className="text-2xl">{currentTravel ? currentTravel.country.name : 0}</p>
                            <p className="text-sm text-primary">{currentTravel &&
                                (currentTravel.country.name + " - " +
                                    currentTravel.currency.code + " (" + currentTravel.currency.symbol + ")")
                            }</p>
                        </div>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"/>
                            </svg>
                        </div>
                    </div>
                    {/* Dropdown containing the list of travels */}
                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-96 mt-1 ">
                        {travels.map((travel: Travel) => (
                            <li key={travel.rowid} className="flex flex-column hover:bg-primary hover:rounded-lg"
                                onClick={(e): void => {
                                    // Change current travel
                                    setCurrentTravelHandler(travel.rowid);
                                    // Hide the list of travels after click
                                    let parent = e.currentTarget.parentNode as HTMLUListElement;
                                    parent.blur();
                                }}
                            ><a>
                                {String(travel.rowid)} {travel.country.name} | {travel.currency.code} ({travel.currency.symbol})
                                <br/>
                                {travel.start_date} - {travel.end_date}
                            </a></li>
                        ))}
                    </ul>
                </div>
                {/* Add a new travel button */}
                <button className="
                    btn btn-lg ml-2
                    bg-primary
                    ">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd"
                              d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                              clipRule="evenodd"/>
                    </svg>
                </button>
            </header>
        {/*  Travel data  */}
            <li>ID: {String(currentTravel?.rowid)}</li>
            <li>country: {currentTravel?.country.name}</li>
            <li>currency: {currentTravel?.currency.code}</li>
            <li>date_start: {currentTravel?.start_date}</li>
            <li>date_end: {currentTravel?.end_date}</li>
        </>
    )
}

export default TravelManager
