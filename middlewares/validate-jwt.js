const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const validateJWT = async (req = request, res = response, next) => {
  // Read token
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "No token in the request",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    const user = await User.findById(uid);

    if (!user) {
      return res.status(401).json({
        msg: "Token not valid - user not exist in DB",
      });
    }

    if (!user.state) {
      return res.status(401).json({
        msg: "Token not valid",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      msg: "Token not valid",
    });
  }
};

module.exports = {
  validateJWT,
};
