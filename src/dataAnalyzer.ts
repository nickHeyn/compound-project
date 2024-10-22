import { DataContainer } from "./dataContainer";
import { AdvisorData } from "./types/data/advisorData";
import { AdvisorInfoAndAssetCount } from "./types/response/topAdvisorsForCustodianAnalysis";

export class DataAnalyzer {
    private dataContainer: DataContainer;

    constructor(dataContainer: DataContainer) {
        this.dataContainer = dataContainer;
    }

    /**
     * Gets the total assets under management (AUM) for all advisors and accounts being managed.
     * @returns The total assets under management and the total value of those assets.
     */
    public calculateTotalAum() {
        // first get all the accounts the advisors are managing
        let repIdList: Array<string> = []
        for(const advisor of this.dataContainer.getAllAdvisors()) {
            repIdList = repIdList.concat(advisor.custodians.map(custodian => custodian.repId));
        }

        let totalUnits = 0;
        let totalValue = 0;
        for(const repId of repIdList) {
            const account = this.dataContainer.getAccountById(repId);
            if(account) {
                for(const holding of account.holdings) {
                    const unitCount = holding.unitCount;
                    const unitPrice = holding.unitPrice;

                    totalUnits += unitCount;
                    totalValue += (unitCount * unitPrice);
                }
            }
        }

        return {
            totalAssetValue: totalValue,
            totalAssetUnits: totalUnits
        };
    }

    // TODO: Create a function to calculate the top securities across all accounts 

    /**
     * Calculates the top securities held for a specific account.
     * @param repId - RepId of the account to get the top securities for
     * @param numberOfSecuritiesToReturn - The number of securities to get
     * @returns A list containing the top securities held for the specified account.
     */
    public calculateTopSecuritiesForAccount(repId: string, numberOfSecuritiesToReturn: number) {
        const account = this.dataContainer.getAccountById(repId);
        const securitiesHeldMap = new Map();
        if(account) {
            for(const holding of account.holdings) {
                const ticker = holding.ticker;

                const security = this.dataContainer.getSecurityByTicker(ticker);
                if(security) {
                    let numUnitsHeld = holding.unitCount;
                    if(securitiesHeldMap.has(ticker)) {
                        numUnitsHeld += securitiesHeldMap.get(ticker).numUnitsHeld;
                    }
                    securitiesHeldMap.set(ticker, {
                        securityName: security.name,
                        ticker: security.ticker,
                        id: security.id,
                        numUnitsHeld: numUnitsHeld
                    });
                }
            }

            // convert map to a list sorted by num units held
            const securitiesHeldList = Array.from(securitiesHeldMap.values()).sort((sec1, sec2) => sec2.numUnitsHeld - sec1.numUnitsHeld);

            return securitiesHeldList.slice(0, Math.min(numberOfSecuritiesToReturn, securitiesHeldList.length));
        }
        return [];
    }
    
    /**
     * Calculates the top advisors that have the most assets per custodian.
     * @param numAdvisorsToReturn - The number of advisors to return per custodian
     * @returns A list CustodianTopAdvisors objects. Each CustodianTopAdvisors object contains the custodian name and an ordered list of the advisors with the most assets
     * in the custodian
     */
    public calculateTopAdvisorsForAllCustodians(numAdvisorsToReturn: number) {
        const custodianToAdvisorListMap = new Map();
        const allAdvisors = Array.from(this.dataContainer.getAllAdvisors());
        const custodianSet = this.getCustodianSet(allAdvisors);

        for(const advisor of allAdvisors) {
            // first capture total assets per custodian for each advisor
            const custodianToAssetCountMap = this.initCustodianToAssetCountMap(custodianSet);
            for(const custodian of advisor.custodians) {
                const account = this.dataContainer.getAccountById(custodian.repId);
                
                let totalAssets = 0;
                if(account) {
                    totalAssets = account.holdings.map(holding => holding.unitCount).reduce((partialSum, unitCount) => partialSum + unitCount, 0);
                }

                let assetSumForCustodian = totalAssets;
                if(custodianToAssetCountMap.has(custodian.name)) {
                    assetSumForCustodian += custodianToAssetCountMap.get(custodian.name);
                }
                custodianToAssetCountMap.set(custodian.name, assetSumForCustodian);
            }

            // now insert the advisors holdings per custodian into the broader map for all advisors, being sure to insert in order of total assets for the custodian.
            for(const [custodianName, totalAssets] of custodianToAssetCountMap.entries()) {
                if(custodianToAdvisorListMap.has(custodianName)) {
                    const advisorList = custodianToAdvisorListMap.get(custodianName);
                    this.insertInOrder(advisorList, {
                        name: advisor.name,
                        id: advisor.id,
                        assetCount: totalAssets
                    });
                }
                else {
                    custodianToAdvisorListMap.set(custodianName, [{
                        name: advisor.name,
                        id: advisor.id,
                        assetCount: totalAssets
                    }]);
                }
            }
        }

        // finally, go through each custodian in the broader map and return the top advisors with holdings in said custodian
        const result = [];
        for(const [custodianName, advisorList] of custodianToAdvisorListMap) {
            result.push({
                custodianName,
                topAdvisors: advisorList.slice(0, Math.min(advisorList.length, numAdvisorsToReturn)),
            });
        }

        return result;
    }

    /**
     * Initializes the custodian map so that it has keys for every custodian in the provided set and initializes the values to 0
     * @param custodianSet - A set of custodian names
     * @returns A map with every custodian name as keys and all values 0
     */
    private initCustodianToAssetCountMap(custodianSet: Set<string>) {
        const custodianMap = new Map();
        for(const custodianName of custodianSet) {
            custodianMap.set(custodianName, 0);
        }
        return custodianMap;
    }

    /**
     * Inserts advisor data into a list of advisor data in order from largest to smallest.
     * @param advisorList - List to insert into. 
     * @param advisorToInsert - The advisor info to insert into the list
     * @returns Nothing. The advisorList is modified.
     */
    private insertInOrder(advisorList: Array<AdvisorInfoAndAssetCount>, advisorToInsert: AdvisorInfoAndAssetCount) {
        for(let index = 0; index < advisorList.length; index++) {
            const advisorInList = advisorList[index];
            if(advisorToInsert.assetCount > advisorInList.assetCount) {
                advisorList.splice(index, 0, advisorToInsert);
                return;
            }
        }
        advisorList.push(advisorToInsert);
    }

    /**
     * Gets the set of custodians from the advisor data list
     * @param advisorDataList - List of advisors to get custodians from
     * @returns - The set of all custodians
     */
    private getCustodianSet(advisorDataList: Array<AdvisorData>) {
        const custodianSet = new Set<string>();
        for(const advisorData of advisorDataList) {
            for(const custodian of advisorData.custodians) {
                custodianSet.add(custodian.name);
            }
        }
        return custodianSet;
    }


}