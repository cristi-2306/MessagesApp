const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const { v4: uuidv4 } = require('uuid');

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});


const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;
  console.log("Attempting to register user:", { name, email }); // Log the attempt

  if (!name || !email || !password) {
    console.log("Missing fields:", { name, email, password }); // Log missing fields
    res.status(400);
    throw new Error("Please Enter all the Fields");
  }

  try {
    const userExists = await User.findOne({ email });
    console.log("User exists check:", !!userExists); // Log whether the user exists

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    // Generate a unique userVideoCallId for the new user
    const userVideoCallId = uuidv4();

    // Include the generated userVideoCallId in the user creation
    const user = await User.create({
      name,
      email,
      password,
      pic,
      userVideoCallId, // Add this line
    });
    console.log("User created:", !!user); // Log whether the user was created

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        userVideoCallId: user.userVideoCallId, // Include this in the response if needed
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("User not found");
    }
  } catch (err) {
    console.error("Error during user registration:", err); // Log any errors
    res.status(500).send("Server error during registration");
  }
});


const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

module.exports = { allUsers, registerUser, authUser };