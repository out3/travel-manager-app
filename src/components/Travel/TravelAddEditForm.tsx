// When using the Tauri API npm package:
import {invoke} from '@tauri-apps/api/tauri'

// Types, Enums
import {Country, Currency, Travel} from '@/types.ts';
import {TravelFormMode} from '@/enums.ts'

// Hooks
import {useEffect, useState} from "react";

// Form validation
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {z} from 'zod';
import {format} from "date-fns";

// Component
import {useToast} from "@/components/ui/use-toast.ts"
import {Button} from "@/components/ui/button.tsx"
import {Calendar} from "@/components/ui/calendar.tsx";
import {CalendarIcon} from '@radix-ui/react-icons';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";


// Form schema to specify validation rules
const formSchema = z.object({
    // Selects must be set
    country: z.string().length(3, {message: 'Country not selected'}),
    currency: z.string().length(3, {message: 'Currency not selected'}), // Dates must be in the right format, can also be optional
    startDate: z.date().optional(),
    endDate: z.date().optional(),
})

type TravelFormProps = {
    closeDialog: () => void
    formMode: TravelFormMode
    currentTravel?: Travel
}

function TravelAddEditForm({closeDialog, formMode, currentTravel}: TravelFormProps) {
    // Toast hook (corner notification)
    const {toast} = useToast();

    // List of countries available for dropdown
    const [countries, setCountries] = useState<Country[]>([]);
    // List of currencies available for dropdown
    const [currencies, setCurrencies] = useState<Currency[]>([]);

    // Zod
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    // Boolean to trigger fetchCountries and fetchCurrencies on load
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    useEffect(() => {
        // Get every country and currency on load
        if (!isLoaded) {
            fetchCountries();
            fetchCurrencies();
            setIsLoaded(true);
        }
        // If formMode set to EDIT, set form values to current travel
        if (formMode === TravelFormMode.EDIT && currentTravel) {
            form.setValue("country", String(currentTravel.country.code));
            form.setValue("currency", currentTravel.currency.code);
            if (currentTravel?.start_date) {
                form.setValue("startDate", new Date(currentTravel.start_date));
            }
            if (currentTravel?.end_date) {
                form.setValue("endDate", new Date(currentTravel.end_date));
            }
        }
    }, [currentTravel]);

    // Function to get a list of countries from rust backend
    function fetchCountries(): void {
        (invoke('get_countries') as Promise<Country[]>)
            .then((data: Country[]) => {
                setCountries(data);
            })
            .catch((err: string) => console.error(err));
    }

    // Function to get a list of currencies from rust backend
    function fetchCurrencies(): void {
        (invoke('get_currencies') as Promise<Currency[]>)
            .then((data: Currency[]) => {
                setCurrencies(data);
            })
            .catch((err: string) => console.error(err));
    }


    function createTravel(travel: z.infer<typeof formSchema>): void {
        (invoke('create_travel', {
            country: travel.country?.toString(),
            currency: travel.currency?.toString(),
            startDate: travel.startDate ? travel.startDate.toLocaleDateString() : "",
            endDate: travel.endDate ? travel.endDate.toLocaleDateString() : ""
        }) as Promise<Travel>)
            .then((data: Travel) => {
                toastSuccess(data);
                closeDialog();
            })
            .catch((err: string) => toastError(err))
    }

    function editTravel(): void {
        console.log(form.getValues("country"))
        console.log(form.getValues("currency"))
        console.log(form.getValues("startDate"))
        console.log(form.getValues("endDate"))
    }

    function toastSuccess(travel: Travel): void {
        toast({
            title: "The following travel has been created:",
            description: (<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                            <code className="text-gray-300">
                                {travel.country.name} - {travel.currency.code} ({travel.currency.symbol})
                                {travel.start_date ? ("\n" + travel.start_date.toLocaleString()) : null}
                                {travel.end_date ? (" to " + travel.end_date.toLocaleString()) : null}
                            </code>
                        </pre>),
        });
    }

    function toastError(err: string): void {
        toast({
            variant: "destructive",
            title: "Error while creating travel:",
            description: (<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                            <code className="text-gray-300">{err}</code>
                        </pre>),
        })
    }

    function onSubmit(travel: z.infer<typeof formSchema>): void {
        // If formMode set to ADD => Create a new travel
        if (formMode === TravelFormMode.ADD) {
            createTravel(travel);
        }
        // If formMode set to EDIT => Edit the current travel
        else if (formMode === TravelFormMode.EDIT) {
            editTravel();
        }
    }

    return (<>
        <div className="w-full max-w-xl mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6">
                    {/* Country */}
                    <div className="space-y-2 col-span-full md:col-span-1">
                        <FormField
                            control={form.control}
                            name="country"
                            render={({field}: any) => (<FormItem>
                                <FormLabel>Country</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a location"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {countries.map((country) => (<SelectItem
                                            key={country.code}
                                            value={country.code}
                                        >
                                            <span className="font-semibold">{country.name}</span>
                                            <span className="text-gray-500 text-sm"> ({country.code})</span>
                                        </SelectItem>))}
                                    </SelectContent>
                                </Select>
                                <FormMessage/>
                            </FormItem>)}
                        />
                    </div>
                    {/* Currency */}
                    <div className="space-y-2 col-span-full md:col-span-1">
                        <FormField
                            control={form.control}
                            name="currency"
                            render={({field}: any) => (<FormItem>
                                <FormLabel>Local currency</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
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
                    {/* Start date */}
                    <div className="grid gap-2 col-span-full md:col-span-1">
                        <FormField
                            control={form.control}
                            name={"startDate"}
                            render={({field}: any) => (<FormItem>
                                <FormLabel>Start of trip</FormLabel>
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
                    {/* End date */}
                    <div className="grid gap-2 col-span-full md:col-span-1">
                        <FormField
                            control={form.control}
                            name="endDate"
                            render={({field}: any) => (<FormItem>
                                <FormLabel>End of trip</FormLabel>
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
                                            disabled={(date: Date): boolean => {
                                                let startDate: Date | undefined = form.getValues("startDate");
                                                if (startDate) {
                                                    return date < startDate
                                                } else {
                                                    return true
                                                }
                                            }}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage/>
                            </FormItem>)}
                        />
                    </div>
                    {/* Submit button */}
                    <Button type="submit" className="w-full col-span-full">
                        Submit
                    </Button>
                </form>
            </Form>
        </div>
    </>)
}

export default TravelAddEditForm
