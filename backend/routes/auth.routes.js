const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const rateLimit = require("express-rate-limit");
const admin = require("../middleware/admin");
const upload =require("../config/multerConfig");

// =========================
// OTP LIMITER
// =========================

const otpLimiter = rateLimit({
  windowMs: 60 * 1000,

  max: 3,

  message: "Too many OTP requests. Try again later.",
});

// =========================
// LOGIN LIMITER
// =========================

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 5,

  message: "Too many login attempts. Try again later.",
});

// =========================
// CONTROLLERS
// =========================

const {

  signup,
  verifyOtp,
  forgotPassword,
  resetPassword,
  login,
  googleLogin,
  profile,
  
removeProfilePhoto,
  changePassword,
  updateResume,
  updateProfile,
  sendLoginOtp,
  verifyLoginOtp,
  resendSignupOtp,
  logoutAllDevices,

  getAllUsers,
  getUserStats,
  getAnalytics,
  deleteAccount,
  sendNotification,
  markNotificationRead,

  deleteUser,
  makeAdmin,
  removeAdmin,
  bulkDeleteUsers,
addUser,
searchJobs,

saveJob,
getSavedJobs,

applyJob,
getAppliedJobs

} = require("../controllers/authController");
// =========================
// ROUTES
// =========================

// SIGNUP
router.post(
  "/signup",

  otpLimiter,

  signup,
);

// VERIFY SIGNUP OTP
router.post(
  "/verify-otp",

  loginLimiter,

  verifyOtp,
);

// RESEND SIGNUP OTP
router.post(
  "/resend-signup-otp",

  otpLimiter,

  resendSignupOtp,
);

// FORGOT PASSWORD
router.post(
  "/forgot-password",

  otpLimiter,

  forgotPassword,
);

// RESET PASSWORD
router.post(
  "/reset-password",

  resetPassword,
);

// PASSWORD LOGIN
router.post(
  "/login",

  loginLimiter,

  login,
);

router.post(
  "/google-login",
  googleLogin
);

// SEND LOGIN OTP
router.post(
  "/send-login-otp",

  otpLimiter,

  sendLoginOtp,
);

// VERIFY LOGIN OTP
router.post(
  "/verify-login-otp",

  loginLimiter,

  verifyLoginOtp,
);
// send notification
router.post(

"/admin/send-notification",

auth,

admin,

sendNotification

);

router.put(
"/notification/:id/read",
auth,
markNotificationRead
);

// PROFILE
router.get(
"/profile",
auth,
profile
);

router.get(
"/jobs",
auth,
searchJobs
);

router.post(
"/save-job",
auth,
saveJob
);

router.get(
"/saved-jobs",
auth,
getSavedJobs
);

router.post(
"/apply-job",
auth,
applyJob
);

router.get(
"/applied-jobs",
auth,
getAppliedJobs
);


router.put(
"/profile",
auth,
updateProfile
);

router.put(
  "/change-password",
  auth,
  changePassword
);

router.put(
"/remove-profile-photo",
auth,
removeProfilePhoto
);

router.post(
  "/resume",
  auth,
  upload.single("resume"),
  updateResume
);

// LOGOUT ALL DEVICES
router.post(
  "/logout-all",

  auth,

  logoutAllDevices,
);

router.get(
  "/admin/users",
  auth,
  admin,
  getAllUsers
);

router.get(
  "/admin/stats",
  auth,
  admin,
  getUserStats
);

router.get(

"/admin/analytics",

auth,

admin,

getAnalytics

);

router.delete(
  "/admin/user/:id",
  auth,
  admin,
  deleteUser
);

router.put(
  "/admin/make-admin/:id",
  auth,
  admin,
  makeAdmin
);
router.put(

  "/admin/remove-admin/:id",

  auth,

  admin,

  removeAdmin

);

router.post(

  "/admin/add-user",

  auth,

  admin,

  addUser

);

router.delete(

  "/admin/bulk-delete",

  auth,

  admin,

  bulkDeleteUsers

);

router.delete(
  "/delete-account",
  auth,
  deleteAccount
);
module.exports = router;