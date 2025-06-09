const Listing = require("../models/listing");
const mbxGeoCoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeoCoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.newListing = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListings = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }

  // Safe geocoding using the stored location
  const response = await geocodingClient
    .forwardGeocode({
      query: listing.location,
      limit: 1,
    })
    .send();

  if (response.body.features.length > 0) {
    listing.geometry = response.body.features[0].geometry;
    await listing.save(); // Save updated geometry to DB (optional)
  } else {
    req.flash("error", "Location not found on map");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};


module.exports.createListing = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  newListing.geometry = response.body.features[0].geometry;
  let savedListing = await newListing.save();
  console.log(savedListing);

  req.flash("success", "New Listing created");
  res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  req.flash("success", "Listing Edited!");
  if (!listing) {
    req.flash("error", "listing does not exist");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_200");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  //deconstruct({...req.body.listing})
  let lisitng = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    lisitng.image = { url, filename };
    await lisitng.save();
  }
  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.destoryListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log("deleted");
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};

module.exports.search = async (req, res) => {
  let { search } = req.body;
  let val = await Listing.find({
    $or: [{ country: search }, { title: search },{location:search}],
  });
  res.render("listings/search.ejs", { val, search });
};

module.exports.trending = async (req, res) => {
  let data = await Listing.find({ category: "trending" });
  console.log(data);
  res.render("listings/trending.ejs", { data });
};

module.exports.room = async (req, res) => {
  let data = await Listing.find({ category: "room" });
  res.render("listings/room.ejs", { data });
};

module.exports.iconic = async (req, res) => {
  let data = await Listing.find({ category: "iconic" });
  res.render("listings/iconic.ejs", { data });
};

module.exports.mountain = async (req, res) => {
  let data = await Listing.find({ category: "mountain" });
  res.render("listings/mountain.ejs", { data });
};

module.exports.castle = async (req, res) => {
  let data = await Listing.find({ category: "castle" });
  res.render("listings/castle.ejs", { data });
};

module.exports.pool = async (req, res) => {
  let data = await Listing.find({ category: "pool" });
  res.render("listings/pool.ejs", { data });
};

module.exports.camping = async (req, res) => {
  let data = await Listing.find({ category: "camping" });
  res.render("listings/camping.ejs", { data });
};

module.exports.farm = async (req, res) => {
  let data = await Listing.find({ category: "farm" });
  res.render("listings/farm", { data });
};

module.exports.eco = async (req, res) => {
  let data = await Listing.find({ category: "eco" });
  res.render("listings/eco", { data });
};

module.exports.boat = async (req, res) => {
  let data = await Listing.find({ category: "boat" });
  res.render("listings/boat", { data });
};

module.exports.skiing = async (req, res) => {
  let data = await Listing.find({ category: "skiing" });
  res.render("listings/skiing", { data });
};

module.exports.arctic = async (req, res) => {
  let data = await Listing.find({ category: "arctic" });
  res.render("listings/arctic", { data });
};
