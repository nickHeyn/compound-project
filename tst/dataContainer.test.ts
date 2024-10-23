import oneOfEach from "./testData/oneOfEach.json";
import twoAdvisorsAndFiveAccounts from "./testData/twoAdvisorsAndFiveAccounts.json";


import { parseInputData } from "../src/dataParser";

describe("Data Container Summaries", () => {
    test("getAdvisorSummary returns advisor data with account summaries", () => {
        const dataContainer = parseInputData(oneOfEach);

        const advisorSummary = dataContainer.getAdvisorSummary("1");
        expect(advisorSummary?.name).toBe("Test Advisor");
        expect(advisorSummary?.id).toBe("1");

        expect(advisorSummary?.accounts.length).toBe(1);
        expect(advisorSummary?.accounts[0].custodianName).toBe("Schwab");
        expect(advisorSummary?.accounts[0].repId).toBe("123");
        expect(advisorSummary?.accounts[0].number).toBe("number");
        expect(advisorSummary?.accounts[0].name).toBe("Test Account");

        expect(advisorSummary?.accounts[0].holdings.length).toBe(1);
        expect(advisorSummary?.accounts[0].holdings[0].ticker).toBe("TEST");
        expect(advisorSummary?.accounts[0].holdings[0].securityId).toBe("12345");
        expect(advisorSummary?.accounts[0].holdings[0].securityName).toBe("Test Fund");
        expect(advisorSummary?.accounts[0].holdings[0].unitPrice).toBe(20);
        expect(advisorSummary?.accounts[0].holdings[0].units).toBe(10);

    });

    test("getAdvisorSummary returns undefined when advisor can not be found", () => {
        const dataContainer = parseInputData(oneOfEach);

        const advisorSummary = dataContainer.getAdvisorSummary("nonExistingAccount");

        expect(advisorSummary).toBeUndefined();
    });

    test("getAccountSummary returns account data", () => {
        const dataContainer = parseInputData(oneOfEach);

        const accountSummary = dataContainer.getAccountSummary("123");
        expect(accountSummary?.custodianName).toBe("Schwab");
        expect(accountSummary?.repId).toBe("123");
        expect(accountSummary?.number).toBe("number");
        expect(accountSummary?.name).toBe("Test Account");

        expect(accountSummary?.holdings.length).toBe(1);
        expect(accountSummary?.holdings[0].ticker).toBe("TEST");
        expect(accountSummary?.holdings[0].securityId).toBe("12345");
        expect(accountSummary?.holdings[0].securityName).toBe("Test Fund");
        expect(accountSummary?.holdings[0].unitPrice).toBe(20);
        expect(accountSummary?.holdings[0].units).toBe(10);
    });

    test("getAllAdvisors returns all advisors", () => {
        const dataContainer = parseInputData(twoAdvisorsAndFiveAccounts);

        const allAdvisors = Array.from(dataContainer.getAllAdvisors());

        expect(allAdvisors.length).toBe(2);
        expect(allAdvisors.some(advisor => advisor.id === "1")).toBeTruthy();
        expect(allAdvisors.some(advisor => advisor.id === "2")).toBeTruthy();

    });

    // TODO: Write additional unit tests for the remaining DataContainer functions such as getAllAccounts(), getSecuritySummary(), etc.
});