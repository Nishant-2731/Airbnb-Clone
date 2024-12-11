const Listing = require("../models/Listing")

module.exports.index = async (req, res)=>
{
    let allListings = await Listing.find({})
    res.render("listings/index.ejs", { allListings })
}

module.exports.showListing = async (req, res, next)=>
{
    let {id} = req.params;
    // Nested populate
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews", 
        populate: {
            path: "author",
        }
    })
    .populate("owner");
    console.log(listing)
    if(!listing)
    {
        req.flash("error", "Listing you requested for does not exist")
        res.redirect("/listings")
    }
    res.render("listings/show.ejs", { listing })
}

module.exports.renderNewForm = async (req, res)=>
{
    res.render("listings/new.ejs")
}

module.exports.createNewListing = async (req, res, next)=>
{
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename }
    await newListing.save();
    req.flash("success", "New Listing Created!")
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res, next)=>
{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing)
    {
        req.flash("error", "Listing you requested for does not exist")
        res.redirect("/listings")
    }

    let ogImageUrl = listing.image.url;
    ogImageUrl = ogImageUrl.replace("/upload", "/upload/w_250")
    res.render("listings/edit.ejs", { listing, ogImageUrl })
}

module.exports.editListing = async (req, res, next)=>
{
    let {id} = req.params;

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, {new: true, runValidators: true})

    if(typeof req.file !== "undefined")
    {
        let url = req.file.path;
        let filename = req.file.filename;    
        listing.image = { url, filename }
        await listing.save();
    }

    req.flash("success", "Listing Updated")
    res.redirect(`/listings/${id}`);    
}

module.exports.destroyListing = async (req, res, next)=>
{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing)
    req.flash("success", "Listing Deleted")
    res.redirect("/listings")
}