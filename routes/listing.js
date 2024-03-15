const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwned,validateListing} = require("../middleware.js")
const listingController = require("../controllers/listing.js")
const multer =require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

//index route & //Create route
router.route("/")
.get( wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("image"),validateListing, wrapAsync( listingController.createListing));


//New Route
router.get("/new",isLoggedIn,listingController.showNewForm);

//show route & //Update route & //DELETE ROUTE 
router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwned,upload.single("image"),validateListing, wrapAsync( listingController.updateListing))
.delete(isLoggedIn,isOwned, wrapAsync(listingController.destroyListing));

//Edit route
router.get("/:id/edit", isLoggedIn,isOwned,wrapAsync(listingController.renderEditForm));

module.exports = router;