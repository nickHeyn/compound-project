import inputData from "../input/inputData.json";
import { DataContainer } from "./dataContainer";
import { AccountData } from "./types/data/accountData";
import { AdvisorData } from "./types/data/advisorData";
import { SecurityData } from "./types/data/securityData";

/**
 * Parses the provided JSON data to and stores it in a data container. The provided JSON data must match the format specified in the README, otherwise 
 * an error will be returned.
 * @param rawData - The raw JSON data that is being parsed. This data must be formatted as specified in the README.
 * @returns a DataContainer object that will store the parsed data.
 */
export const parseInputData = (rawData: any = inputData): DataContainer => {
    // parse advisors
    const advisorMap = new Map();
    for(const advisorData of rawData.advisors) {
        const advisor: AdvisorData = {
            name: advisorData.name,
            id: advisorData.id,
            custodians: advisorData.custodians.map((custodianData: any) => {
                return {
                    name: custodianData.name,
                    repId: custodianData.repId
                }
            })
        }
        advisorMap.set(advisor.id, advisor)
    }

    // parse accounts
    const accountMap = new Map();
    for(const accountData of rawData.accounts) {
        const account: AccountData = {
            name: accountData.name,
            number: accountData.number,
            repId: accountData.repId,
            custodianName: accountData.custodian,
            holdings: accountData.holdings.map((holdingData: any) => {
                return {
                    ticker: holdingData.ticker,
                    unitCount: holdingData.units,
                    unitPrice: holdingData.unit_price
                }
            })
        }
        accountMap.set(account.repId, account)
    }

    // parse securities
    const securityTickerMap = new Map();
    const securityIdMap = new Map();
    for(const securityData of rawData.securities) {
        const security: SecurityData = {
            name: securityData.name,
            id: securityData.id,
            ticker: securityData.ticker,
            dateAdded: securityData.dateAdded
        }
        securityTickerMap.set(security.ticker, security)
        securityIdMap.set(security.id, security);
    }

    return new DataContainer(advisorMap, accountMap, securityTickerMap, securityIdMap);
}