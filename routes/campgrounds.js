const express    = require("express");
const router     = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware");
const multer     = require('multer');
const cloudinary = require('cloudinary');


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
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Campground.find({ name: regex }, function(err, campgrounds) {
      if (err) {
        console.log(err);
      } else {
        if (campgrounds.length < 1) {
          noMatch = "No campgrounds match that query, please try again."
        }
        res.render("campgrounds/index", { campgrounds, page: "campgrounds", noMatch });
      }
    });
  } else {
    Campground.find({}, function(err, campgrounds) {
      if (err) {
        console.log(err);
      } else {
        res.render("campgrounds/index", { campgrounds, page: "campgrounds", noMatch });
      }
    });
  }
});


// CREAT - add new campground to DB
router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res) {

  /* Here we let user use an URL for uploading an img:
  const name = req.body.campground.name;
  const price = req.body.campground.price;
  const image = req.body.campground.image;
  const description = req.body.campground.description;
  const author = {
    id: req.user._id,
    username: req.user.username
  }
  // console.log(req.body.image);
  if (req.body.campground.image === '') console.log("YESYES");
  const newCampground = { name, price, image, description, author }
  // campgrounds.push(newCampground);
  Campground.create(newCampground, function(err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });*/
  

/* Here we let user upload img from his local environment:
 cloudinary.uploader.upload(req.file.path, function(result) {
    // add cloudinary url for the image to the campground object under image property
    console.log(req.body);
    req.body.campground.image = result.secure_url || req.body.campground.image;
    // add author to campground
    req.body.campground.author = {
      id: req.user._id,
      username: req.user.username
    }
    Campground.create(req.body.campground, function(err, campground) {
      if (err) {
        req.flash('error', err.message);
        return res.redirect('back');
      }
      res.redirect('/campgrounds/' + campground.id);
    });
  });*/

  
  // if there is no url provided then we set image to local image provided
  if (req.body.campground.image === '') {
    cloudinary.uploader.upload(req.file.path, function(result) {
      // add cloudinary url for the image to the campground object under image property
      console.log(req.body);
      req.body.campground.image = result.secure_url;
      // add author to campground
      req.body.campground.author = {
        id: req.user._id,
        username: req.user.username
      }
      Campground.create(req.body.campground, function(err, campground) {
        if (err) {
          req.flash('error', err.message);
          return res.redirect('back');
        }
        res.redirect('/campgrounds/' + campground.id);
      });
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
    // campgrounds.push(newCampground);
    Campground.create(newCampground, function(err, newlyCreated) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/campgrounds");
      }
    });
  }
});


// NEW - show form to make a new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
  res.render("campgrounds/new");
});

// SHOW - shows info about 1 dog
router.get("/:id", function(req, res) {
  // here we unpack the comments to be actual comments and NOT the id refs
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
    if (err || !foundCampground) {
      req.flash("error", "Campground not found");
      res.redirect("back");
    } else {
      // console.log(foundCampground);
      res.render("campgrounds/show", { foundCampground });
    }
  });
});


// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findById(req.params.id, function(err, foundCampground) {
    res.render("campgrounds/edit", { foundCampground });
  });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

function escapeRegex(query) {
  return query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}


module.exports = router;