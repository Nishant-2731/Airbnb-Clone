const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/Listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");

const multer = require("multer");
const{ storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Index Route & Create Route - Listing

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.createNewListing));

// New Route

router.get("/new", isLoggedIn, listingController.renderNewForm);

// Edit Route

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// Show Route, Update Route & Destroy Route - Listing

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.editListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;