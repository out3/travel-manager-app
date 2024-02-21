// React
import {useOutletContext} from "react-router-dom";
// Types
import {Travel} from "@/types.ts";
// Routes
import {RootContextType} from "@/routes/root.tsx";
// Components
import TravelInfo from "@/components/Travel/TravelInfo.tsx";
import TravelInfoSkeleton from "@/components/Travel/TravelInfoSkeleton.tsx";


function Dashboard() {
    // Retrieve currentTravel and its update function
    const {currentTravel} = useOutletContext<RootContextType>();

    function displayTravelInfo(travel: Travel | undefined) {
        if (travel) {
            return <TravelInfo currentTravel={travel}/>;
        } else {
            return <TravelInfoSkeleton/>
        }
    }

    return (
        <>
            {displayTravelInfo(currentTravel)}
        </>
    );
}

export default Dashboard
