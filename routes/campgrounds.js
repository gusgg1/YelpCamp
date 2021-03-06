const express    = require("express");
const router     = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware");
const multer     = require('multer');
const cloudinary = require('cloudinary');
const mongoose   = require("mongoose");


// Config multer
const storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});

const imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFilter})

// Config cloudinary
cloudinary.config({ 
  cloud_name: 'dmvwqhup8', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// INDEX - Show all campgrounds
router.get("/", function(req, res) {
  let noMatch = null;
  const perPage = 8;
  const pageQuery = parseInt(req.query.page);
  const pageNumber = pageQuery ? pageQuery : 1;

  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Campground.find({ name: regex }).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, campgrounds) {
      Campground.countDocuments({name: regex}).exec(function (err, count) {
        if (err) {
          console.log(err);
          res.redirect("back");
        } else {
          if (campgrounds.length < 1) {
            noMatch = "No campgrounds match that query, please try again."
          }
          res.render("campgrounds/index", { 
            campgrounds, 
            page: "campgrounds",
            noMatch,
            pages: Math.ceil(count / perPage),
            search: req.query.search, 
            current: pageNumber
          });
        }
      });
    });
  } else {
    // get all campgrounds from DB
    Campground.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, campgrounds) {
      Campground.countDocuments().exec(function (err, count) {
        if (err) {
          console.log(err);
        } else {
          res.render("campgrounds/index", { 
            campgrounds, 
            page: "campgrounds", 
            noMatch,
            current: pageNumber,
            pages: Math.ceil(count / perPage),
            search: false 
          });
        }
      });
    });
  }
});

// CREATE - add new campground to DB - multiple images upload or URL upload
router.post("/", middleware.isLoggedIn, upload.array("campground[image]"), async function(req, res){
  // add author to campground
  if (req.body.campground.image === '') {
    req.body.campground.author = {
      id: req.user._id,
      username: req.user.username
    };

    req.body.campground.image = [];
    req.body.campground.imageId = [];
    for (const file of req.files) {
      let result = await cloudinary.v2.uploader.upload(file.path);
      req.body.campground.image.push(result.secure_url);
      req.body.campground.imageId.push(result.public_id);
    }

    Campground.create(req.body.campground, function(err, campground) {
      if (err) {
        req.flash("error", err.message);
        return res.redirect('back');
      }
      res.redirect('/campgrounds/' + campground.id);
    });
  } else {
    const name = req.body.campground.name;
    const price = req.body.campground.price;
    const image = req.body.campground.image;
    const description = req.body.campground.description;
    const author = {
      id: req.user._id,
      username: req.user.username
    }
    const newCampground = { name, price, image, description, author }
    Campground.create(newCampground, function(err, newlyCreated) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/campgrounds/" + newlyCreated.id);
      }
    });
  }
});


// NEW - show form to make a new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
  res.render("campgrounds/new");
});

// SHOW - shows info about 1 campground
router.get("/:id", function(req, res) {
  // here we unpack the comments to be actual comments and NOT the id refs
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
    if (err || !foundCampground) {
      req.flash("error", "Campground not found");
      res.redirect("back");
    } else {
      res.render("campgrounds/show", { foundCampground });
    }
  });
});


// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findById(req.params.id, function(err, foundCampground) {
    if (err) {
      console.log(err);
    } else {
      // render show template with that campground
      res.render("campgrounds/edit", { foundCampground });
    }
  });
});


// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, upload.array('campground[image]'), function(req, res) {
  Campground.findById(req.params.id, async function(err, campground) {
    if (err) {
      req.flash("error", err.message);
      res.redirect("back");
    } else {  
      // We check if there is a file, if there is we know user is trying to upload a new img for that campground
      if (req.files && req.body.campground.image === '') {
        try {

          campground.imageId.forEach(async function(id) {
            await cloudinary.v2.uploader.destroy(id);
          });

          campground.image = [];

          for (const file of req.files) {
            let result = await cloudinary.v2.uploader.upload(file.path);
            campground.image.push(result.secure_url);
            campground.imageId.push(result.public_id);
          }
        } catch(err) {
          req.flash("error", err.message);
          return res.redirect("back");
        }
      }
      if (req.body.campground.image.length > 0) {
        campground.imageId.forEach(async function(id) {
          await cloudinary.v2.uploader.destroy(id);
        });
        campground.image = req.body.campground.image;
      }
      campground.name = req.body.campground.name;
      campground.description = req.body.campground.description;
      campground.price = req.body.campground.price;
      campground.save();
      req.flash("success", "Successfully Updated!");
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  });
}); 


// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findById(req.params.id, async function(err, campground) {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("back");
    }
    try {
      campground.imageId.forEach(async function(id) {
        await cloudinary.v2.uploader.destroy(id);
      });
      campground.remove();
      req.flash("success", "Campground deleted successfully");
      res.redirect("/campgrounds");
    } catch(err) {
      req.flash("error", err.message);
      return res.redirect("back");
    }
  });
});


function escapeRegex(query) {
  return query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}


module.exports = router;