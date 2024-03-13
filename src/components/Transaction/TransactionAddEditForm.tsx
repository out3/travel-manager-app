// Tauri API
import {invoke} from '@tauri-apps/api/tauri'
// React
import {useEffect, useState} from "react";
import {useCustomToast} from "@/lib/toastHandlers.tsx"
// Types, Enums
import {Currency, Transaction, TravelId} from '@/types.ts';
import {DatabaseFormMode} from '@/enums.ts'
// Form validation
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {z} from 'zod';
import {format} from "date-fns";
// UI
import {Button} from "@/components/ui/button.tsx"
import {Calendar} from "@/components/ui/calendar.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx"
import {Input} from "@/components/ui/input.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
// Icons
import {CalendarIcon} from '@radix-ui/react-icons';


// Form schema to specify validation rules
const formSchema = z.object({
    description: z.string(),
    amount: z.coerce.number().safe().finite(),
    currency: z.string().length(3, {message: 'Currency not selected'}),
    transactionDate: z.coerce.date(),
    notes: z.string().optional(),
})


// Props interface
type TransactionFormProps = {
    currentTravelId: TravelId;
    transaction?: Transaction;
    updateTransaction: (transaction: Transaction) => void;
    closeDialog: () => void;
    formMode: DatabaseFormMode;
}

function TransactionAddEditForm({
    currentTravelId,
    updateTransaction,
    closeDialog,
    formMode,
    transaction
}: TransactionFormProps) {
    // Toast hook (corner notification)
    const {toastError, toastMessage} = useCustomToast();

    // List of currencies available for dropdown
    const [currencies, setCurrencies] = useState<Currency[]>([]);

    // Zod
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    // Boolean to trigger fetchCurrencies on load
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    useEffect(() => {
        // Get currencies on load
        if (!isLoaded) {
            fetchCurrencies();
            setIsLoaded(true);
        }
        // If formMode set to EDIT, set transaction values to form
        if (formMode === DatabaseFormMode.EDIT && transaction) {
            form.setValue("description", transaction.description);
            form.setValue("amount", transaction.amount);
            form.setValue("currency", transaction.currency.code);
            form.setValue("transactionDate", transaction.transaction_date);
            if (transaction.notes) {
                form.setValue("notes", transaction.notes);
            }
        }
    }, [currencies]);


    // Function to get a list of currencies from rust backend
    function fetchCurrencies(): void {
        (invoke('get_currencies') as Promise<Currency[]>)
            .then((data: Currency[]) => {
                setCurrencies(data);
            })
            .catch((err: string) => toastError(err));
    }

    // Function to edit amount's values based on currency
    function updateAmountValue(): void {
        const formCurrency = form.getValues("currency");
        let amount = form.getValues("amount");
        // getValues can return a string, format it to a number
        if (typeof (amount) !== 'number') {
            amount = parseFloat(amount);
        }

        // Update amount's decimals based on currency
        if (formCurrency && !isNaN(amount)) {
            const currency = currencies.find((currency) => currency.code === formCurrency)!;
            form.setValue("amount", parseFloat(amount.toFixed(currency.exponent)));
        }
    }

    function createTransaction(form_transaction: z.infer<typeof formSchema>): void {
        (invoke('create_transaction', {
            travelId: currentTravelId,
            description: form_transaction.description,
            amount: form_transaction.amount,
            currency: form_transaction.currency?.toString(),
            transactionDate: form_transaction.transactionDate.toLocaleDateString(),
            notes: form_transaction.notes ? form_transaction.notes : "",
        }) as Promise<Transaction>)
            .then((data: Transaction) => {
                // Execute callback to re-render transactions
                updateTransaction(data);
                // Display a success notification
                const msg = (
                    <>
                        {data.description + "\n"}
                        {data.amount + " " +data.currency.symbol}
                        {"\n" + data.transaction_date.toLocaleString()}
                        {data.notes ? ("\n" + data.notes) : null}
                    </>
                )
                toastMessage(msg, "The following transaction has been created:");
                // Close modal
                closeDialog();
            })
            .catch((err: string) => toastError(err, "Error while creating transaction:"))
    }

    function editTransaction(form_transaction: z.infer<typeof formSchema>): void {
        (invoke('update_transaction', {
            transactionId: transaction?.rowid,
            travelId: transaction?.travel_id,
            description: form_transaction.description,
            amount: form_transaction.amount,
            currency: form_transaction.currency?.toString(),
            transactionDate: form_transaction.transactionDate.toLocaleDateString(),
            notes: form_transaction.notes ? form_transaction.notes : "",
        }) as Promise<Transaction>)
            .then((data: Transaction) => {
                // Execute callback to re-render transactions
                updateTransaction(data);
                // Display a success notification
                const msg = (
                    <>
                        {data.description + "\n"}
                        {data.amount + " " + data.currency.symbol}
                        {"\n" + data.transaction_date.toLocaleString()}
                        {data.notes ? ("\n" + data.notes) : null}
                    </>
                )
                toastMessage(msg, "The following transaction has been edited:");
                closeDialog();
            })
            .catch((err: string) => toastError(err, "Error while updating transaction:"))
    }

    function onSubmit(transaction: z.infer<typeof formSchema>): void {
        // If formMode set to ADD => Create a new transaction
        if (formMode === DatabaseFormMode.ADD) {
            createTransaction(transaction);
        }
        // If formMode set to EDIT => Edit the current transaction
        else if (formMode === DatabaseFormMode.EDIT) {
            editTransaction(transaction);
        }
    }

    return (
        <>
            <div className="w-full max-w-xl mx-auto">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6">
                        {/* Description */}
                        <div className="space-y-2 col-span-full md:col-span-1">
                            <FormField
                                control={form.control}
                                name="description"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Description" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                        {/* Transaction date */}
                        <div className="grid gap-2 col-span-full md:col-span-1">
                            <FormField
                                control={form.control}
                                name={"transactionDate"}
                                render={({field}) => (<FormItem>
                                    <FormLabel>Date of transaction</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={"w-full justify-start text-left font-normal"}
                                                >
                                                    {
                                                        field.value
                                                            ? (format(field.value, "PPP"))
                                                            : (<span>Pick a date</span>)
                                                    }
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage/>
                                </FormItem>)}
                            />
                        </div>
                        {/* Amount */}
                        <div className="space-y-2 col-span-full md:col-span-1">
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Amount</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Amount"
                                                type="number"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    updateAmountValue();
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                        </div>
                        {/* Currency */}
                        <div className="space-y-2 col-span-full md:col-span-1">
                            <FormField
                                control={form.control}
                                name="currency"
                                render={({field}) => (<FormItem>
                                    <FormLabel>Currency</FormLabel>
                                    <Select
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            updateAmountValue();
                                        }}
                                        {...field}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a location"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {currencies.map((currency) => (
                                                <SelectItem key={currency.code} value={currency.code}>
                                                    <span className="font-semibold">{currency.code}</span>
                                                    <span
                                                        className="text-gray-500 text-sm"> ({currency.symbol})</span>
                                                </SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>)}
                            />
                        </div>
                        {/* Notes */}
                        <div className="col-span-full">
                            <FormField
                                control={form.control}
                                name="notes"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Additional notes</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Notes..." {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                        {/* Submit button */}
                        <Button type="submit" className="w-full col-span-full">
                            Submit
                        </Button>
                    </form>
                </Form>
            </div>
        </>
    )
}

export default TransactionAddEditForm
