// create web server
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const { randomBytes } = require('crypto');

// create express app
const app = express();

// use body parser
app.use(bodyParser.json());
// use cors
app.use(cors());

// comments object
const commentsByPostId = {};

// get all comments for a post
app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

// create a comment for a post
app.post('/posts/:id/comments', async (req, res) => {
  // generate random id for comment
  const commentId = randomBytes(4).toString('hex');
  // get the content of the comment from the request body
  const { content } = req.body;

  // get all comments for the post id
  const comments = commentsByPostId[req.params.id] || [];
  // push the new comment to the comments array
  comments.push({ id: commentId, content, status: 'pending' });
  // update the comments object
  commentsByPostId[req.params.id] = comments;

  // send event to event bus
  await axios.post('http://event-bus-srv:4005/events', {
    type: 'CommentCreated',
    data: {
      id: commentId,
      content,
      postId: req.params.id,
      status: 'pending',
    },
  });

  // send response with comments
  res.status(201).send(comments);
});

// handle event from event bus
app.post('/events', async (req, res) => {
  console.log('Event Received:', req.body.type);

  // get the event type and data from the request body
  const { type, data } = req.body;

  // check if the event type is CommentModerated
  if (type === 'CommentModerated') {
    // get the comment id and status from the data
    const { id, postId, status, content } = data;

    // get the comments for the post id
    const comments = commentsByPostId[postId];

    // get the comment from the comments array
    const comment = comments.find((comment) => {
      return comment.id === id;
    });

    // update the