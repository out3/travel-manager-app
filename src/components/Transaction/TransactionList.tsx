// Tauri API
import {invoke} from "@tauri-apps/api/tauri";
// React
import {useEffect, useState} from 'react';
import {useCustomToast} from "@/lib/toastHandlers.tsx";
// Types
import {Transaction} from '@/types.ts';
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

// Props interface
type TransactionListProps = {
    currentTravelId: number
}


function TransactionList({currentTravelId}: TransactionListProps) {
    // Toast hook (corner notification)
    const {toastError} = useCustomToast();

    // List of transactions
    const [transactionsCurrentTravel, setTransactionsCurrentTravel] = useState<Transaction[]>([]);

    // Update transactions
    useEffect(() => {
        (invoke('get_transactions_for_travel', {travelId: currentTravelId}) as Promise<Transaction[]>)
            .then((transactions: Transaction[]) => {
                setTransactionsCurrentTravel(transactions);
            })
            .catch((err: string) => toastError(err))
    }, [currentTravelId])

    // Function to sum transactions amounts
    function sumAmounts() {
        return transactionsCurrentTravel.reduce((acc, transaction) => acc + transaction.amount, 0);
    }

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
                        {transactionsCurrentTravel.map((transaction: Transaction) => (
                            <TableRow>
                                <TableCell className="font-medium">{transaction.description}</TableCell>
                                <TableCell>{transaction.transaction_date.toLocaleString()}</TableCell>
                                <TableCell>{transaction.notes}</TableCell>
                                <TableCell className="text-right">
                                    {transaction.amount} {transaction.currency.symbol}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableHead className="">Total</TableHead>
                        <TableHead/>
                        <TableHead/>
                        <TableHead className="text-right">{sumAmounts()}</TableHead>
                    </TableFooter>
                </Table>
            </Card>
        </>
    )
}

export default TransactionList
