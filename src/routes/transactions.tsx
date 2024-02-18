import TransactionList from "@/components/Transaction/TransactionList.tsx";
import {useParams} from "react-router-dom";

function Transactions() {
    const {travelId} = useParams();

    if (!travelId) {
        return <div>Loading...</div>
    } else {
        return (
            <>
                <TransactionList travelId={parseInt(travelId)}/>
            </>
        );
    }
}

export default Transactions
