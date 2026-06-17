const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const {
OAuth2Client
} = require(
"google-auth-library"
);

const axios = require("axios");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const analyzeResume =
require(
"../services/geminiResumeAnalyzer"
);


const sendOtp = require("../utils/sendOtp");
const sendNotificationEmail =
require("../utils/sendNotificationEmail");

const User = require("../../database/user");

const client =
new OAuth2Client(
process.env.GOOGLE_CLIENT_ID
);



// =========================
// SIGNUP
// =========================

const signup = async (req, res) => {
  try {
    const { username, email, password, captcha } = req.body;
    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!strongPassword.test(password)) {
      return res.status(400).json({
        message:
          "Password must contain uppercase, lowercase, number, special character and 8+ characters",
      });
    }

    // CAPTCHA VERIFY
    const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${captcha}`;

    const captchaResponse = await axios.post(verifyURL);

    if (!captchaResponse.data.success) {
      return res.status(400).json({
        message: "Captcha Failed",
      });
    }

    // EXISTING USER
    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // OTP EXPIRY
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    // CREATE USER
    const newUser = new User({
      username,

      email,

      password: hashedPassword,

      otp,

      otpExpiry,
    });

    await newUser.save();

    // SEND OTP
    await sendOtp(email, otp);

    res.status(201).json({
      message: "OTP Sent To Email",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// =========================
// VERIFY SIGNUP OTP
// =========================

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // OTP EXPIRY
    if (!user.otpExpiry || Date.now() > user.otpExpiry.getTime()) {
      return res.status(400).json({
        message: "OTP Expired",
      });
    }

    // VERIFY USER
    user.isVerified = true;

    user.otp = null;

    user.otpExpiry = null;

    await user.save();

    res.status(200).json({
      message: "OTP Verified",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// =========================
// RESEND SIGNUP OTP
// =========================

const resendSignupOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "User already verified",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = otp;

    user.otpExpiry = otpExpiry;

    await user.save();

    await sendOtp(email, otp);

    res.status(200).json({
      message: "New OTP Sent",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// =========================
// PASSWORD LOGIN
// =========================

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        message: "Please verify OTP first",
      });
    }

    const isMatch = await bcrypt.compare(
  password,
  user.password,
);

if (!isMatch) {
  return res.status(400).json({
    message: "Invalid Password",
  });
}

// LOGIN HISTORY SAVE

let browserName =
  "Unknown Browser";

const userAgent =
  req.headers["user-agent"];

if (
  userAgent.includes(
    "Chrome"
  )
) {

  browserName =
    "Chrome Browser";

}

else if (
  userAgent.includes(
    "Edg"
  )
) {

  browserName =
    "Edge Browser";

}

else if (
  userAgent.includes(
    "Firefox"
  )
) {

  browserName =
    "Firefox Browser";

}

user.lastLogin =
  new Date();

user.loginHistory.unshift({

  browser:
    browserName,

  ip:
    req.ip

});

user.activityLogs.unshift({

  action:
    "User Logged In"

});

await user.save();

    // JWT TOKEN
    const token = jwt.sign(
      {
        id: user._id,

        username: user.username,

        email: user.email,

        role: user.role,

        isVerified: user.isVerified,

        tokenVersion: user.tokenVersion,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "1h",
      },
    );

    res.status(200).json({
      message: "Login Successful",

      token,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const googleLogin = async (req,res)=>{

try{

const { credential } =
req.body;

const ticket =
await client.verifyIdToken({

idToken:credential,

audience:
process.env.GOOGLE_CLIENT_ID

});

const payload =
ticket.getPayload();

const email =
payload.email;

let user =
await User.findOne({
email
});

if(!user){

user =
new User({

username:
payload.name,

email,

profileImage:
payload.picture,

isVerified:true,

role:"user"

});

await user.save();

}

const token =
jwt.sign(

{
id:user._id,
username:user.username,
email:user.email,
role:user.role,
isVerified:user.isVerified,
tokenVersion:
user.tokenVersion
},

process.env.JWT_SECRET,

{
expiresIn:"1h"
}

);

res.status(200).json({

message:
"Google Login Successful",

token

});

}

catch(error){

console.log(error);

res.status(500).json({

message:
"Google Login Failed"

});

}

};
// =========================
// SEND LOGIN OTP
// =========================

const sendLoginOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        message: "Please verify account first",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = otp;

    user.otpExpiry = otpExpiry;

    await user.save();

    await sendOtp(email, otp);

    res.status(200).json({
      message: "Login OTP Sent",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// =========================
// VERIFY LOGIN OTP
// =========================

const verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // OTP EXPIRY
    if (!user.otpExpiry || Date.now() > user.otpExpiry.getTime()) {
      return res.status(400).json({
        message: "OTP Expired",
      });
    }

    user.otp = null;

    user.otpExpiry = null;

    await user.save();

    // JWT TOKEN
    const token = jwt.sign(
      {
        id: user._id,

        username: user.username,

        email: user.email,

        role: user.role,

        isVerified: user.isVerified,

        tokenVersion: user.tokenVersion,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "1h",
      },
    );

    res.status(200).json({
      message: "OTP Login Successful",

      token,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// =========================
// FORGOT PASSWORD
// =========================

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = otp;

    user.otpExpiry = otpExpiry;

    await user.save();

    await sendOtp(email, otp);

    res.status(200).json({
      message: "OTP Sent",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// =========================
// RESET PASSWORD
// =========================

const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // OTP EXPIRY
    if (!user.otpExpiry || Date.now() > user.otpExpiry.getTime()) {
      return res.status(400).json({
        message: "OTP Expired",
      });
    }
    if (!strongPassword.test(password)) {
      return res.status(400).json({
        message:
          "Password must contain uppercase, lowercase, number, special character and 8+ characters",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.passwordChangeCount += 1;

    user.otp = null;

    user.otpExpiry = null;

    await user.save();

    res.status(200).json({
      message: "Password Reset Successful",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// =========================
// PROFILE
// =========================

const profile = async (req, res) => {

  try {

    const user = await User.findById(
      req.user.id
    ).select(
      "-password -otp -otpExpiry"
    );

    if (!user) {

      return res.status(404).json({
        message: "User not found"
      });

    }

    res.status(200).json({
      user
    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });

  }

};

// =========================
// CHANGE PASSWORD
// =========================

const changePassword = async (req, res) => {

  try {

    const {
      currentPassword,
      newPassword
    } = req.body;

    const user =
      await User.findById(
        req.user.id
      );

    const isMatch =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!isMatch) {

      return res.status(400).json({
        message:
        "Current Password Wrong"
      });

    }

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );

    user.password =
      hashedPassword;

    user.passwordChangeCount += 1;

    user.activityLogs.unshift({

      action:
      "Password Changed"

    });

    await user.save();

    res.status(200).json({

      message:
      "Password Updated"

    });

  }

  catch(error) {

    console.log(error);

    res.status(500).json({

      message:
      "Server Error"

    });

  }

};

// =========================
// UPDATE PROFILE
// =========================

const updateProfile = async (req, res) => {

  try {

    const {
      username,
      email,
      profileImage
    } = req.body;

    const user =
      await User.findById(
        req.user.id
      );

    if (!user) {

      return res.status(404).json({
        message: "User not found"
      });

    }

if (username !== undefined) {

  user.username = username;

}

if (email !== undefined) {

  // Optional duplicate email check

  const existingUser =
  await User.findOne({
    email
  });

  if (
    existingUser &&
    existingUser._id.toString() !==
    user._id.toString()
  ) {

    return res.status(400).json({
      message:
      "Email already exists"
    });

  }

  user.email = email;

}

if (profileImage !== undefined) {

  user.profileImage =
  profileImage;

}

    user.activityLogs.unshift({

      action:
      "Profile Updated"

    });

    await user.save();

    res.status(200).json({

      message:
      "Profile Updated Successfully"

    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({

      message:
      "Server Error"

    });

  }

};

// =========================
// UPDATE RESUME
// =========================

const updateResume = async (req, res) => {

try {


console.log("===== RESUME ROUTE HIT =====");

console.log(
  "USER:",
  req.user?.email
);

console.log(
  "FILE:",
  req.file
);

const user =
  await User.findById(
    req.user.id
  );

if (!user) {

  return res.status(404).json({
    message: "User not found"
  });

}

if (!req.file) {

  return res.status(400).json({
    message: "No Resume Uploaded"
  });

}

const pdfBuffer =
  fs.readFileSync(
    req.file.path
  );

console.log(
  "PDF PATH:",
  req.file.path
);

const pdfData =
  await pdfParse(
    pdfBuffer
  );

console.log(
  "PDF PARSED SUCCESSFULLY"
);

const text =
  pdfData.text.toLowerCase();

const aiAnalysis =
  await analyzeResume(
    text
  );

console.log(
  "GEMINI RESPONSE:"
);

console.log(
  aiAnalysis
);

// SAVE ANALYSIS

user.resumeUrl =
  req.file.filename;

user.resumeScore =
  aiAnalysis.atsScore || 0;

user.resumeMissingSkills =
  aiAnalysis.missingSkills || [];

user.resumeStrengths =
  aiAnalysis.strengths || [];

user.resumeWeaknesses =
  aiAnalysis.weaknesses || [];

user.resumeSuggestions =
  aiAnalysis.suggestions || [];

user.resumeSummary =
  aiAnalysis.summary || "";

user.resumeVerdict =
  aiAnalysis.verdict || "";

user.resumeLastAnalyzed =
  new Date();

user.activityLogs.unshift({

  action:
  "AI Resume Analysis Completed"

});

await user.save();

return res.status(200).json({

  message:
  "Resume Analyzed Successfully",

  resumeScore:
  user.resumeScore,

  resumeName:
  req.file.originalname,

  resumeUrl:
  user.resumeUrl,

  missingSkills:
  user.resumeMissingSkills,

  strengths:
  user.resumeStrengths,

  weaknesses:
  user.resumeWeaknesses,

  suggestions:
  user.resumeSuggestions,

  summary:
  user.resumeSummary,

  verdict:
  user.resumeVerdict

});


}

catch (error) {


console.error(
  "RESUME ERROR:",
  error
);

res.status(500).json({

  message:
  error.message,

  stack:
  error.stack

});


}

};

// =========================
// LOGOUT ALL DEVICES
// =========================

const logoutAllDevices = async (req, res) => {
  try {

    const user = await User.findById(
      req.user.id
    );

    if (!user) {

      return res.status(404).json({
        message: "User not found",
      });

    }

    user.tokenVersion += 1;

    await user.save();

    res.status(200).json({
      message: "Logged out from all devices",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

// =========================
// GET ALL USERS
// =========================

const getAllUsers = async (req, res) => {

  try {

    const page =
      Number(req.query.page) || 1;

    const limit = 10;

    const search =
      req.query.search || "";

    const query = {

      $or: [

        {
          username: {
            $regex: search,
            $options: "i"
          }
        },

        {
          email: {
            $regex: search,
            $options: "i"
          }
        }

      ]

    };

    const totalUsers =
      await User.countDocuments(query);

   const users =
  await User.find(query)

  .select(
    "username email role isVerified"
  )

  .lean()

  .skip(
    (page - 1) * limit
  )

  .limit(limit);

    res.status(200).json({

      users,

      totalPages:
      Math.ceil(
        totalUsers / limit
      ),

      currentPage:
      page,

      totalUsers

    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({

      message:
      "Server Error"

    });

  }

};


// =========================
// USER STATS
// =========================

const getUserStats = async (req, res) => {

  try {

    const totalUsers =

      await User.countDocuments();


    const verifiedUsers =

      await User.countDocuments({

        isVerified: true

      });


    const adminUsers =

      await User.countDocuments({

        role: "admin"

      });


    res.status(200).json({

      totalUsers,

      verifiedUsers,

      adminUsers

    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({

      message: "Server Error"

    });

  }

};
const deleteUser = async (req, res) => {

  try {

    const { id } = req.params;

    if (req.user.id === id) {

      return res.status(400).json({

        message: "You cannot delete your own account"

      });

    }

    const user = await User.findById(id);

    if (!user) {

      return res.status(404).json({

        message: "User not found"

      });

    }

    if (user.role === "admin") {

      const adminCount = await User.countDocuments({

        role: "admin"

      });

      if (adminCount === 1) {

        return res.status(400).json({

          message: "Cannot delete the last admin"

        });

      }

    }

    await User.findByIdAndDelete(id);

    res.status(200).json({

      message: "User deleted successfully"

    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({

      message: "Server Error"

    });

  }

};

const makeAdmin = async (req, res) => {

  try {

    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {

      return res.status(404).json({

        message: "User not found"

      });

    }

    user.role = "admin";

    await user.save();

    res.status(200).json({

      message: "User promoted to admin"

    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({

      message: "Server Error"

    });

  }

};
const removeAdmin = async (req, res) => {

try {


const { id } = req.params;

if (req.user.id === id) {

  return res.status(400).json({

    message: "You cannot remove your own admin role"

  });

}

const user = await User.findById(id);

if (!user) {

  return res.status(404).json({

    message: "User not found"

  });

}

const adminCount = await User.countDocuments({

  role: "admin"

});

if (

  user.role === "admin" &&

  adminCount === 1

) {

  return res.status(400).json({

    message: "Cannot remove the last admin"

  });

}

user.role = "user";

await user.save();

res.status(200).json({

  message: "Admin role removed"

});


}

catch (error) {


console.log(error);

res.status(500).json({

  message: "Server Error"

});


}

};



const addUser = async (req, res) => {

  try {

    const {
      username,
      email,
      password,
      role
    } = req.body;

    if (
      !username ||
      !email ||
      !password
    ) {

      return res.status(400).json({

        message: "All fields are required"

      });

    }

    const existingUser =
    await User.findOne({

      email

    });

    if (existingUser) {

      return res.status(400).json({

        message: "Email already exists"

      });

    }

    const hashedPassword =
    await bcrypt.hash(
      password,
      10
    );

    const user =
    new User({

      username,

      email,

      password:
      hashedPassword,

      role,

      isVerified: true

    });

    await user.save();

    res.status(201).json({

      message:
      "User added successfully"

    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({

      message:
      "Server Error"

    });

  }

};

const bulkDeleteUsers =
async (req, res) => {

  try {

    const {
      userIds
    } = req.body;

    await User.deleteMany({

      _id: {

        $in:
        userIds

      }

    });

    res.status(200).json({

      message:
      "Users deleted successfully"

    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({

      message:
      "Server Error"

    });

  }

};

// =========================
// DELETE ACCOUNT
// =========================

const deleteAccount = async (req, res) => {

  try {

    await User.findByIdAndDelete(
      req.user.id
    );

    res.status(200).json({

      message:
      "Account Deleted Successfully"

    });

  }

  catch(error) {

    console.log(error);

    res.status(500).json({

      message:
      "Server Error"

    });

  }

};
const sendNotification = async (req, res) => {

  try {

    const {
      userId,
      message,
      broadcast
    } = req.body;

    // SEND TO ALL USERS

    if (broadcast) {

      const users =
      await User.find({});

      await User.updateMany(
        {},
        {
          $push: {
            notifications: {
              message,
              read: false,
              date: new Date()
            }
          }
        }
      );

      // SEND EMAIL TO ALL USERS

      for (const user of users) {

        try {

          await sendNotificationEmail(
            user.email,
            user.username,
            message
          );

        }

        catch (error) {

          console.log(
            `Email failed for ${user.email}`
          );

        }

      }

      return res.status(200).json({

        message:
        "Notification and Email sent to all users"

      });

    }

    // SINGLE USER

    const user =
    await User.findById(userId);

    if (!user) {

      return res.status(404).json({

        message:
        "User not found"

      });

    }

    user.notifications.unshift({

      message,
      read: false,
      date: new Date()

    });

    await user.save();

    // SEND EMAIL

    await sendNotificationEmail(
      user.email,
      user.username,
      message
    );

    res.status(200).json({

      message:
      "Notification and Email sent"

    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({

      message:
      "Server Error"

    });

  }

};
const markNotificationRead =
async (req,res)=>{

try{

const notificationId =
req.params.id;

const user =
await User.findById(
req.user._id
);

const notification =
user.notifications.find(
n =>
n._id.toString() ===
notificationId
);

if(notification){

notification.read = true;

await user.save();

}

res.json({
message:
"Notification marked as read"
});

}

catch(error){

res.status(500).json({
message:error.message
});

}

};

const removeProfilePhoto =
async(req,res)=>{

try{

const user =
await User.findById(
req.user.id
);

user.profileImage = "";

await user.save();

res.json({

message:
"Profile photo removed"

});

}

catch(error){

res.status(500).json({

message:
"Server Error"

});

}

};

module.exports = {

  signup,
  verifyOtp,
  resendSignupOtp,
  login,
  googleLogin,
  sendLoginOtp,
  verifyLoginOtp,
  forgotPassword,
  resetPassword,
  profile,
  removeProfilePhoto,
  changePassword,
  updateProfile,
  updateResume,
  logoutAllDevices,
  getAllUsers,
  getUserStats,
  deleteAccount,

  deleteUser,
  makeAdmin,
  sendNotification,
  markNotificationRead,

  removeAdmin,
  bulkDeleteUsers,
  addUser

};