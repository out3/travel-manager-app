// Types, enums
import {Travel} from "@/types.ts";
import {TravelFormMode} from "@/enums.ts";

// React hooks
import {useState} from "react";

// Components
import {Button} from "@/components/ui/button"
import {Pencil1Icon} from "@radix-ui/react-icons";
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import TravelAddEditForm from "@/components/Travel/TravelAddEditForm.tsx";


type TravelEditButtonDialogProps = {
    currentTravel: Travel
}

function TravelAddButtonDialog({currentTravel}: TravelEditButtonDialogProps) {
    // Dialog state
    const [dialogState, setDialogState] = useState(false);

    return (<>
        <Dialog open={dialogState} onOpenChange={setDialogState}>
            <DialogTrigger asChild>
                <Button variant="secondary" className="h-12 w-12">
                    <Pencil1Icon className="h-10 w-10"/>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit travel</DialogTitle>
                    <DialogDescription>
                        {currentTravel.country.name}
                    </DialogDescription>
                </DialogHeader>
                {/* Form */}
                <TravelAddEditForm
                    closeDialog={() => setDialogState(false)}
                    formMode={TravelFormMode.EDIT}
                    currentTravel={currentTravel}
                />
            </DialogContent>
        </Dialog>
    </>)
}

export default TravelAddButtonDialog
