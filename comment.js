// create web server with express
// create a route for /api/comment
// return a json object with the following properties
// 1. id
// 2. name
// 3. comment
// 4. date
// 5. status

// 1. create a web server
const express = require("express");
const app = express();

// 2. create a route for /api/comment
// 3. return a json object with the following properties
// 1. id
// 2. name
// 3. comment
// 4. date
// 5. status
app.get("/api/comment", (req, res) => {
  res.send({
    id: 1,
    name: "John Doe",
    comment: "Hello World",
    date: new Date(),
    status: "approved",
  });
});

// 4. listen to port 3000
app.listen(3000, () => console.log("Listening on port 3000..."));