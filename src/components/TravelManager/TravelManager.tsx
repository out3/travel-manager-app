import './TravelManager.css'

// When using the Tauri API npm package:
import {invoke} from '@tauri-apps/api/tauri'

// Interfaces
import {Travel} from '../../interfaces/Travel.ts';

// React hooks
import {useEffect, useRef, useState} from 'react';

// Components
import TravelList from "../TravelList/TravelList.tsx";
import TravelAddEditForm from "../TravelAddEditForm/TravelAddEditForm.tsx";

function TravelManager() {
    // Travel displayed
    const [currentTravel, setCurrentTravel] = useState<Travel | undefined>();
    // Modal ref
    const modalRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        // Test if travel is cached
        let cachedTravel = localStorage.getItem("current-travel");
        // If yes, set currentTravel from its ID
        if (cachedTravel) {
            setCurrentTravelHandler(parseInt(cachedTravel))
        }
    }, []);

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
                {/* Travel list bar */}
                <TravelList
                    currentTravel={currentTravel}
                    setCurrentTravelHandler={setCurrentTravelHandler}
                />
                {/* Add a new travel button */}
                <button className="
                    btn btn-lg ml-2
                    bg-primary
                    "
                        onClick={() => modalRef.current?.showModal()}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd"
                              d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                              clipRule="evenodd"/>
                    </svg>
                </button>
                {/* TravelAddEditForm modal */}
                <dialog ref={modalRef} className="modal">
                    <TravelAddEditForm/>
                </dialog>
            </header>
            {/*  Travel data  */}
            <li>ID: {String(currentTravel?.rowid)}</li>
            <li>country: {currentTravel?.country.name}</li>
            <li>currency: {currentTravel?.currency.code}</li>
            <li>date_start: {currentTravel?.start_date?.toString()}</li>
            <li>date_end: {currentTravel?.end_date?.toString()}</li>
        </>
    )
}

export default TravelManager
