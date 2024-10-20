import { Account } from "./dataTypes/account";
import { Advisor } from "./dataTypes/advisor";
import { Security } from "./dataTypes/security";

/**
 * This class contains the data for the advisors, accounts, and securities and provides functions to access them.
 */
export class DataContainer {
    private advisorMap: Map<string, Advisor>;
    private accountMap: Map<string, Account>;
    private securityMap: Map<string, Security>;

    constructor(advisorMap: Map<string, Advisor>, accountMap: Map<string, Account>, securityMap: Map<string, Security>) {
        this.advisorMap = advisorMap;
        this.accountMap = accountMap;
        this.securityMap = securityMap;
    }

    /**
     * Prints the contained data to the console.
     */
    printData() {
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