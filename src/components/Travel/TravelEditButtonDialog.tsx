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
import {Pencil1Icon} from "@radix-ui/react-icons";


// Props interface
type TravelEditButtonDialogProps = {
    currentTravel: Travel,
    updateCurrentTravel: (travel: Travel) => void
}


function TravelAddButtonDialog(props: TravelEditButtonDialogProps) {
    // Dialog state
    const [dialogState, setDialogState] = useState(false);

    return (<>
        <Dialog open={dialogState} onOpenChange={setDialogState}>
            <DialogTrigger asChild>
                <Button variant="secondary" className="h-12 w-12">
                    <Pencil1Icon className="h-10 w-10"/>
                </Button>
            </DialogTrigger>
            <DialogContent className="overflow-y-auto max-h-screen">
                <DialogHeader>
                    <DialogTitle>Edit travel</DialogTitle>
                    <DialogDescription>
                        {props.currentTravel.country.name}
                    </DialogDescription>
                </DialogHeader>
                {/* Form */}
                <TravelAddEditForm
                    closeDialog={() => setDialogState(false)}
                    formMode={DatabaseFormMode.EDIT}
                    {...props}
                />
            </DialogContent>
        </Dialog>
    </>)
}

export default TravelAddButtonDialog
