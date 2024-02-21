// UI
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Progress} from "@/components/ui/progress";
import {Separator} from "@/components/ui/separator.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
// Icons
import {PaperPlaneIcon} from "@radix-ui/react-icons";


function TravelInfoSkeleton() {
    return (
        <>
            <Card className="w-[300px]">
                <CardHeader>
                    <CardTitle>
                        <Skeleton className="h-4 w-[200px]"/>
                    </CardTitle>
                    <CardDescription>
                        <Skeleton className="h-4 w-[150px]"/>
                    </CardDescription>
                    <Separator/>
                </CardHeader>
                <CardContent>
                    {/* Start date */}
                    <div className="flex justify-start mb-2">
                        <PaperPlaneIcon className="-rotate-45 h-4 w-4 self-center mr-2"/>
                        <Skeleton className="h-4 w-[150px]"/>
                    </div>
                    {/* Progress bar */}
                    <Progress value={100} indicatorClassName="bg-secondary"/>
                    {/* End date */}
                    <div className="flex justify-end mt-2">
                        <Skeleton className="h-4 w-[150px]"/>
                        <PaperPlaneIcon className="rotate-45 h-4 w-4 self-end ml-2"/>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default TravelInfoSkeleton
