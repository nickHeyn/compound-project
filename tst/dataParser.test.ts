import oneOfEach from "./testData/oneOfEach.json";
import { parseInputData } from "../src/dataParser";


describe("Data Parser", () => {
    test("Data container should contain all data from provided input", () => {
        const dataContainer = parseInputData(oneOfEach);
        
        // validate advisor
        expect(dataContainer.getAdvisorMap().size).toBe(1);
        const advisor = dataContainer.getAdvisorById("1");
        expect(advisor?.id).toBe("1");
        expect(advisor?.name).toBe("Test Advisor");
        expect(advisor?.custodians.length).toBe(1);
        expect(advisor?.custodians[0].name).toBe("Schwab");
        expect(advisor?.custodians[0].repId).toBe("123");

        // validate account
        expect(dataContainer.getAccountMap().size).toBe(1);
        const account = dataContainer.getAccountById("123");
        expect(account?.repId).toBe("123");
        expect(account?.name).toBe("Test Account");
        expect(account?.number).toBe("number");
        expect(account?.custodianName).toBe("Schwab");
        expect(account?.holdings.length).toBe(1);
        expect(account?.holdings[0].ticker).toBe("TEST");
        expect(account?.holdings[0].unitCount).toBe(10);
        expect(account?.holdings[0].unitPrice).toBe(20);

        // validate security
        expect(dataContainer.getSecurityMap().size).toBe(1);
        const security = dataContainer.getSecurityByTicker("TEST");
        expect(security?.id).toBe("12345");
        expect(security?.name).toBe("Test Fund");
        expect(security?.ticker).toBe("TEST");
        expect(security?.dateAdded).toBe("Today");
    })
});