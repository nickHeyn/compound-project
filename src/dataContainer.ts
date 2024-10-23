import { AccountData } from "./types/data/accountData";
import { AdvisorData } from "./types/data/advisorData";
import { SecurityData } from "./types/data/securityData";
import { AccountSummary } from "./types/response/accountSummary";
import { AdvisorSummary } from "./types/response/advisorSummary";
import { SecuritySummary } from "./types/response/securitySummary";

/**
 * This class contains the data for the advisors, accounts, and securities and provides functions to access them.
 */
export class DataContainer {
    private advisorMap: Map<string, AdvisorData>;
    private accountMap: Map<string, AccountData>;
    private securityTickerMap: Map<string, SecurityData>;
    private securityIdMap: Map<string, SecurityData>;


    constructor(advisorMap: Map<string, AdvisorData>, accountMap: Map<string, AccountData>, securityTickerMap: Map<string, SecurityData>, securityIdMap: Map<string, SecurityData>) {
        this.advisorMap = advisorMap;
        this.accountMap = accountMap;
        this.securityTickerMap = securityTickerMap;
        this.securityIdMap = securityIdMap;
    }

    public getAdvisorById(id: string) {
        return this.advisorMap.get(id);
    }

    public getAdvisorMap() {
        return this.advisorMap;
    }

    public getAllAdvisors() {
        return this.advisorMap.values();
    }

    public getAccountById(id: string) {
        return this.accountMap.get(id);
    }

    public getAccountMap() {
        return this.accountMap;
    }

    public getAllAccounts() {
        return this.accountMap.values();
    }

    public getSecurityByTicker(ticker: string) {
        return this.securityTickerMap.get(ticker);
    }

    public getSecurityById(id: string) {
        return this.securityIdMap.get(id);
    }

    public getSecurityMap() {
        return this.securityTickerMap;
    }

    public getAllSecurities() {
        return this.securityTickerMap.values();
    }

    /**
     * Fetches a summary of the advisor and the accounts they manage
     * @param advisorId - Id of the advisor to get summary data for
     * @returns A summary of the advisor and the accounts they manage
     */
    public getAdvisorSummary(advisorId: string): AdvisorSummary | undefined {
        const advisorData = this.getAdvisorById(advisorId);

        if(advisorData) {
            const accountList = [];
            for(const custodian of advisorData.custodians) {
                const accountSummary = this.getAccountSummary(custodian.repId);
                if(accountSummary) {
                    accountList.push(accountSummary);
                }
            }

            return {
                id: advisorData.id,
                name: advisorData.name,
                accounts: accountList
            }
        }
        
    }

    /**
     * Fetches a summary of the specified account, including its holdings
     * @param repId - Id of the account to get summary data for
     * @returns A summary of the account and its holdings
     */
    public getAccountSummary(repId: string): AccountSummary | undefined {
        const accountData = this.getAccountById(repId);

        if(accountData) {
            const holdingsList = [];
            for(const holdingData of accountData.holdings) {
                const security = this.getSecurityByTicker(holdingData.ticker);
                if(security) {
                    holdingsList.push({
                        ticker: security.ticker,
                        securityId: security.id,
                        securityName: security.name,
                        units: holdingData.unitCount,
                        unitPrice: holdingData.unitPrice
                    });
                }
            }
            return {
                name: accountData.name,
                repId: accountData.repId,
                custodianName: accountData.custodianName,
                number: accountData.number,
                holdings: holdingsList
            }
        }
    }

    /**
     * Fetches a summary of the specified security
     * @param securityId - Id of the security to fetch
     * @returns A summary of the security
     */
    public getSecuritySummary(securityId: string): SecuritySummary | undefined {
        const security = this.getSecurityById(securityId);

        if(security) {
            return {
                id: security.id,
                name: security.name,
                ticker: security.ticker,
                dateAdded: security.dateAdded
            }
        }
    }

    /**
     * Prints the contained data to the console.
     */
    public printData() {
        // print advisor data
        console.log("Advisor Data: ");
        this.advisorMap.forEach(entry => {
            console.log(entry);
        });

        // print account data
        console.log("Account Data: ");
        this.accountMap.forEach(entry => {
            console.log(entry);
        });

        // print security data
        console.log("Security Data: ");
        this.securityTickerMap.forEach(entry => {
            console.log(entry);
        });
    }
}