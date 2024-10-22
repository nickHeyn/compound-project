export interface TopAdvisorsForCustodianAnalysis {
    readonly custodianList: Array<CustodianTopAdvisors>;
}

export interface CustodianTopAdvisors {
    readonly custodianName: string;
    readonly topAdvisors: Array<AdvisorInfoAndAssetCount>;
}

export interface AdvisorInfoAndAssetCount {
    readonly name: string
    readonly id: string;
    readonly assetCount: number;
}