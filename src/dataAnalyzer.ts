import { DataContainer } from "./dataContainer";
import { AdvisorInfoAndAssetCount } from "./types/response/topAdvisorsForCustodianAnalysis";

class DataAnalyzer {
    private dataContainer: DataContainer;

    constructor(dataContainer: DataContainer) {
        this.dataContainer = dataContainer;
    }

    /**
     * Gets the total assets under management (AUM) for all advisors and accounts being managed
     */
    public calculateTotalAum() {
        // first get all the accounts the advisors are managing
        const repIdList: Array<string> = []
        for(const advisor of this.dataContainer.getAllAdvisors()) {
            repIdList.concat(advisor.custodians.map(custodian => custodian.repId));
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

    /**
     * 
     * @param repId 
     * @param numberOfSecuritiesToReturn 
     * @returns 
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
            const securitiesHeldList = Array.from(securitiesHeldMap.values()).sort((sec1, sec2) => sec1.numUnitsHeld > sec2.numUnitsHeld ? 1 : 0);

            return securitiesHeldList.slice(0, Math.min(numberOfSecuritiesToReturn, securitiesHeldList.length));
        }
    }
    
    /**
     * Calculates the top advisors that have the most assets per custodian.
     * @param numAdvisorsToReturn - The number of advisors to return per custodian
     * @returns A list CustodianTopAdvisors objects. Each CustodianTopAdvisors object contains the custodian name and an ordered list of the advisors with the most assets
     * in the custodian
     */
    public calculateTopAdvisorsForAllCustodians(numAdvisorsToReturn: number) {
        const custodianToAdvisorListMap = new Map();
        for(const advisor of this.dataContainer.getAllAdvisors()) {

            // first capture total assets per custodian for each advisor
            const advisorCustodianMap = new Map();
            for(const custodian of advisor.custodians) {
                const account = this.dataContainer.getAccountById(custodian.repId);
                
                let totalAssets = 0;
                if(account) {
                    totalAssets = account.holdings.map(holding => holding.unitCount).reduce((partialSum, unitCount) => partialSum + unitCount, 0);
                }

                let assetSumForCustodian = totalAssets;
                if(advisorCustodianMap.has(custodian.name)) {
                    assetSumForCustodian += advisorCustodianMap.get(custodian.name);
                }
                advisorCustodianMap.set(custodian.name, assetSumForCustodian);
            }

            // now insert the advisors holdings per custodian into the broader map for all advisors, being sure to insert in order of total assets for the custodian.
            for(const [custodianName, totalAssets] of advisorCustodianMap.entries()) {
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

        // finally, go through each custodian in the broader map and return the top x advisors with holdings in said custodian
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
}