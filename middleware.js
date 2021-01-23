var Campground=require("./model/data.js");
const Review = require("./model/review.js");
var {reviewSchema,campgroundSchema}=require("./schemas.js")
var ExpressError=require("./utils/ExpressError");
module.exports.islogin =(req,res,next)=>{
    if(!req.isAuthenticated()){
        //console.log(req.path,req.originalUrl)
        req.session.returnTo=req.originalUrl
        req.flash("error","sign in to create")
     return res.redirect("/login")
    }
    next()
}

module.exports.campgroundValidation=(req,res,next)=>{
    const {error}=campgroundSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(",")
        throw new ExpressError(msg,400)
    }else{
        next();
    }
}
module.exports.isAuthor=async(req,res,next)=>{
let campground=await Campground.findById(req.params.id)
if(!campground.author.equals(req.user._id)){
    req.flash("error","you are not allowed")
     return res.redirect(`/campgrounds/${req.params.id}`)
}
next()
}
module.exports.isRevAuthor=async(req,res,next)=>{
    const {id,reviewId}=req.params;
    let review=await Review.findById(reviewId)
    if(!review.author.equals(req.user._id)){
        req.flash("error","you are not allowed")
         return res.redirect(`/campgrounds/${id}`)
    }
    next()
    }
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
