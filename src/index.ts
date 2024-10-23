import express from 'express';
import { parseInputData } from './dataParser';
import { DataAnalyzer } from './dataAnalyzer';

const dataContainer = parseInputData();
const dataAnalyzer = new DataAnalyzer(dataContainer);

const app = express();


// TODO: Add error handling for bad requests
app.get('/analysis/aum', (req, res) => {
    res.send(dataAnalyzer.calculateTotalAum());
});

app.get('/analysis/securities/:accountId/:count', (req, res) => {
    res.send(dataAnalyzer.calculateTopSecuritiesForAccount(req.params.accountId, Number(req.params.count)));
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
    