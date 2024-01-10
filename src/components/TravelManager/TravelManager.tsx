import './TravelManager.css'

// When using the Tauri API npm package:
import {invoke} from '@tauri-apps/api/tauri'
import {useEffect, useState} from 'react';

interface Travel {
    rowid: bigint,
    country: Country,
    currency: Currency
}

interface Country {
    code: string,
    name: string,
}

interface Currency {
    code: string,
    symbol : string
}

function TravelManager() {
    // List of every travels
    const [travels, setTravels] = useState<Travel[]>([]);
    // List of countries available for dropdown
    const [countries, setCountries] = useState<Country[]>([]);
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    // Variables used to create a new travel
    const [newCountry, setNewCountry] = useState<string>("");
    const [newCurrency, setNewCurrency] = useState<string>("");

    useEffect(() => {
        fetchTravels();
        fetchCountries();
        fetchCurrencies();
    }, []);

    function fetchTravels(): void {
        (invoke('get_travels') as Promise<Travel[]>)
            .then((data: Travel[]) => {setTravels(data)})
            .catch((err: string) => console.error(err));
    }

    function fetchCurrencies(): void {
        (invoke('get_currencies') as Promise<Currency[]>)
            .then((data: Currency[]) => {setCurrencies(data)})
            .catch((err: string) => console.error(err));
    }

    function createTravel(): void {
        (invoke('create_travel', {
            country: newCountry,
            currency: newCurrency
        }) as Promise<Travel>)
            .then(() => fetchTravels())
            .catch((err: string) => console.error(err))
    }

    function fetchCountries(): void {
        (invoke('get_countries') as Promise<Country[]>)
            .then((data: Country[]) => {
                setCountries(data);
                setNewCountry(data[0].code);
            })
            .catch((err: string) => console.error(err));
    }

    return (
        <>
            <h1>Travel List</h1>
            <div>
                <form onSubmit={createTravel}>
                    <label>
                        Country :
                        <select
                            onChange={e => setNewCountry(e.target.value)}
                        >
                            {countries.map((country) => (
                                <option key={country.code} value={country.code}>{country.name}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Currency :
                        <select
                            onChange={e => setNewCurrency(e.target.value)}
                        >
                            {currencies.map((currency) => (
                                <option key={currency.code} value={currency.code}>{currency.code} ({currency.symbol})</option>
                            ))}
                        </select>
                    </label>
                    <button type="submit">
                        Create Travel
                    </button>
                </form>
            </div>
            <ul>
                {travels.map((travel: Travel) => (
                    <li key={travel.rowid}>{travel.country.name} | {travel.currency.code} ({travel.currency.symbol})</li>
                ))}
            </ul>
        </>
    )
}

export default TravelManager
