const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  const isMatch = users.filter((user) => user.username == username);
  return isMatch.length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
const isMatch = users.filter((user) => user.username === username && user.password === password);
return isMatch.length > 0;
}

// Task 7
//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({data:password}, "access", {expiresIn:50000});
    req.session.authorization = {accessToken, username};
    return res.status(200).send("Login successfully.");
  } else {
    return res.status(401).send("Invalid username and password.");
  }
});

// Task 8
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  const review = req.body.review;
  console.log("isbn: ", isbn);
  if (books[isbn]) {
    let book = books[isbn];
    book.reviews[username] = review;
    return res.status(201).send("Successfully added book review.");
  } else {
    return res.status(404).json({message: `ISBN ${isbn} not found.`});
  }
});

// Task 9
// Delete a book
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  if (books[isbn]) {
    let book = books[isbn];
    delete book.reviews[username];
    return res.status(200).send("Successfully deleted review.");
  } else {
    return res.status(400).json({message: `ISBN ${isbn} not found.`});
  }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
