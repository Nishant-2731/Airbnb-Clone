const Listing = require("../models/Listing")
const Review = require("../models/Review")

module.exports.createReview = async (req, res, next)=>
{
    let {id} = req.params;
    let listing = await Listing.findById(id)
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await listing.save();
    await newReview.save();

    req.flash("success", "New Review Created")
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview = async (req, res, next)=>
{
    let {id, reviewId} = req.params;

    // $pull operator is used remove a specific object's item 
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted")
    res.redirect(`/listings/${id}`)
}