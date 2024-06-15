// React
import {useAppContext} from "@/context.ts";
// Types
import {Travel} from "@/types.ts";
// Components
import TransactionList from "@/components/Transaction/TransactionList.tsx";
import TransactionListSkeleton from "@/components/Transaction/TransactionListSkeleton.tsx";


function Transactions() {
    // Retrieve currentTravel
    const {currentTravel} = useAppContext();

    function displayTransactions(travel: Travel | undefined) {
        if (travel) {
            return <TransactionList currentTravelId={travel.rowid}/>
        } else {
            return <TransactionListSkeleton />
        }
    }

    return (
        <>
            {displayTransactions(currentTravel)}
        </>
    )
}

export default Transactions
