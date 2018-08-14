const express    = require("express");
const router     = express.Router({mergeParams: true});
const Campground = require("../models/campground");
const Comment    = require("../models/comment");
const middleware = require("../middleware");

// Comments New
router.get("/new", middleware.isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { campground });
    }
  });
});


// Comments Create
router.post("/", middleware.isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      res.redirect("/campground");
    } else {
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          // if something goes wrong in the DB
          req.flash("error", "Something went wrong");
          console.log(err);
        } else {
          // add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // save comment
          comment.save();
          // here we associate the comment with the campground
          campground.comments.push(comment);
          campground.save();
          req.flash("success", "Successfully added comment");
          res.redirect(`/campgrounds/${campground._id}`);
        }
      });
    }
  });
});


// EDIT COMMENT ROUTE 
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
  Campground.findById(req.params.id, function(err, foundCampground) {
    if (err || !foundCampground) {
      req.flash("error", "No campground found");
      return res.redirect("back");
    }
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err) {
        res.redirect("back");
      } else {
        console.log(req.params);
        res.render("comments/edit", { campground_id: req.params.id, foundComment });
      }
    });
  });
});

// UPDATE COMMENT
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function(err) {
    if (err) {
      res.redirect("back");
    } else {
      req.flash("success", "Comment deleted");
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  });
});


module.exports = router;