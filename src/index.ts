import express from 'express';
import { parseInputData } from './dataParser';

const dataContainer = parseInputData();
dataContainer.printData();



const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.listen(3000, () => {
    console.log('Running the application on port 3000!');
})
    