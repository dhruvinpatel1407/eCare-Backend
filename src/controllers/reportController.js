// src/controllers/pdfController.js
const PDFCollection = require("../models/ReportModel");
const fs = require("fs"); // Add this at the top

const uploadPdf = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.user.userId;

    // Read the uploaded file from the temporary location
    const filePath = file.path;
    const fileBuffer = fs.readFileSync(filePath);
    
    const pdfDoc = new PDFCollection({
      filename: file.originalname,
      contentType: file.mimetype,
      data: fileBuffer, // Set the file buffer as the data
      userId: userId 
    });
    
    await pdfDoc.save();
    res.status(200).json({ 
      message: "PDF uploaded successfully",
      filename: file.originalname 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPdf = async (req, res) => {
  try {
    const userId = req.user.userId; 
    const pdfs = await PDFCollection.find({ userId })
    .select("filename contentType createdAt")
    .exec();
    
//   if (pdfs.length === 0) {
//     return res.status(404).json({ message: "No PDFs found for this user" });
//   }
  
  res.status(200).json(pdfs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add this new controller method for downloading PDF
const downloadPdf = async (req, res) => {
  try {
    const filename = req.params.filename;
    
    const pdfFile = await PDFCollection.findOne({
      filename: filename,
      userId: req.user.userId
    });

    if (!pdfFile) {
      return res.status(404).json({ message: "PDF file not found" });
    }

    // Set headers for file download
    res.setHeader('Content-Type', pdfFile.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Send the file buffer as response
    res.send(pdfFile.data);

  } catch (error) {
    console.error('Error in downloading PDF:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadPdf,
  getPdf, 
  downloadPdf,
};