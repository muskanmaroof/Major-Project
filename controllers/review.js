const Review = require("../models/review");
const Listing = require("../models/listing"); 

/// ==== post Review  Route ==== ///
module.exports.createReview =async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newRev =new Review(req.body.review);
    newRev.author = req.user._id;
    console.log(newRev);

    listing.reviews.push(newRev);

    await listing.save();
    await newRev.save();
    req.flash("success","New Review Created");
    res.redirect(`/listings/${listing._id}`);
}

/// ==== delete review Router ==== ///
module.exports.destroyReview =async (req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull:{reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success"," Review Deleted");
    res.redirect(`/listings/${id}`);
};