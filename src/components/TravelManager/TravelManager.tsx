import './TravelManager.css'

// When using the Tauri API npm package:
import {invoke} from '@tauri-apps/api/tauri'
import {useEffect, useState} from 'react';

interface Travel {
    rowid: bigint,
    country: IsoCountry,
}

interface IsoCountry {
    country: string
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
    // Country used to create a new travel
    const [travelToAdd, setTravelToAdd] = useState<String>("")

    useEffect(() => {
        fetchTravels();
        fetchCountries();
    }, []);

    function fetchTravels(): void {
        (invoke('get_travels') as Promise<Travel[]>)
            .then((data: Travel[]) => {
                setTravels(data);
                console.log(data);
            })
            .catch((err: string) => console.error(err));
    }

    function createTravel(): void {
        (invoke('create_travel', {country: travelToAdd}) as Promise<Travel>)
            .then(() => fetchTravels())
            .catch((err: string) => console.error(err))
    }

    function fetchCountries(): void {
        (invoke('get_countries') as Promise<Country[]>)
            .then((data: Country[]) => {
                setCountries(data);
                setTravelToAdd(data[0].code);
            })
            .catch((err: string) => console.error(err));
    }

    return (
        <>
            <h1>Travel List</h1>
            <div>
                <select
                    onChange={event => setTravelToAdd(event.target.value)}
                >
                    {countries.map((country) => (
                        <option key={country.code} value={country.code}>{country.name}</option>
                    ))}
                </select>
                <input
                    type="button"
                    value="Create Travel"
                    onClick={createTravel}
                />
            </div>
            <ul>
                {travels.map((travel: Travel) => (
                    <li key={travel.rowid}>{travel.country.country}</li>
                ))}
            </ul>
        </>
    )
}

export default TravelManager
