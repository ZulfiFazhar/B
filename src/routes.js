const express = require("express");
const router = express.Router();
const {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
} = require("./handler");

router.post("/books", addBookHandler);
router.get("/books", getAllBooksHandler);
router.get("/books/:id", getBookByIdHandler);
router.put("/books/:id", editBookByIdHandler);
router.delete("/books/:id", deleteBookByIdHandler);

module.exports = router;
