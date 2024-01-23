// When using the Tauri API npm package:
import {invoke} from '@tauri-apps/api/tauri'

// Interfaces
import {Country} from '@/interfaces/Country.ts';
import {Currency} from '@/interfaces/Currency.ts';
import {Travel} from '@/interfaces/Travel.ts';

// Hooks
import {useEffect, useState} from "react";

// Form validation
// @ts-ignore
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {z} from 'zod';

// Component
import {useToast} from "@/components/ui/use-toast"
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {format} from "date-fns";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {CalendarIcon} from '@radix-ui/react-icons';
import {Calendar} from "@/components/ui/calendar.tsx";


// Form schema to specify validation rules
const formSchema = z.object({
    // Selects must be set
    country: z.string().min(1, {message: 'Country not selected'}),
    currency: z.string().min(1, {message: 'Currency not selected'}),
    // Dates must be in the right format, can also be optional
    startDate: z.date().optional(),
    endDate: z.date().optional(),
})


function TravelAddEditForm() {
    // Toast hook (corner notification)
    const {toast} = useToast();

    // List of countries available for dropdown
    const [countries, setCountries] = useState<Country[]>([]);
    // List of currencies available for dropdown
    const [currencies, setCurrencies] = useState<Currency[]>([]);

    useEffect(() => {
        // Get every country and currency on load
        fetchCountries();
        fetchCurrencies();
    }, []);

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

    // Zod
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    });

    function onSubmit(values: z.infer<typeof formSchema>): void {
        (invoke('create_travel', {
            country: values.country?.toString(),
            currency: values.currency?.toString(),
            startDate: values.startDate ? values.startDate.toLocaleDateString() : "",
            endDate: values.endDate ? values.endDate.toLocaleDateString() : ""
        }) as Promise<Travel>)
            .then((data: Travel) => {
                console.log(data);
                toast({
                    title: "The following travel has been created:",
                    description: (
                        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                            <code className="text-gray-300">
                                {data.country.name} - {data.currency.code} ({data.currency.symbol})
                                {data.start_date ? ("\n" + data.start_date.toLocaleString()) : null}
                                {data.end_date ? (" to " + data.end_date.toLocaleString()) : null}
                            </code>
                        </pre>
                    ),
                })
            })
            .catch((err: string) => {
                toast({
                    variant: "destructive",
                    title: "Error while creating travel:",
                    description: (
                        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                            <code className="text-gray-300">{err}</code>
                        </pre>
                    ),
                })
            })
    }

    return (
        <>
            <div className="w-full max-w-xl mx-auto">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6">
                        {/* Country */}
                        <div className="space-y-2 col-span-full md:col-span-1">
                            <FormField
                                control={form.control}
                                name="country"
                                render={({field}: any) => (
                                    <FormItem>
                                        <FormLabel>Country</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a location"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {countries.map((country) => (
                                                    <SelectItem value={country.code} className="truncate">
                                                        <span className="font-semibold">{country.name}</span>
                                                        <span className="text-gray-500 text-sm"> ({country.code})</span>
                                                    </SelectItem>))}
                                            </SelectContent>
                                        </Select>
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
                                render={({field}: any) => (
                                    <FormItem>
                                        <FormLabel>Local currency</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a location"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {currencies.map((currency) => (
                                                    <SelectItem value={currency.code}>
                                                        <span className="font-semibold">{currency.code}</span>
                                                        <span className="text-gray-500 text-sm"> ({currency.symbol})</span>
                                                    </SelectItem>))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                        {/* Start date */}
                        <div className="grid gap-2 col-span-full md:col-span-1">

                            <FormField
                                control={form.control}
                                name={"startDate"}
                                render={({field}: any) => (
                                    <FormItem>
                                        <FormLabel>Start of trip</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={"w-full justify-start text-left font-normal"}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
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
                                    </FormItem>
                                )}
                            />
                        </div>
                        {/* End date */}
                        <div className="grid gap-2 col-span-full md:col-span-1">

                            <FormField
                                control={form.control}
                                name="endDate"
                                render={({field}: any) => (
                                    <FormItem>
                                        <FormLabel>End of trip</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={"w-full justify-start text-left font-normal"}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
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


export default TravelAddEditForm