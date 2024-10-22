export interface TopSecuritiesAnalysis {
    readonly topSecurities: Array<SecurityInfo>;
}

export interface SecurityInfo {
    readonly securityName: string;
    readonly id: string;
    readonly ticker: string;
    readonly numUnitsHeld: number;
}