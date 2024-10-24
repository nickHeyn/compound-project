import express from 'express';
import { parseInputData } from './dataParser';
import { DataAnalyzer } from './dataAnalyzer';

const dataContainer = parseInputData();
const dataAnalyzer = new DataAnalyzer(dataContainer);

const app = express();


// TODO: Add endpoints for modifying data
// TODO: Add error handling for bad requests
// TODO: Add additional console logging for debugging errors
app.get('/analysis/aum', (req, res) => {
    res.send(dataAnalyzer.calculateTotalAum());
});

app.get('/analysis/securities/:count', (req, res) => {
    res.send(dataAnalyzer.calculateTopSecuritiesForAllAccounts(Number(req.params.count)));
});

app.get('/analysis/securities/:repId/:count', (req, res) => {
    res.send(dataAnalyzer.calculateTopSecuritiesForAccount(req.params.repId, Number(req.params.count)));
});

app.get('/analysis/custodians/:count', (req, res) => {
    res.send(dataAnalyzer.calculateTopAdvisorsForAllCustodians(Number(req.params.count)));
});

app.get('/summary/advisor/:id', (req, res) => {
    res.send(dataContainer.getAdvisorSummary(req.params.id));
});

app.get('/summary/account/:repId', (req, res) => {
    res.send(dataContainer.getAccountSummary(req.params.repId));
});

app.get('/summary/security/:id', (req, res) => {
    res.send(dataContainer.getSecuritySummary(req.params.id));
});



app.listen(3000, () => {
    console.log('Running the application on port 3000!');
})
    