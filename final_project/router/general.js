const express = require('express');
let books = require("./booksdb.js");
const { restart } = require('nodemon');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(400).json({message: "Username and Password are required!"})
  } else if (users.find((user) => user.username === username)) {
    return res.status(409).json({message: "Username already exists."});
  }
  users.push({username, password});
  return res.status(201).json({message: "Successfully registered user."});
});

// Task 10
const getBooks = () => {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
};

// Task 1
// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  try {
    const bookList = await getBooks();
    res.status(200).json(bookList)
  } catch (err) {
    res.status(500).json({message: "Error retrieving book list."});
  }
  
});

// Task 11
const getBookByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
    let isbnNumber = parseInt(isbn);
    if (books[isbnNumber]) {
      resolve(books[isbnNumber]);
    } else {
      reject({status: 404, message: `ISBN ${isbn} not found.`});
    }
  });
};

// Task 2
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  getBookByISBN(isbn)
  .then(
    result => res.send(result),
    err => res.status(err.status).json({message: err.message})
  );
  
 });
 
// Task 3
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  getBooks()
  .then((bookList) => Object.values(bookList))
  .then((books) => books.filter((book) => book.author === author))
  .then((filteredBooks) => {
    if (filteredBooks.length > 0) {
      res.send(filteredBooks)
    } else {
      res.status(404).json({message: `There is no book that written by ${author}`});
    }
  });
});

// Task 4
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  getBooks()
  .then((bookList) => Object.values(bookList))
  .then((books) => books.filter((book) => book.title = title))
  .then((filteredBooks) => {
    if (filteredBooks.length > 0) {
      res.send(filteredBooks)
    } else {
      res.status(404).json({message: `There is no book title of ${title}`});
    }
  })
});

// Task 5
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  getBookByISBN(isbn)
  .then(
    result => res.send(result.reviews),
    error => res.status(error.status).json({message: error.message})
  )
});

module.exports.general = public_users;
