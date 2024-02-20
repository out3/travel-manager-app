// Components
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Progress} from "@/components/ui/progress";
import {Separator} from "@/components/ui/separator.tsx";

// Icons
import {PaperPlaneIcon} from "@radix-ui/react-icons";
import {Skeleton} from "@/components/ui/skeleton.tsx";


function TravelInfo() {
    function displayProgressBar(): JSX.Element {
        return <Progress value={100} indicatorClassName="bg-secondary"/>;
    }

    function displayDates(): JSX.Element {
        const output = [];
        // Add the start date if it exists
        output.push(
            <div className="flex justify-start mb-2">
                <PaperPlaneIcon className="-rotate-45 h-4 w-4 self-center mr-2"/>
                <Skeleton className="h-4 w-[250px]"/>
            </div>
        )
        // Add the progress bar anyway
        output.push(displayProgressBar())
        // Add the end date if it exists
        output.push(
            <div className="flex justify-end mt-2">
                <Skeleton className="h-4 w-[250px]"/>
                <PaperPlaneIcon className="rotate-45 h-4 w-4 self-end ml-2"/>
            </div>
        )
        return <>{output}</>;
    }

    return (
        <>
            <Card className="w-[300px]">
                <CardHeader>
                    <CardTitle>
                        <Skeleton className="h-4 w-[250px]"/>
                    </CardTitle>
                    <CardDescription>
                        <Skeleton className="h-4 w-[250px]"/>
                        (<Skeleton className="h-4 w-[250px]"/>)
                    </CardDescription>
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