export interface TimeSerie {
    date: number; // date in milliseconds
    production: boolean; // prod or dev
    amount: number;
    value: number;
    symbol: string;
    currency: string;
}
