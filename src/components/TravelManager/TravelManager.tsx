import './TravelManager.css'

// When using the Tauri API npm package:
import { invoke } from '@tauri-apps/api/tauri'
import {useEffect, useState} from 'react';

interface Travel {
    rowid: bigint,
    country: string,
}

function TravelManager() {
    const [travels, setTravels] = useState<Travel[]>([]);
    const [country, setCountry] = useState<string>("");

    useEffect(() => {
        fetchTravels()
    }, []);

    function fetchTravels(): void {
        (invoke('get_travels') as Promise<Travel[]>)
             .then((data: Travel[]) => setTravels(data))
             .catch((err: string) => console.error(err));
    }

    function createTravel(): void {
        (invoke('create_travel', {country: country}) as Promise<Travel>)
            .then(() => fetchTravels())
            .catch((err: string) => console.error(err))
    }


    return (
        <>
            <h1>Travel List</h1>
            <div>
                <input
                    type="text"
                    placeholder="Enter country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                />
                <input
                    type="button"
                    value="Create Travel"
                    onClick={createTravel}
                />
            </div>
            <ul>
                {travels.map((travel: Travel) => (
                    <li key={travel.rowid}>{travel.country}</li>
                ))}
            </ul>
        </>
    )
}

export default TravelManager
