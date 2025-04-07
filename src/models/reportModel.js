// src/models/pdfModel.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const pdfSchema = new Schema({
  filename: {
    type: String,
    required: true
  },
  contentType: {
    type: String,
    required: true
  },
  data: {
    type: Buffer,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserCollection",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const PDFCollection = mongoose.model("PDFCollection", pdfSchema);

module.exports = PDFCollection;