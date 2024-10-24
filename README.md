# Advisor Dashboard
This application is a backend API service to support a financial advisory firm dashboard. The dashboard summarizes data and provides statistics for advisors, accounts, and securities.

## Project Assumptions
* The total assets under management should include the total number of assets as well as the total value of those assets (calculated by the asset count multiplied by the asset unit price).
* For determing the top securities held, the instructions did not specify if it needed to be the top securities for a specific account or the top securities in the entire data set. I created endpoints for both.
* The endpoints for retrieving the top securities held and the top advisors per custodian should have a request parameter for the number of securities/advisors to return in the response.
* The endpoint for exposing the advisor data should also include summarized data of the accounts under the advisor. The includes the holdings of each account and security info on each holding.
* The endpoint for exposing account data should also include the security data for each holding in the account.

## Set-up Instructions
### Prerequsities
1. Make sure to have Node installed on your machine.

    (Note: This project was built with Node v20.18.0)
### Instructions
1. Pull down this project into an local repository.
1. Install package dependencies by running `npm install` in the terminal.
1. Modify the input data.
    1. This can be done by modifying the input file located at "input/inputData.json".
    1. The data in this file must be in the correct format which is specified below. The JSON data that is currently in that file can also be used an example. 

    Input Data Format:
    ```
    {
        "advisors": [
            {
                "id": "<AdvisorId>",
                "name": "<AdvisorName>",
                "custodians": [
                    {
                        "name": "<CustodianName>",
                        "repId": "<AccountRepId>"
                    },
                    .
                    .
                    .
                ]
            }
        ],
        "accounts": [
            {
                "name": "<AccountName>",
                "number": "<AccountNumber>",
                "repId": "<AccountRepId>",
                "holdings": [
                    {
                        "ticker": "<SecurityTicker>",
                        "units": <NumberOfUnits>,
                        "unit_price": <UnitPriceOfAsset>
                    },
                    .
                    .
                    .
                ],
                "custodian": "<CustodianName>"
            },
            .
            .
            .
        ],
        "securities": [
            {
                "id": "<SecurityId>",
                "ticker": "<SecurityTicker>",
                "name": "<SecurityName>",
                "dateAdded": "<DateSecurityAdded>"
            },
            .
            .
            .
        ]
    }
    ```
1. Build the application with `npm run build`. This will compile the package and run all unit tests.
1. Start the simple server with `npm run server`. This will start a server on port 3000.
1. In a separate terminal, use curl commands to fetch data from the server. The commands for each endpoint are listed below. 


### Endpoints
* `curl http://localhost:3000/analysis/aum`
    * Get the Total Assets under Management.
* `curl http://localhost:3000/analysis/securities/<numberToReturn>`
    * Gets the top securities held across all accounts in the input dataset.
    * `numberToReturn` - The max number of securities to return.
* `curl http://localhost:3000/analysis/securities/<repId>/<numberToReturn>`
    * Gets the top securities held on the specified account.
    * `repId` - ID of the account.
    * `numberToReturn` - The max number of securities to return.
* `curl http://localhost:3000/analysis/custodians/<numberToReturn>`
    * Returns all custodians in the dataset. Each custodian in the response also contains a list of advisors. The advisors are ordered by the number of assets they manage at the custodian (from largest to smallest).
    * `numberToReturn` - The max number of advisors to return per custodian.
* `curl http://localhost:3000/summary/advisor/<repId>`
    * Returns a summary of the advisor, the accounts under them, and the holdings of those accounts.
    * `repId` - ID of the advisor
* `curl http://localhost:3000/summary/account/<repId>`
    * Returns a summary of the account and the holdings in the account.
    * `repId` - ID of the account to retrieve.
* `curl http://localhost:3000/summary/security/<id>`
    * Returns the summary of a security.
    * `id` - ID of the security.

## Next Steps for Improvement

There are various TODO comments within this package that detail things I would improve in this application. I will summarize them here:

* Adding additional endpoints that can add/update data in the dataset so the server doesn't have to restart to use different data.
* Currently, there is no error handling for bad requests. I would like to add requst validation that returns a 400 response for bad requests.
* There are not many console logs included in this application. To make this application production-ready, it would be wise to add in logs to help with KTLO.
* Currently, the account data is keyed to the security data through the security ticker. It would be better to use the security ID as the key instead.
* The responses that include monetary values (such as in the AUM analysis response), currently return the price as numeric value. These should instead be display-ready strings that are in a currency format.
* There are more unit tests that could be added, such as tests for the getSecuritySummary() function in the Data Container.