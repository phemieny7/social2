const router = require("express").Router();
const Post = require("../model/Posts");
const User = require("../model/User");
const Admin = require("../model/Admin");
const Hotspot = require("../model/Hotspot");
const Profile = require("../model/Profile");
const Newsfeed = require("../model/Newsfeed");


const authenticate = require("../middleware/authenticate");
const { check, validationResult } = require("express-validator");



// @route   Post api/user/register
// @desc    Register New User
// @access  Public
router.post("/register", async (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json({ errors: Array.from(errors) });
  }

  try {
    const { name, email, password } = req.body;
    const user = await Admin.findOne({ email: email });

    if (user) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }

    const secretToken = generateRandomString(30);

    const newUser = new User({
      name,
      email,
      password,
      secretToken
    });

    const mg = mailgun({
      apiKey: config.get("mailgun-key"),
      domain: config.get("mailgun")
    });
    const data = {
      from: "no-reply@yourwebapplication.com",
      to: newUser.email,
      subject: "Account Verification Token",
      html: `
                            <h3> Hello  <i>${name}</i></h3>
                            <p> Please verify your Admin account by clicking the button Below</p><br>
                            <a href = "https://${req.headers.host}/api/user/verify/${newUser.secretToken}"><button>confirm your account</button></a>
                            `
    };
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then(user => {
            res.json({
              message: "Account Created, Please verify your email"
            });
          })
          .catch(err => console.error(err));
      });
    });

    mg.messages().send(data, function(error, body) {
      console.log(body);
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});


module.exports = router;