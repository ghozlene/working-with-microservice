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

	comments.push({ id: commentId, content, status: 'pending' });
	commentsByPostId[req.params.id] = comments;
	await axios
		.post('http://localhost:4005/events', {
			type: 'CommentCreated',
			data: {
				id: commentId,
				content,
				postId: req.params.id,
				status: 'pending',
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

app.post('/events', async (req, res) => {
	console.log('received events on comments component', req.body.type);

	const { type, data } = req.body;
	if (type === 'CommentModerated') {
		const { postId, id, status, content } = data;
		const comments = commentsByPostId[postId];

		const comment = comments.find((comment) => {
			return comment.id === id;
		});
		comment.status = status;

		await axios
			.post('http://localhost:4005/events', {
				type: 'CommentUpdated',
				data: {
					id,
					status,
					postId,
					content,
				},
			})
			.catch((err) => console.log(err));
	}

	res.status(201).send({});
});

app.listen(4001, () => {
	console.log('server of the comments run on 4001');
});
