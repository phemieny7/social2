const router = require("express").Router();
const Post = require("../model/Posts");
const User = require("../model/User");
const Hotspot = require('../model/Hotspot')
const authenticate = require("../middleware/authenticate");
const { check, validationResult } = require("express-validator");


// import image upload services
const upload = require("../services/ImageUpload");


// create new hotspot post
// POST api/hotspot
router.post(
    "/",
    upload.single("image"),
    authenticate,
  
    [
      [
        check("title", "title is required").not()
          .isEmpty(),
        check("body", "body is required").not()        
          .isEmpty(),
          check("image", "image is required").not()
          .isEmpty()
      ]
    ],
    async (req, res) => {
      //   Check for validity
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      try {
        // Get user
        const user = await User.findById(req.user.id).select("-password");
  
        // Create Post
        const newHotspot = new Hotspot({
          user: user,
          title: req.body.title,
          body: req.body.body,
          image: req.file.location
        });
        const createdHotspot = await newHotspot.save();
        // created activity
        const activity = {
          msg: "you a new hotspot",
          post: [createdHotspot.id, createdHotspot.title]
        };
        //add to activity log
        user.activities.unshift(activity);
        // save the changes
        await user.save();
        res.status(201).json(createdPost);
      } catch (error) {
        res.status(500).json({ msg: "server error" });
      }
    }
  );

    // @get hotspot post
    // @GET      api/hotspot
    // @access   Private

    router.get('/', authenticate, async (req, res) => {
      try {
        const hotspot = await Hotspot.find({}).sort({date: -1})
        res.status(200).json(hotspot)
      } catch (error) {
        console.error(error)
      }
    })



  module.exports = router