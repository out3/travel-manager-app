// Tauri API
import {invoke} from "@tauri-apps/api/tauri";
// React
import {useEffect, useState} from 'react';
import {useCustomToast} from "@/lib/toastHandlers.tsx";
// Types
import {Transaction} from '@/types.ts';


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

    return (
        <>
            {transactionsCurrentTravel.map((transaction: Transaction) => (
                <li key={transaction.rowid}>
                    {transaction.description}, {transaction.amount} {transaction.currency.symbol}, {transaction.transaction_date.toLocaleString()}
                </li>
            ))}
        </>
    )
}

export default TransactionList
