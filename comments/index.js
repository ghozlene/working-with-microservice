const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const { randomBytes } = require('crypto');
const axios = require('axios');
const app = express();
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors());

const commentsByPostId = {};

app.post('/posts/:id/comments', async (req, res) => {
	const commentId = randomBytes(4).toString('hex');

	const { content } = req.body;

	const comments = commentsByPostId[req.params.id] || [];

	comments.push({ id: commentId, content });
	commentsByPostId[req.params.id] = comments;
	await axios
		.post('http://localhost:4005/events', {
			type: 'ContentCreated',
			data: {
				id: commentId,
				content,
				postId: req.params.id,
			},
		})
		.catch((err) => {
			console.log(err);
		});
	res.status(201).send(comments);
});

app.get('/posts/:id/comments', (req, res) => {
	res.send(commentsByPostId[req.params.id] || []);
});

app.post('/events', (req, res) => {
	console.log('received events on comments component', req.body.type);
	res.status(201).send({});
});
app.listen(4001, () => {
	console.log('server of the comments run on 4001');
});
