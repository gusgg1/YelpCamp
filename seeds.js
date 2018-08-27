const mongoose   = require("mongoose");
const Campground = require("./models/campground");
const Comment    = require("./models/comment");

const data = [
  {
    name: "Cloud's Rest",
    image: "https://images.unsplash.com/photo-1517824806704-9040b037703b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=d95171e276fbd03de651f9aecb64b53d&auto=format&fit=crop&w=500&q=60",
    description: `Lorem ipsum dolor sit amet, nostro recusabo incorrupte an sed. In nam autem incorrupte. Cum ut liber alterum conceptam, ad duo decore epicuri, alia nihil equidem et vis. Solum aeterno insolens vis te, quo oblique prompta oporteat id. Te cum ignota eirmod vivendum. Viderer evertitur eu has, et eam liber scripta, mei ne unum mutat.

    Ad explicari mnesarchum delicatissimi his. Usu esse quas zril te, posse vocibus gubergren an mel, quod hinc mea ei. Mel nihil prodesset an, ullum ignota debitis duo ex. Maiorum detracto delicatissimi in per, nec vero tritani ex. Doctus abhorreant reformidans sit cu, velit habemus euripidis mei te.
    `
  },
  {
    name: "Lion's Gate",
    image: "https://images.unsplash.com/photo-1508768516474-73606cb84ce2?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=e074f33c229b735080438a384e50ada1&auto=format&fit=crop&w=500&q=60",
    description: `Lorem ipsum dolor sit amet, nostro recusabo incorrupte an sed. In nam autem incorrupte. Cum ut liber alterum conceptam, ad duo decore epicuri, alia nihil equidem et vis. Solum aeterno insolens vis te, quo oblique prompta oporteat id. Te cum ignota eirmod vivendum. Viderer evertitur eu has, et eam liber scripta, mei ne unum mutat.

    Ad explicari mnesarchum delicatissimi his. Usu esse quas zril te, posse vocibus gubergren an mel, quod hinc mea ei. Mel nihil prodesset an, ullum ignota debitis duo ex. Maiorum detracto delicatissimi in per, nec vero tritani ex. Doctus abhorreant reformidans sit cu, velit habemus euripidis mei te.
    `
  },
  {
    name: "Granite Hill",
    image: "https://images.unsplash.com/photo-1525811902-f2342640856e?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=1a7383ad093ffea99d373681b9974056&auto=format&fit=crop&w=500&q=60",
    description: `Lorem ipsum dolor sit amet, nostro recusabo incorrupte an sed. In nam autem incorrupte. Cum ut liber alterum conceptam, ad duo decore epicuri, alia nihil equidem et vis. Solum aeterno insolens vis te, quo oblique prompta oporteat id. Te cum ignota eirmod vivendum. Viderer evertitur eu has, et eam liber scripta, mei ne unum mutat.

    Ad explicari mnesarchum delicatissimi his. Usu esse quas zril te, posse vocibus gubergren an mel, quod hinc mea ei. Mel nihil prodesset an, ullum ignota debitis duo ex. Maiorum detracto delicatissimi in per, nec vero tritani ex. Doctus abhorreant reformidans sit cu, velit habemus euripidis mei te.
    `
  },
  {
    name: "Mountain View",
    image: "https://images.unsplash.com/photo-1471115853179-bb1d604434e0?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=d1c8cc988efddbda8746281871c0c8bf&auto=format&fit=crop&w=500&q=60",
    description: `Lorem ipsum dolor sit amet, nostro recusabo incorrupte an sed. In nam autem incorrupte. Cum ut liber alterum conceptam, ad duo decore epicuri, alia nihil equidem et vis. Solum aeterno insolens vis te, quo oblique prompta oporteat id. Te cum ignota eirmod vivendum. Viderer evertitur eu has, et eam liber scripta, mei ne unum mutat.

    Ad explicari mnesarchum delicatissimi his. Usu esse quas zril te, posse vocibus gubergren an mel, quod hinc mea ei. Mel nihil prodesset an, ullum ignota debitis duo ex. Maiorum detracto delicatissimi in per, nec vero tritani ex. Doctus abhorreant reformidans sit cu, velit habemus euripidis mei te.
    `
  }
];

async function seedDB() {
  try {
    await Campground.remove({});
    console.log("Campgrounds removed"); 
    await Comment.remove({});
    console.log("Comments removed");
    
    for (const seed of seeds) {
      let campground = await Campground.create(seed);
      console.log("Campground created"); 
      let comment = await Comment.create({
        text: "This place is great, but I wish there was internet.",
        author: "Homer"
      });
      console.log("Comment created"); 
      campground.comments.push(comment);
      campground.save();
      console.log("Comment added to campground"); 
    }
  } catch(err) {
    console.log(err);
  }
}

module.exports = seedDB;
