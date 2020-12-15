const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { promisify } = require("util");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};

exports.signUp = async (req, res, next) => {
  let newUser;
  try {
    newUser = await User.create(req.body);
  } catch (err) {
    return res.status(500).json({ status: "fail", message: err.message });
  }

  const token = signToken(newUser._id);

  return res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    //1) check if email and password exist
    if (!email || !password) {
      return res
        .status(400)
        .json({ status: "fail", message: "please provide email and password" });
    }

    // 2) check if the user exists and password is correct
    const user = await User.findOne({ email: email }).select("+password");
    let passwordCorrect = false;
    if (user) {
      passwordCorrect = await user.correctPassword(password, user.password);
    }

    if (!user || !passwordCorrect) {
      return res
        .status(401)
        .json({ status: "fail", message: "incorrect email or password" });
    }

    // 3) if everythink ok, send token to client
    const token = signToken(user._id);
    return res.status(200).json({
      status: "success",
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    return res.status(401).json({ status: "fail", message: err.message });
  }
};

//middleware for protected routes
exports.protect = async (req, res, next) => {
  // 1) get the token and check if it's there

  let token;
  // every token starts with "Bearer" string
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "no token" });
  }

  let decoded;
  try {
    // 2) verification of token
    decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  } catch (err) {
    return res
      .status(401)
      .json({ message: "token is not valid. Please login again" });
  }

  // 3)check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return res
      .status(401)
      .json({ message: "the user belonging to this token does not exist" });
  }

  //grant access to the protected route
  req.user = currentUser;
  next();
};

exports.verifyToken = async (req, res, next) => {
  // 1) get the token
  let token = req.params.token;

  let decoded;
  try {
    // 2) verification of token
    decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({
      status: "fail",
      message: "token is not valid. Please login again",
    });
  }

  // 3)check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return res.status(401).json({
      status: "fail",
      message: "the user belonging to this token does not exist",
    });
  }

  res.status(200).json({
    user: currentUser,
  });
};
