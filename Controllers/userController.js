const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const JWT_SECRET =
  "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";

const User = require("../Models/userDetails");

const userController = {};

userController.register = async (req, res) => {
    const { fname, lname, email, password, userType } = req.body;
  
    const encryptedPassword = await bcrypt.hash(password, 10);
    try {
      const oldUser = await User.findOne({ email });
  
      if (oldUser) {
        return res.json({ error: "User Exists" });
      }
      await User.create({
        fname,
        lname,
        email,
        password: encryptedPassword,
        userType,
      });
      res.send({ status: "ok" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: "error" });
    }
    console.log("Inside register function");
  };
  

userController.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ error: "User Not found" });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: "10s",
    });

    if (res.status(201)) {
      return res.json({ status: "ok", data: token });
    } else {
      return res.json({ error: "error" });
    }
  }
  res.json({ status: "error", error: "InvAlid Password" });
};

userController.getUserData = async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET, (err, res) => {
      if (err) {
        return "token expired";
      }
      return res;
    });
    console.log(user);
    if (user == "token expired") {
      return res.send({ status: "error", data: "token expired" });
    }

    const useremail = user.email;
    User.findOne({ email: useremail })
      .then((data) => {
        res.send({ status: "ok", data: data });
      })
      .catch((error) => {
        res.send({ status: "error", data: error });
      });
  } catch (error) {}
};

userController.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }
    const secret = JWT_SECRET + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "5m",
    });
    const link = `http://localhost:5001/reset-password/${oldUser._id}/${token}`;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "adarsh438tcsckandivali@gmail.com",
        pass: "rmdklolcsmswvyfw",
      },
    });

    var mailOptions = {
      from: "youremail@gmail.com",
      to: "thedebugarena@gmail.com",
      subject: "Link To Reset Password",
  html: `<h2>Please click on the given link to reset your password</h2><p>${link}</p>`,
};

transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log(error);
    res.json({ status: "error", error: error });
  } else {
    res.json({ status: "ok", data: "Password reset link sent to email" });
  }
});
} catch (error) {
    res.send({ status: "error", error: error });
    }
    };
    
    userController.resetPassword = async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;
    try {
    const decoded = jwt.verify(token, JWT_SECRET + password);
    const user = await User.findOne({ _id: id });
    if (!user) {
        return res.json({ status: "error", error: "User Not Found" });
      }
      
      user.password = await bcrypt.hash(password, 10);
      await user.save();
      
      res.json({ status: "ok", data: "Password Updated" });
    }catch (error) {
        res.json({ status: "error", error: error });
        }
        };
        
        module.exports = userController;