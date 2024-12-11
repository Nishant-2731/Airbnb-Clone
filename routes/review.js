const express = require("express");
// Normally without mergeParams the :id in ap.js stays there and is not send to review.js properly. But with the help of mergeParams it is done properly
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js")

const reviewController = require("../controllers/reviews.js")

// Create Route - Review

router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Destroy Route - Review

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;