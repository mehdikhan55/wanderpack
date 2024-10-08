const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js')
const Review = require("../models/review")
const Listing = require("../models/listing");
const { validateReview, isLoggedIn, isReviewAuthor, isLoggedInForReview } = require('../middleware.js');


const reviewController = require("../controllers/reviews.js");


//reviews
//post route for reviews
router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview)
);

// delete review route
router.delete("/:reviewId",
    isLoggedInForReview,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview)
)


module.exports = router;