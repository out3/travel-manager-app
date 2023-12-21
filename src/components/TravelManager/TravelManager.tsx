import './TravelManager.css'

// When using the Tauri API npm package:
import { invoke } from '@tauri-apps/api/tauri'
import {useEffect, useState} from 'react';

interface Travel {
    id: bigint,
    country: string,
}

function TravelManager() {
    const [travels, setTravels] = useState<Travel[]>([]);

    useEffect(() => {
        fetchTravels()
    }, []);

    function fetchTravels() {
        (invoke('get_travels') as Promise<Travel[]>)
             .then((data: Travel[]) => setTravels(data))
             .catch((msg: string) => console.error(msg));
    }

    return (
        <>
            <h1>Travel List</h1>
            <ul>
                {travels.map((travel: Travel) => (
                    <li key={travel.id}>{travel.country}</li>
                ))}
            </ul>
        </>
    )
}

export default TravelManager
