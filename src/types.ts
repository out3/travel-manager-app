export type Country = {
    code: string;
    name: string;
}

export type Currency = {
    code: string;
    symbol: string;
}

export type TravelId = number;

export type Travel = {
    rowid: TravelId;
    created_at: Date;
    country: Country;
    currency: Currency;
    start_date: Date | undefined;
    end_date: Date | undefined;
}

export type TransactionId = number;

export type Transaction = {
    rowid: TransactionId;
    travel_id: TravelId;
    description: string;
    amount: number;
    currency: Currency;
    transaction_date: Date;
    notes: string;
}
