import TransactionList from "@/components/Transaction/TransactionList.tsx";
import {useOutletContext} from "react-router-dom";
import {RootContextType} from "@/routes/root.tsx";
import {Travel} from "@/types.ts";

function Transactions() {
    // Retrieve currentTravel and its update function
    const {currentTravel} = useOutletContext<RootContextType>();

    function displayTransactions(travel: Travel | undefined) {
        if (travel) {
            return <TransactionList currentTravelId={travel.rowid}/>
        } else {
            return <div>Loading...</div>
        }
    }

    return (
        <>
            {displayTransactions(currentTravel)}
        </>
    )
}

export default Transactions
