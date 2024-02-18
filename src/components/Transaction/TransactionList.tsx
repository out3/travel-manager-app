// Tauri API
import {invoke} from "@tauri-apps/api/tauri";

// Types
import {Transaction} from '@/types.ts';

// React hooks
import {useEffect, useState} from 'react';
import {useCustomToast} from "@/lib/toastHandlers.tsx";

// Props interface
type TransactionListProps = {
    travelId: number
}

function TransactionList({travelId}: TransactionListProps) {
    // Toast hook (corner notification)
    const {toastError} = useCustomToast();

    // List of transactions
    const [transactionsCurrentTravel, setTransactionsCurrentTravel] = useState<Transaction[]>([]);

    // Update transactions
    useEffect(() => {
        (invoke('get_transactions_for_travel', {travelId: travelId}) as Promise<Transaction[]>)
            .then((transactions: Transaction[]) => {
                console.log(transactions)
                setTransactionsCurrentTravel(transactions);
            })
            .catch((err: string) => toastError(err))
    })

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