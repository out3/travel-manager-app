// UI
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {Card} from "@/components/ui/card.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";


function TransactionListSkeleton() {
    return (
        <>
            <Card className="p-2">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Description</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Notes</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[...Array(10)].map(() => (
                            <TableRow>
                                <TableCell className="font-medium"><Skeleton className="h-4 w-[150px]"/></TableCell>
                                <TableCell><Skeleton className="h-4 w-[100px]"/></TableCell>
                                <TableCell><Skeleton className="h-4 w-[200px]"/></TableCell>
                                <TableCell className="flex items-center justify-end">
                                    <Skeleton className="h-4 w-[100px]"/>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableHead className="">Total</TableHead>
                        <TableHead/>
                        <TableHead/>
                        <TableHead className="flex items-center justify-end"><Skeleton className="h-4 w-[100px]"/></TableHead>
                    </TableFooter>
                </Table>
            </Card>
        </>
    )
}

export default TransactionListSkeleton
