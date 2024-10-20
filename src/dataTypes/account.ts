export interface Account {
    readonly name: string;
    readonly number: string;
    readonly repId: string;
    readonly custodianName: string;
    readonly holdings: Array<AccountHolding>;
}

export interface AccountHolding {
    readonly ticker: string;
    readonly unitCount: number;
    readonly unitPrice: number;
} 

