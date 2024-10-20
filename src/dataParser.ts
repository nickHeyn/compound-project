import inputData from "../input/inputData.json";
import { DataContainer } from "./dataContainer";
import { Account } from "./dataTypes/account";
import { Advisor } from "./dataTypes/advisor";
import { Security } from "./dataTypes/security";

export const parseInputData = (data: typeof inputData = inputData): DataContainer => {
    // parse Advisors
    const advisorMap = new Map();
    for(const advisorData of data.advisors) {
        const advisor: Advisor = {
            name: advisorData.name,
            id: advisorData.id,
            custodians: advisorData.custodians.map((custodianData => {
                return {
                    name: custodianData.name,
                    repId: custodianData.repId
                }
            }))
        }
        advisorMap.set(advisor.id, advisor)
    }

    // parse accounts
    const accountMap = new Map();
    for(const accountData of data.accounts) {
        const account: Account = {
            name: accountData.name,
            number: accountData.number,
            repId: accountData.repId,
            custodianName: accountData.custodian,
            holdings: accountData.holdings.map((holdingData => {
                return {
                    ticker: holdingData.ticker,
                    unitCount: holdingData.units,
                    unitPrice: holdingData.unit_price
                }
            }))
        }
        accountMap.set(account.repId, account)
    }

    // parse securities
    const securityMap = new Map();
    for(const securityData of data.securities) {
        const security: Security = {
            name: securityData.name,
            id: securityData.id,
            ticker: securityData.ticker,
            dateAdded: securityData.dateAdded
        }
        securityMap.set(security.id, security)
    }

    return new DataContainer(advisorMap, accountMap, securityMap);
}