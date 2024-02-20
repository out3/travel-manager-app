// Enums
import {TravelFormMode} from "@/enums.ts";
import {Travel} from "@/types.ts";

// React hooks
import {useState} from "react";

// Components
import {Button} from "@/components/ui/button"
import {PlusIcon} from "@radix-ui/react-icons";
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import TravelAddEditForm from "@/components/Travel/TravelAddEditForm.tsx";

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
                    formMode={TravelFormMode.ADD}
                    {...props}
                />
            </DialogContent>
        </Dialog>
    </>)
}

export default TravelAddButtonDialog
