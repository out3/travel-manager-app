// React
import {useState} from "react";
import {Outlet, useNavigate} from "react-router-dom";
// Types
import {Travel} from "@/types.ts";
// Components
import Navbar from "@/components/Navbar.tsx";
import TravelManager from "@/components/Travel/TravelManager.tsx";


// Context interface (to send data to <Outlet>)
export type RootContextType = {
    currentTravel: Travel | undefined,
};


function Root() {
    // React router redirection
    const navigate = useNavigate();

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
        // Redirect to the dashboard
        navigate("/dashboard", {replace: true});
    }

    return (
        <>
            <div className="flex flex-col justify-center h-screen">
                {/* Travel Manager : List/edit/add*/}
                <header className="m-5 flex">
                    <TravelManager currentTravel={currentTravel} updateCurrentTravel={updateCurrentTravel}/>
                </header>
                {/* Router : Content */}
                <main className="flex-grow mx-5">
                    <Outlet context={{currentTravel}}/>
                </main>
                {/* Navigation bar */}
                <nav className="m-5 flex justify-center">
                    <Navbar/>
                </nav>
            </div>
        </>
    )
}

export default Root
