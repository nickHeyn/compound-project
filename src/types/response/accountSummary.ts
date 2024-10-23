export interface AccountSummary {
    readonly name: string;
    readonly number: string;
    readonly repId: string;
    readonly custodianName: string;
    readonly holdings: Array<HoldingSummary>;
}

export interface HoldingSummary {
    readonly ticker: string;
    readonly units: number;
    readonly unitPrice: number;
    readonly securityId: string;
    readonly securityName: string;
}