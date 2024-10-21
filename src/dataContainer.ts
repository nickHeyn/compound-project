import { AccountData } from "./types/data/accountData";
import { AdvisorData } from "./types/data/advisorData";
import { SecurityData } from "./types/data/securityData";

/**
 * This class contains the data for the advisors, accounts, and securities and provides functions to access them.
 */
export class DataContainer {
    private advisorMap: Map<string, AdvisorData>;
    private accountMap: Map<string, AccountData>;
    private securityMap: Map<string, SecurityData>;

    constructor(advisorMap: Map<string, AdvisorData>, accountMap: Map<string, AccountData>, securityMap: Map<string, SecurityData>) {
        this.advisorMap = advisorMap;
        this.accountMap = accountMap;
        this.securityMap = securityMap;
    }

    public getAdvisorById(id: string) {
        return this.advisorMap.get(id);
    }

    public getAdvisorMap() {
        return this.advisorMap;
    }

    public getAccountById(id: string) {
        return this.accountMap.get(id);
    }

    public getAccountMap() {
        return this.accountMap;
    }

    public getSecurityById(id: string) {
        return this.securityMap.get(id);
    }

    public getSecurityMap() {
        return this.securityMap;
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
        this.securityMap.forEach(entry => {
            console.log(entry);
        });
    }
}