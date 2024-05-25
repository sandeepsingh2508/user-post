const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Define the GeoLocation schema
const GeoLocationSchema = new Schema({
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
});

// Define the main schema
const myPostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User-Auth",
    },
    isActive: {
      type: Boolean,
      default:true
    },
    geoLocation: {
      type: GeoLocationSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const userModel = mongoose.model("User-Post", myPostSchema);

module.exports = userModel;
