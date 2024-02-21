// UI
import {useToast} from "@/components/ui/use-toast.ts"


export function useCustomToast() {
    const {toast} = useToast();

    function toastError(err: any, title: string = "An error occurred:"): void {
        toast({
            variant: "destructive",
            title: title,
            description: (<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                            <code className="text-gray-300">{err}</code>
                        </pre>),
        })
    }

    function toastMessage(msg: any, title: string): void {
        toast({
            title: title,
            description: (<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                            <code className="text-gray-300">{msg}</code>
                        </pre>),
        });
    }

    return {toastError, toastMessage};
}
