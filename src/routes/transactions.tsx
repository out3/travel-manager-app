// React
import {useOutletContext} from "react-router-dom";
// Types
import {Travel} from "@/types.ts";
// Routes
import {RootContextType} from "@/routes/root.tsx";
// Components
import TransactionList from "@/components/Transaction/TransactionList.tsx";
import TransactionListSkeleton from "@/components/Transaction/TransactionListSkeleton.tsx";


function Transactions() {
    // Retrieve currentTravel and its update function
    const {currentTravel} = useOutletContext<RootContextType>();

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
