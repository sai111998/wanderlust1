
const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    validateListing,
    upload.single("listing[image]"),
    wrapAsync(listingController.createListing)
  );

router.post("/search", wrapAsync(listingController.search));
router.get("/trending", wrapAsync(listingController.trending));
router.get("/room", wrapAsync(listingController.room));
router.get("/iconic", wrapAsync(listingController.iconic));
router.get("/mountain", wrapAsync(listingController.mountain));
router.get("/castle", wrapAsync(listingController.castle));
router.get("/pool", wrapAsync(listingController.pool));
router.get("/camping", wrapAsync(listingController.camping));
router.get("/farm", wrapAsync(listingController.farm));
router.get("/eco", wrapAsync(listingController.eco));
router.get("/boat", wrapAsync(listingController.boat));
router.get("/skiing", wrapAsync(listingController.skiing));
router.get("/arctic", wrapAsync(listingController.arctic));

//New Listing
router.get("/new", isLoggedIn, listingController.newListing);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListings))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destoryListing));

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing)
);

module.exports = router;
