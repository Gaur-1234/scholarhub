const User = require("../../database/user");

const admin = async (req, res, next) => {

  try {

    const user = await User.findById(
      req.user.id
    );

    if (!user) {

      return res.status(404).json({
        message: "User not found"
      });

    }

    if (user.role !== "admin") {

      return res.status(403).json({
        message: "Access Denied"
      });

    }

    next();

  }

  catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });

  }

};

module.exports = admin;