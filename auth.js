const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

require("./db/conn");
const User = require("./model/userSchema");

router.post("/SignUp", async (req, res) => {
  const { fname, lname, email, phone, password, cpassword } = req.body;
  if (!fname || !lname || !email || !phone || !password || !cpassword) {
    return res.status(422).json({ error: "All fields are mandatory" });
  }
  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(409).json({ error: "Email already exists" });
    } else if (password != cpassword) {
      return res.status(401).json({ error: "password doesn't match" });
    } else {
      const user = new User({
        fname,
        lname,
        email,
        phone,
        password,
        cpassword,
      });

      await user.save();
      res.status(201).json({ message: "user registered successfully" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/SignIn", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "all fields are mandatory" });
    }

    const userExist = await User.findOne({ email: email });
    if (userExist) {
      const isMatch = await bcrypt.compare(password, userExist.password);
      if (!isMatch) {
        res.status(400).json({ message: "Invalid Credentials" });
      } else {
        res.status(201).json({ message: "login successful" });
      }
    } else {
      res.status(400).json({ message: "Invalid Credentials" });
    }
  } catch (err) {
    console.log(err);
  }
});

// User.find({},function(err, users){
//   if(err) console.log(err);
//   console.log(users);
// })
router.get("/users", function (req, res) {
  User.find().then((data) => {
    res.status(201).json(data);
  });
});

module.exports = router;
