// Types
import {Travel} from '@/types.ts';

// Props interface
type TravelInfoProps = {
    currentTravel: Travel
}

function TravelInfo({currentTravel}: TravelInfoProps) {
    return(
        <>
            <li>ID: {String(currentTravel?.rowid)}</li>
            <li>country: {currentTravel?.country.name}</li>
            <li>currency: {currentTravel?.currency.code}</li>
            <li>date_start: {currentTravel?.start_date?.toString()}</li>
            <li>date_end: {currentTravel?.end_date?.toString()}</li>
        </>
    )
}

export default TravelInfo