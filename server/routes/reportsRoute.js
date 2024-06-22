const router = require("express").Router();
const Book = require("../models/booksModel");
const Issue = require("../models/issuesModel");
const User = require("../models/usersModel");
const authMiddleware = require("../middlewares/authMiddleware");

// get reports
router.get("/get-reports", authMiddleware, async (req, res) => {
  try {
    // books report
    const books = await Book.find();
    const booksCount = books.length;
    const totalBooksCopiesCount = books.reduce((acc, book) => {
      return acc + book.totalCopies;
    }, 0);
    const availableBooksCopiesCount = books.reduce((acc, book) => {
      return acc + book.availableCopies;
    }, 0);

    const issuesBooksCopiesCount =
      totalBooksCopiesCount - availableBooksCopiesCount;

    // users report
    const users = await User.find();
    const usersCount = users.length;
    const patronsCount = users.filter((user) => user.role === "patron").length;
    const librariansCount = users.filter(
      (user) => user.role === "librarian"
    ).length;
    const adminsCount = users.filter((user) => user.role === "admin").length;

    // issues report
    const issues = await Issue.find();
    const issuesCount = issues.length;
    const returnedIssuesCount = issues.filter(
      (issue) => issue.returnedDate !== null
    ).length;
    const pendingIssuesCount = issuesCount - returnedIssuesCount;

    res.send({
      success: true,
      data: {
        books: {
          booksCount,
          totalBooksCopiesCount,
          availableBooksCopiesCount,
          issuesBooksCopiesCount,
        },
        users: {
          usersCount,
          patronsCount,
          librariansCount,
          adminsCount,
        },
        issues: {
          issuesCount,
          returnedIssuesCount,
          pendingIssuesCount,
        },
      },
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
