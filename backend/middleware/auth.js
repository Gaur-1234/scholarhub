const jwt = require("jsonwebtoken");

const User = require("../../database/user");

const auth = async (req, res, next) => {
  try {
    // TOKEN
const authHeader = req.headers.authorization;

if (!authHeader) {

  return res.status(401).json({
    message: "No Token",
  });

}

let token;

if (authHeader.startsWith("Bearer ")) {

  token = authHeader.split(" ")[1];

} else {

  token = authHeader;

}
    // NO TOKEN
    if (!token) {
      return res.status(401).json({
        message: "No Token",
      });
    }

    // VERIFY
    const verified = jwt.verify(
      token,

      process.env.JWT_SECRET,
    );

    // FIND USER
    const user = await User.findById(verified.id);

    // USER CHECK
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // TOKEN VERSION CHECK
    if (verified.tokenVersion !== user.tokenVersion) {
      return res.status(401).json({
        message: "Logged out from all devices",
      });
    }

    // SAVE USER
    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid Token",
    });
  }
};

module.exports = auth;
