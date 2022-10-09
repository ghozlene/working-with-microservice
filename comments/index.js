const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors=require('cors')
const { randomBytes } = require('crypto');
const app = express();
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors())

const commentsByPostId = {};

app.post('/posts/:id/comments', (req, res) => {
	const commentId = randomBytes(4).toString('hex');

	const { content } = req.body;

	const comments = commentsByPostId[req.params.id] || [];

	comments.push({ id: commentId, content });
	commentsByPostId[req.params.id] = comments;

	res.status(201).send(comments);
});

app.get('/posts/:id/comments', (req, res) => {
	res.send(commentsByPostId[req.params.id] || []);
});

app.listen(4001, () => {
	console.log('server of the comments run on 4001');
});
