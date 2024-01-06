import './TravelManager.css'

// When using the Tauri API npm package:
import {invoke} from '@tauri-apps/api/tauri'
import {useEffect, useState} from 'react';

interface Travel {
    rowid: bigint,
    country: Country,
    currency: string
}

interface Country {
    code: string,
    name: string,
}

function TravelManager() {
    // List of every travels
    const [travels, setTravels] = useState<Travel[]>([]);
    // List of countries available for dropdown
    const [countries, setCountries] = useState<Country[]>([]);
    // Variables used to create a new travel
    const [newCountry, setNewCountry] = useState<string>("");
    const [newCurrency, setNewCurrency] = useState<string>("");

    useEffect(() => {
        fetchTravels();
        fetchCountries();
    }, []);

    function fetchTravels(): void {
        (invoke('get_travels') as Promise<Travel[]>)
            .then((data: Travel[]) => {setTravels(data)})
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
                        <input
                            type="text"
                            placeholder="Enter currency"
                            defaultValue={newCurrency}
                            onChange={(e) => setNewCurrency(e.target.value)}
                        />
                    </label>
                    <button type="submit">
                        Create Travel
                    </button>
                </form>
            </div>
            <ul>
                {travels.map((travel: Travel) => (
                    <li key={travel.rowid}>{travel.country.name} ({travel.currency})</li>
                ))}
            </ul>
        </>
    )
}

export default TravelManager
