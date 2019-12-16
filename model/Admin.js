const timestamps = require("mongoose-timestamp");
const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  avatar: {
    type: String,
    default: "http://newoNe.com/image"
  },

  name: {
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
    required: true,
    min: 4,
    max: 255,
    unique: true
  },

  secretToken: {
    type: String
  },

  isVerified: {
    type: Boolean,
    default: false,
    required: true
  },

  passwordResetToken: {
    type: String
  },

  passwordResetExpires: {
    type: Date
  },

});
AdminSchema.plugin(timestamps);
module.exports = Admin = mongoose.model("Admin", AdminSchema);
