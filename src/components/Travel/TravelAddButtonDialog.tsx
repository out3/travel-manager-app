// React
import {useState} from "react";
// Types, Enums
import {Travel} from "@/types.ts";
import {DatabaseFormMode} from "@/enums.ts";
// Components
import TravelAddEditForm from "@/components/Travel/TravelAddEditForm.tsx";
// UI
import {Button} from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
// Icons
import {PlusIcon} from "@radix-ui/react-icons";


type TravelAddButtonDialogProps = {
    updateCurrentTravel: (travel: Travel) => void;
}


function TravelAddButtonDialog(props: TravelAddButtonDialogProps) {
    // Dialog state
    const [dialogState, setDialogState] = useState(false);

    return (<>
        <Dialog open={dialogState} onOpenChange={setDialogState}>
            <DialogTrigger asChild>
                <Button variant="default" className="h-12 w-12">
                    <PlusIcon className="h-10 w-10"/>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a new travel</DialogTitle>
                    <DialogDescription>
                        Embark on a new journey!
                    </DialogDescription>
                </DialogHeader>
                {/* Form */}
                <TravelAddEditForm
                    closeDialog={() => setDialogState(false)}
                    formMode={DatabaseFormMode.ADD}
                    {...props}
                />
            </DialogContent>
        </Dialog>
    </>)
}

export default TravelAddButtonDialog
