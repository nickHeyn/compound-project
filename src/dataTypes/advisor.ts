export interface Advisor {
    readonly id: string;
    readonly name: string;
    readonly custodians: Array<AdvisorCustodian>;
}

interface AdvisorCustodian {
    readonly name: string;
    readonly repId: string;
}