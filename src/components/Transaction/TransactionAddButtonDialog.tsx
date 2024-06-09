// React
import {useState} from "react";
// Types, Enums
import {TravelId, Transaction} from "@/types.ts";
import {DatabaseFormMode} from "@/enums.ts";
// Components
import TransactionAddEditForm from "@/components/Transaction/TransactionAddEditForm.tsx";
// UI
import {Button} from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    // DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
// Icons
import {PlusIcon} from "@radix-ui/react-icons";


type TransactionAddButtonDialogProps = {
    currentTravelId: TravelId;
    updateTransaction: (transaction: Transaction) => void;
}


function TransactionAddButtonDialog(props: TransactionAddButtonDialogProps) {
    // Dialog state
    const [dialogState, setDialogState] = useState(false);

    return (<>
        <Dialog open={dialogState} onOpenChange={setDialogState}>
            <DialogTrigger asChild>
                <Button variant="default" className="flex justify-between h-10">
                    New transaction
                    <PlusIcon className="h-6 w-6 ml-2"/>
                </Button>
            </DialogTrigger>
            <DialogContent className="overflow-y-auto max-h-screen">
                <DialogHeader>
                    <DialogTitle>Add a new transaction</DialogTitle>
                </DialogHeader>
                {/* Form */}
                <TransactionAddEditForm
                    closeDialog={() => setDialogState(false)}
                    formMode={DatabaseFormMode.ADD}
                    {...props}
                />
            </DialogContent>
        </Dialog>
    </>)
}

export default TransactionAddButtonDialog
