export interface AccountData {
    readonly name: string;
    readonly number: string;
    readonly repId: string;
    readonly custodianName: string;
    readonly holdings: Array<AccountHoldingData>;
}

export interface AccountHoldingData {
    readonly ticker: string;
    readonly unitCount: number;
    readonly unitPrice: number;
} 

