// Types
import {Travel} from '@/types.ts';
// UI
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Progress} from "@/components/ui/progress";
import {Separator} from "@/components/ui/separator.tsx";
// Icons
import {PaperPlaneIcon} from "@radix-ui/react-icons";


// Props interface
type TravelInfoProps = {
    currentTravel: Travel
}


function TravelInfo({currentTravel}: TravelInfoProps) {
    function displayProgressBar(): JSX.Element {
        // Today's date
        const todayDate = new Date();

        // Percentage of the travel
        let percentage = 100;

        switch (true) {
            // If the current travel has no dates
            case (!currentTravel.start_date):
                return <Progress key="travelProgress" value={percentage}/>;
            // If the current travel has a start date but has not started
            case (currentTravel.start_date && todayDate < currentTravel.start_date):
                percentage = Math.round((todayDate.getTime() - currentTravel.created_at.getTime()) / (currentTravel.start_date.getTime() - currentTravel.created_at.getTime()) * 100);
                return <Progress key="travelProgress" value={percentage} indicatorClassName="bg-blue-400"/>;
            // If the current travel is in progress but has no end date
            case (currentTravel.start_date && todayDate > currentTravel.start_date && !currentTravel.end_date):
                return <Progress key="travelProgress" value={percentage} indicatorClassName="bg-green-400"/>;
            // If the current travel is in progress and has an end date
            case (currentTravel.start_date && todayDate > currentTravel.start_date && currentTravel.end_date && todayDate < currentTravel.end_date):
                percentage = Math.round((todayDate.getTime() - currentTravel.start_date.getTime()) / (currentTravel.end_date.getTime() - currentTravel.start_date.getTime()) * 100);
                return <Progress key="travelProgress" value={percentage} indicatorClassName="bg-green-400"/>;
            // If the current travel has ended
            default:
                return <Progress key="travelProgress" value={percentage} indicatorClassName="bg-red-400"/>;
        }
    }

    function displayDates(): JSX.Element {
        const output = [];
        // Add the start date if it exists
        if (currentTravel.start_date) {
            output.push(
                <div key="travelStartDate" className="flex justify-start mb-2">
                    <PaperPlaneIcon className="-rotate-45 h-4 w-4 self-center mr-2"/>
                    {currentTravel.start_date ? currentTravel.start_date.toLocaleDateString() : ""}
                </div>)
        }
        // Add the progress bar anyway
        output.push(displayProgressBar())
        // Add the end date if it exists
        if (currentTravel.end_date) {
            output.push(
                <div key="travelEndDate" className="flex justify-end mt-2">
                    {currentTravel.end_date ? currentTravel.end_date.toLocaleDateString() : ""}
                    <PaperPlaneIcon className="rotate-45 h-4 w-4 self-end ml-2"/>
                </div>
            )
        }
        return <>{output}</>;
    }

    return (
        <>
            <Card className="w-[300px]">
                <CardHeader>
                    <CardTitle>{currentTravel.country.name}</CardTitle>
                    <CardDescription>{currentTravel.currency.code} ({currentTravel.currency.symbol})</CardDescription>
                    <Separator/>
                </CardHeader>
                <CardContent>
                    {displayDates()}
                </CardContent>
            </Card>
        </>
    )
}

export default TravelInfo
