const { nanoid } = require("nanoid");
const express = require("express");
const router = express.Router();
const books = require("./books");

const addBookHandler = (req, res) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.body;

  if (name === undefined) {
    res.status(400).json({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
  } else if (readPage > pageCount) {
    res.status(400).json({
      status: "fail",
      message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
  } else {
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;

    const newBook = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      insertedAt,
      updatedAt,
    };

    books.push(newBook);

    const isSuccess = books.filter((note) => note.id === id).length > 0;

    if (isSuccess) {
      res.status(201).json({
        status: "success",
        message: "Buku berhasil ditambahkan",
        data: {
          bookId: id,
        },
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Catatan gagal ditambahkan",
      });
    }
  }
};

const getAllBooksHandler = (req, res) => {
  const { name, reading, finished } = req.query;

  if (name !== undefined) {
    const BooksName = books.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );
    res.status(200).json({
      status: "success",
      data: {
        books: BooksName.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
  } else if (reading !== undefined) {
    const BooksReading = books.filter(
      (book) => Number(book.reading) === Number(reading)
    );
    res.status(200).json({
      status: "success",
      data: {
        books: BooksReading.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
  } else if (finished !== undefined) {
    const BooksFinished = books.filter((book) => book.finished == finished);
    res.status(200).json({
      status: "success",
      data: {
        books: BooksFinished.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
  } else {
    res.status(200).json({
      status: "success",
      data: {
        books: books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
  }
};

const getBookByIdHandler = (req, res) => {
  const { id } = req.params;
  const book = books.filter((b) => b.id === id)[0];
  if (book !== undefined) {
    res.json({
      status: "success",
      data: {
        book,
      },
    });
  } else {
    res.status(404).json({
      status: "fail",
      message: "Buku tidak ditemukan",
    });
  }
};

const editBookByIdHandler = (req, res) => {
  const { id } = req.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.body;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === id);

  if (name === undefined) {
    res.status(400).json({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
  } else if (readPage > pageCount) {
    res.status(400).json({
      status: "fail",
      message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
  } else if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    res.status(200).json({
      status: "success",
      message: "Buku berhasil diperbarui",
    });
  } else {
    res.status(404).json({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    });
  }
};

const deleteBookByIdHandler = (req, res) => {
  const { id } = req.params;
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    res.status(200).json({
      status: "success",
      message: "Buku berhasil dihapus",
    });
  } else {
    res.status(404).json({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    });
  }
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
