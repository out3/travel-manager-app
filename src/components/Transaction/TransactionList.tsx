// Tauri API
import {invoke} from "@tauri-apps/api/tauri";
// React
import {useEffect, useState} from 'react';
import {useCustomToast} from "@/lib/toastHandlers.tsx";
// Types
import {Currency, Transaction} from '@/types.ts';
// Components
import TransactionAddButtonDialog from "@/components/Transaction/TransactionAddButtonDialog.tsx";
import TransactionEditButtonDialog from "@/components/Transaction/TransactionEditButtonDialog.tsx";
// UI
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Card} from "@/components/ui/card.tsx";
import {displayTransactionValue} from "@/lib/utils.ts";

// Props interface
type TransactionListProps = {
    currentTravelId: number
}


function TransactionList({currentTravelId}: TransactionListProps) {
    // Toast hook (corner notification)
    const {toastError} = useCustomToast();

    // List of transactions
    const [transactionsCurrentTravel, setTransactionsCurrentTravel] = useState<Transaction[]>([]);

    // Get all transactions for the current travel
    useEffect(() => {
        (invoke('get_transactions_for_travel', {travelId: currentTravelId}) as Promise<Transaction[]>)
            .then((transactions: Transaction[]) => {
                // Fix date format
                transactions.forEach((transaction: Transaction) => {
                    transaction.transaction_date = new Date(transaction.transaction_date);
                });
                setTransactionsCurrentTravel(transactions);
            })
            .catch((err: string) => toastError(err))
    }, [currentTravelId])

    function createTransaction(transaction: Transaction) {
        setTransactionsCurrentTravel(prevState  => {
            return [...prevState, transaction];
        })
    }
    function updateTransaction(transaction: Transaction) {
        setTransactionsCurrentTravel(prevState => {
            const index = prevState.findIndex((t: Transaction) => t.rowid === transaction.rowid);
            prevState[index] = transaction;
            return [...prevState];
            }
        )
    }

    // Function to sum transactions amounts
    function sumAmounts(): Record<string, number> {
        // Sum all amounts and group by currency
        return transactionsCurrentTravel.reduce((acc: Record<string, number>, transaction: Transaction) => {
            const currency = JSON.stringify(transaction.currency);
            if (acc[currency]) {
                acc[currency] += transaction.amount;
            } else {
                acc[currency] = transaction.amount;
            }
            return acc;
        }, {});
    }

    function displaySumAmounts() {
        return (
            <>
                <ul>
                    {Object.entries(sumAmounts()).map(([currency, amount]: [string, number]) => (
                        <li key={currency}>
                            {displayTransactionValue(amount, (JSON.parse(currency) as Currency))}
                        </li>
                    ))}
                </ul>
            </>
        )
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
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* List of transactions */}
                        {transactionsCurrentTravel.map((transaction: Transaction) => (
                            <TableRow>
                                <TableCell className="font-medium">{transaction.description}</TableCell>
                                <TableCell>{transaction.transaction_date.toLocaleDateString()}</TableCell>
                                <TableCell>{transaction.notes}</TableCell>
                                <TableCell className="text-right">
                                    {displayTransactionValue(transaction.amount, transaction.currency)}
                                </TableCell>
                                <TableCell className="w-1">
                                    <TransactionEditButtonDialog
                                        currentTravelId={currentTravelId}
                                        transaction={transaction}
                                        updateTransaction={updateTransaction}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableHead className="">Total</TableHead>
                        <TableHead/>
                        <TableHead/>
                        <TableHead className="text-right">{displaySumAmounts()}</TableHead>
                        <TableHead></TableHead>
                    </TableFooter>
                </Table>
                {/* Transaction add button */}
                <div className="flex justify-end m-2 mt-4">
                    <TransactionAddButtonDialog
                        currentTravelId={currentTravelId}
                        updateTransaction={createTransaction}
                    />
                </div>
            </Card>
        </>
    )
}

export default TransactionList
