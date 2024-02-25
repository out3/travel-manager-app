export type Country = {
    code: string;
    name: string;
}

export type Currency = {
    code: string;
    symbol: string;
}

export type Travel = {
    rowid: number;
    created_at: Date;
    country: Country;
    currency: Currency;
    start_date: Date | undefined;
    end_date: Date | undefined;
}

export type Transaction = {
    rowid: number;
    travel_id: number;
    description: string;
    amount: number;
    currency: Currency;
    transaction_date: Date;
     notes: string;
}
