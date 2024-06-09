// React
import {useState} from "react";
// Types, Enums
import {Transaction, TravelId} from "@/types.ts";
import {DatabaseFormMode} from "@/enums.ts";
// Components
import TransactionAddEditForm from "@/components/Transaction/TransactionAddEditForm.tsx";
// UI
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
// Icons
import {Pencil1Icon} from "@radix-ui/react-icons";


// Props interface
type TransactionEditButtonDialogProps = {
    currentTravelId: TravelId
    transaction: Transaction
    updateTransaction: (transaction: Transaction) => void
}


function TransactionEditButtonDialog(props: TransactionEditButtonDialogProps) {
    // Dialog state
    const [dialogState, setDialogState] = useState(false);

    return (<>
        <Dialog open={dialogState} onOpenChange={setDialogState}>
            <DialogTrigger asChild className="h-6 w-6 p-1">
                <Pencil1Icon className="
                    cursor-pointer
                    text-neutral-400 hover:text-primary
                    "
                />
            </DialogTrigger>
            <DialogContent className="overflow-y-auto max-h-screen">
                <DialogHeader>
                    <DialogTitle>Edit transaction</DialogTitle>
                    <DialogDescription>
                        {props.transaction.description}
                    </DialogDescription>
                </DialogHeader>
                <TransactionAddEditForm
                    closeDialog={() => setDialogState(false)}
                    formMode={DatabaseFormMode.EDIT}
                    {...props}
                />
            </DialogContent>
        </Dialog>
    </>)
}

export default TransactionEditButtonDialog
