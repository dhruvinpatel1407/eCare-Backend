// src/models/serviceModel.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ["General", "Specialist", "Diagnostic", "Therapeutic"]
  }
});

const ServiceCollection = mongoose.model("ServiceCollection", serviceSchema);
module.exports = ServiceCollection;