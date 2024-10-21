export interface AdvisorData {
    readonly id: string;
    readonly name: string;
    readonly custodians: Array<AdvisorCustodianData>;
}

interface AdvisorCustodianData {
    readonly name: string;
    readonly repId: string;
}