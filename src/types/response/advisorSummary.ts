import { AccountSummary } from "./accountSummary";

export interface AdvisorSummary {
    readonly id: string;
    readonly name: string;
    readonly accounts: Array<AccountSummary>;
}