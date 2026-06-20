const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
  username: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

password: {
  type: String,
  required: function () {
    return !this.googleAuth;
  }
},

  googleAuth: {
  type: Boolean,
  default: false
},

  role: {
    type: String,
    default: "user"
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  tokenVersion: {
    type: Number,
    default: 0
  },

  otp: String,

  otpExpiry: Date,

  // PROFILE IMAGE
  profileImage: {
    type: String,
    default: ""
  },
// RESUME

resumeUrl: {
type: String,
default: ""
},

resumeScore: {
type: Number,
default: 0
},

resumeMissingSkills: {
type: [String],
default: []
},

// GEMINI ANALYSIS

resumeStrengths: {
type: [String],
default: []
},

resumeWeaknesses: {
type: [String],
default: []
},

resumeSuggestions: {
type: [String],
default: []
},

resumeVerdict: {
type: String,
default: ""
},

resumeSummary: {
type: String,
default: ""
},

resumeLastAnalyzed: {
type: Date
},

jobMatches: {
  type: Array,
  default: []
},

recommendedJobs:{
type:Array,
default:[]
},

savedJobs:{
type:Array,
default:[]
},

appliedJobs:{
type:Array,
default:[]
},
  // PROFILE DETAILS
  bio: {
    type: String,
    default: ""
  },

  joinDate: {
    type: Date,
    default: Date.now
  },

  lastLogin: {
    type: Date
  },

  // LOGIN HISTORY
  loginHistory: [
    {
      browser: String,
      ip: String,
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],

  // ACTIVITY LOGS
  activityLogs: [
    {
      action: String,

      date: {
        type: Date,
        default: Date.now
      }
    }
  ],

  // NOTIFICATIONS
  notifications: [
    {
      message: String,

      read: {
        type: Boolean,
        default: false
      },

      date: {
        type: Date,
        default: Date.now
      }
    }
  ]
},
{
  timestamps: true
}
);

module.exports =
mongoose.model(
  "User",
  userSchema
);