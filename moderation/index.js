const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/events', (req, res) => {});

app.use(4003, () => {
	console.log('listening on port 4003');
});
