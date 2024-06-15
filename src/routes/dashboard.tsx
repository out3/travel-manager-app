// React
import {useAppContext} from "@/context.ts";
// Types
import {Travel} from "@/types.ts";
// Components
import TravelInfo from "@/components/Travel/TravelInfo.tsx";
import TravelInfoSkeleton from "@/components/Travel/TravelInfoSkeleton.tsx";


function Dashboard() {
    // Retrieve currentTravel and its update function
    const {currentTravel} = useAppContext();

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
