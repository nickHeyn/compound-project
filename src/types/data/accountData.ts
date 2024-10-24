export interface AccountData {
    readonly name: string;
    readonly number: string;
    readonly repId: string;
    readonly custodianName: string;
    readonly holdings: Array<AccountHoldingData>;
}

export interface AccountHoldingData {
    // TODO: Include the security ID in the AccountHoldingData and use that as the security key
    readonly ticker: string;
    readonly unitCount: number;
    readonly unitPrice: number;
} 

