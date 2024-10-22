import twoAdvisorsAndFiveAccounts from "./testData/twoAdvisorsAndFiveAccounts.json";
import threeAdvisorsAndThreeCustodians from "./testData/threeAdvisorsAndThreeCustodians.json";

import { parseInputData } from "../src/dataParser";
import { DataAnalyzer } from "../src/dataAnalyzer";
import { AdvisorInfoAndAssetCount, CustodianTopAdvisors } from "../src/types/response/topAdvisorsForCustodianAnalysis";

const initDataAnalyzer = (rawData: any) => {
    const dataContainer = parseInputData(rawData);
    return new DataAnalyzer(dataContainer);
}


describe("Total Assets Under Management Analysis", () => {
    test("calculateTotalAum should sum all assets and asset values", () => {
        const dataAnalyzer = initDataAnalyzer(twoAdvisorsAndFiveAccounts);

        const totalAum = dataAnalyzer.calculateTotalAum();

        expect(totalAum.totalAssetUnits).toBe(706);
        expect(totalAum.totalAssetValue).toBe(29816.10);
    });
});

describe("Top Securities By Account Analysis", () => {
    test("calculateTopSecuritiesForAccount should return the top securities held for a specific account in an ordered list", () => {
        const dataAnalyzer = initDataAnalyzer(twoAdvisorsAndFiveAccounts);
        
        const numSecuritiesToReturn = 3;
        const topSecurities = dataAnalyzer.calculateTopSecuritiesForAccount("101112", numSecuritiesToReturn);

        expect(topSecurities.length).toBe(numSecuritiesToReturn);

        expect(topSecurities[0].ticker).toBe("TESTC");
        expect(topSecurities[0].numUnitsHeld).toBe(50);

        expect(topSecurities[1].ticker).toBe("TESTB");
        expect(topSecurities[1].numUnitsHeld).toBe(13);

        expect(topSecurities[2].ticker).toBe("TESTA");
        expect(topSecurities[2].numUnitsHeld).toBe(10);
    });

    test("calculateTopSecuritiesForAccount should return an empty list for a non-existing account", () => {
        const dataAnalyzer = initDataAnalyzer(twoAdvisorsAndFiveAccounts);
        
        const topSecurities = dataAnalyzer.calculateTopSecuritiesForAccount("nonExistingAccount", 4);

        expect(topSecurities.length).toBe(0);
    });
});

describe("Top Advisors per Custodian Analysis", () => {
    const getCustodianFromResponse = (custodianName: string, custodiansAndTopAdvisors: Array<CustodianTopAdvisors>) => {
        return custodiansAndTopAdvisors.find((custodianAndAdvisors) => custodianAndAdvisors.custodianName === custodianName);
    };

    const validateAdvisor = (expectedAdvisorName: string, expectedAdvisorId: string, expectedAssetCount: number, advisorInfo?: AdvisorInfoAndAssetCount) => {
        expect(advisorInfo?.name).toBe(expectedAdvisorName);
        expect(advisorInfo?.id).toBe(expectedAdvisorId);
        expect(advisorInfo?.assetCount).toBe(expectedAssetCount);
    }

    test("calculateTopAdvisorsForAllCustodians should return a list of all custodians and the top advisors per custodian", () => {
        const dataAnalyzer = initDataAnalyzer(threeAdvisorsAndThreeCustodians);
        
        const numAdvisorsToReturn = 3;
        
        const custodiansAndTopAdvisors = dataAnalyzer.calculateTopAdvisorsForAllCustodians(numAdvisorsToReturn);

        expect(custodiansAndTopAdvisors.length).toBe(numAdvisorsToReturn);

        // validate "Schwab"
        const schwabData = getCustodianFromResponse("Schwab", custodiansAndTopAdvisors);
        expect(schwabData?.custodianName).toBe("Schwab");
        expect(schwabData?.topAdvisors.length).toBe(3);
        
        validateAdvisor("Test Advisor 1", "1", 405, schwabData?.topAdvisors[0]);
        validateAdvisor("Test Advisor 3", "3", 60, schwabData?.topAdvisors[1]);
        validateAdvisor("Test Advisor 2", "2", 0, schwabData?.topAdvisors[2]);

        // validate "Fidelity"
        const fidelityData = getCustodianFromResponse("Fidelity", custodiansAndTopAdvisors);
        expect(fidelityData?.custodianName).toBe("Fidelity");
        expect(fidelityData?.topAdvisors.length).toBe(3);
        
        validateAdvisor("Test Advisor 2", "2", 2500, fidelityData?.topAdvisors[0]);
        validateAdvisor("Test Advisor 1", "1", 509, fidelityData?.topAdvisors[1]);
        validateAdvisor("Test Advisor 3", "3", 3, fidelityData?.topAdvisors[2]);

        // validate "Morgan Stanley"
        const morganStanleyData = getCustodianFromResponse("Morgan Stanley", custodiansAndTopAdvisors);
        expect(morganStanleyData?.custodianName).toBe("Morgan Stanley");
        expect(morganStanleyData?.topAdvisors.length).toBe(3);
        
        validateAdvisor("Test Advisor 3", "3", 1400, morganStanleyData?.topAdvisors[0]);
        validateAdvisor("Test Advisor 1", "1", 1200, morganStanleyData?.topAdvisors[1]);
        validateAdvisor("Test Advisor 2", "2", 0, morganStanleyData?.topAdvisors[2]);
    });
});