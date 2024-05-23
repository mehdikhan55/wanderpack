const Listing = require("./models/listing");
const Review = require("./models/review")
const { listingSchema, reviewSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn=(req,res,next)=>{
    if (!req.isAuthenticated()) {
        //redirect url
        req.session.redirectUrl=req.originalUrl;
        console.log(req.session.redirectUrl)
        req.flash("error","You must be logged in for this action!")
        res.redirect('/login');
    }  
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}


module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let listing=await Listing.findById(id);
    console.log(listing.owner)
    console.log(res.locals.currUser)
    if(!((res.locals.currUser) && (listing.owner.equals(res.locals.currUser._id)))){
        req.flash("error","You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`); 
    }
    next();
}


module.exports.validateListing = (req, res, next) => {
    // console.log("Request Body:", req.body);
    //  let result=  listingSchema.validate(req.body);
    // console.log(result);
    //  console.log(result.error)
    //  if(result.error) throw new ExpressError(400,result.error);
    let result = listingSchema.validate(req.body);
    let error = result.error;
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else next();
}

module.exports.validateReview =(req,res,next)=>{
    let result= reviewSchema.validate(req.body);
    let error=result.error;
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg); 
    }   
    else next();
}

module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
    
}