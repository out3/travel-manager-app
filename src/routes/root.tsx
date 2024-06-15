// React
import {useState} from "react";
import {Outlet} from "react-router-dom";
// Types
import {Travel} from "@/types.ts";
// Components
import Navbar from "@/components/Navbar.tsx";
import TravelManager from "@/components/Travel/TravelManager.tsx";
import {AppContext} from "@/context.ts";


function Root() {
    // Current travel ID
    const [currentTravel, setCurrentTravel] = useState<Travel | undefined>();

    // Function to update current travel and local storage
    function updateCurrentTravel(travel?: Travel) {
        if (!travel) {
            // Clear current-travel
            localStorage.removeItem("current-travel");
            // Set the current travel as undefined
            setCurrentTravel(undefined);
        } else {
            // Fix date format
            travel.created_at = new Date(travel.created_at);
            travel.start_date = travel.start_date ? new Date(travel.start_date) : undefined;
            travel.end_date = travel.end_date ? new Date(travel.end_date) : undefined;

            // Store current travel's id in local storage
            localStorage.setItem("current-travel", String(travel.rowid))
            // Fetch the travel from its ID
            setCurrentTravel(travel);
        }
    }

    return (
        <>
            <AppContext.Provider value={{currentTravel, updateCurrentTravel}}>
                <div className="flex flex-col justify-center h-screen">
                    {/* Travel Manager : List/edit/add */}
                    <header className="m-5 flex">
                        <TravelManager />
                    </header>
                    {/* Router : Content */}
                    <main className="flex-grow mx-5">
                        <Outlet/>
                    </main>
                    {/* Navigation bar */}
                    <nav className="m-5 flex justify-center">
                        <Navbar/>
                    </nav>
                </div>
            </AppContext.Provider>
        </>
    )
}

export default Root
