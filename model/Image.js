const mongoose = require("mongoose");
const timestamp = require("mongoose-timestamp");

const ImageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users"
  },
  avartar: {
    type: String,
    required: false
  }
});

ImageSchema.plugin(timestamp);
module.exports = Image = mongoose.model("Image", ImageSchema);
