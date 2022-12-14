const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const axios = require('axios');
const { randomBytes } = require('crypto');
const app = express();
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors());
const posts = {};
app.get('/posts', (req, res) => {
	res.send(posts);
});

app.post('/posts', async (req, res) => {
	const id = randomBytes(4).toString('hex');
	const { title } = req.body;
	posts[id] = { id, title };
	await axios
		.post('http://localhost:4005/events', {
			type: 'PostCreated',
			data: {
				id,
				title,
			},
		})
		.catch((err) => {
			console.log(err);
		});
	res.status(201).send(posts[id]);
	console.log(posts[id]);
});

app.post('/events', (req, res) => {
	console.log('received events on posts component', req.body.type);
	res.status(201).send({});
});

console.log('version of this is here !!');
app.listen(4000, () => {
	console.log('this is version v70');
	console.log('listening on port 4000');
});
