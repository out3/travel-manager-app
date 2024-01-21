// When using the Tauri API npm package:
import {invoke} from '@tauri-apps/api/tauri'

// Interfaces
import {Country} from '../../interfaces/Country.ts';
import {Currency} from '../../interfaces/Currency.ts';
import {Travel} from '../../interfaces/Travel.ts';

// React hooks
import {useEffect, useState} from "react";

function TravelAddEditForm() {
    // List of countries available for dropdown
    const [countries, setCountries] = useState<Country[]>([]);
    // List of currencies available for dropdown
    const [currencies, setCurrencies] = useState<Currency[]>([]);

    // Variables used to create a new travel
    const [country, setCountry] = useState<string>();
    const [currency, setCurrency] = useState<string>();
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

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
                setCountry(data[0].code)
            })
            .catch((err: string) => console.error(err));
    }

    // Function to get a list of currencies from rust backend
    function fetchCurrencies(): void {
        (invoke('get_currencies') as Promise<Currency[]>)
            .then((data: Currency[]) => {
                setCurrencies(data);
                setCurrency(data[0].code)
            })
            .catch((err: string) => console.error(err));
    }

    // Function to create a new travel
    function createTravel(): void {
        console.log(country, currency, startDate?.toLocaleDateString() || "", endDate?.toLocaleDateString() || "");
        (invoke('create_travel', {
            country: country,
            currency: currency,
            startDate: startDate?.toLocaleDateString() || "",
            endDate: endDate?.toLocaleDateString() || ""
        }) as Promise<Travel>)
            .then((data: Travel) => console.log(data))
            .catch((err: string) => console.error(err))
    }

    return (
        <>
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    {/* Close button */}
                    <form method="dialog" id="closeModal" className="card-actions justify-end">
                        <button className="btn btn-square btn-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </form>
                    {/* Form */}
                    <form id="addEditForm" onSubmit={createTravel}>
                        {/* Country dropdown */}
                        <select
                            className="select select-bordered w-full max-w-xs"
                            onChange={e => setCountry(e.target.value)}
                        >
                            {countries.map((country) => (
                                <option key={country.code} value={country.code}>
                                    {country.name}
                                </option>
                            ))}
                        </select>

                        {/* Currency dropdown */}
                        <select
                            className="select select-bordered w-full max-w-xs"
                            onChange={e => setCurrency(e.target.value)}
                        >
                            {currencies.map((currency) => (
                                <option key={currency.code} value={currency.code}>
                                    {currency.code} ({currency.symbol})
                                </option>))}
                        </select>

                        {/* Date start picker */}
                        <input
                            type="date"
                            className="input input-bordered w-full max-w-xs"
                            onChange={e => setStartDate(new Date(e.target.value))}
                        />

                        {/* Date end picker */}
                        <input
                            type="date"
                            className="input input-bordered w-full max-w-xs"
                            onChange={e => setEndDate(new Date(e.target.value))}
                        />

                        {/* Submit button */}
                        <button className="btn btn-primary w-full mt-2">
                            Create travel
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default TravelAddEditForm