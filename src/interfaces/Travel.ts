import {Country} from './Country.ts';
import {Currency} from "./Currency.ts";

export interface Travel {
    rowid: number,
    country: Country,
    currency: Currency,
    start_date: Date | undefined,
    end_date: Date | undefined
}
