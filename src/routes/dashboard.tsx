import TravelInfo from "@/components/Travel/TravelInfo.tsx";
import {Travel} from "@/types.ts";

// Props interface
type DashboardProps = {
    currentTravel?: Travel
}

function Dashboard({currentTravel}: DashboardProps) {
    if (!currentTravel) {
        return <div>Loading...</div>
    } else {
        return (
            <>
                <TravelInfo currentTravel={currentTravel}/>
            </>
        );
    }
}

export default Dashboard
