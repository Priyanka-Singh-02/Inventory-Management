const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: { type: String, default: "", required: true },
  email: { type: String, default: "", required: true },
  gender: {
    type: String,
    default: "",
    enum: ["", "Male", "Female", "Other"],
    required: true,
  }, // M,F,O
  country: { type: String, default: "", required: true },
  state: { type: String, default: "", required: true },
  city: { type: String, default: "", required: true },
  password: { type: String, default: null, required: true },
  profilePhoto: { type: String, default: "" },
});

module.exports = model("user", userSchema);
