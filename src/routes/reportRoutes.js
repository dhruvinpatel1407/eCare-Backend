// src/routes/pdfRoutes.js
const express = require("express");
const router = express.Router();
const { uploadPdf, getPdf, downloadPdf } = require("../controllers/reportController");
const { verifyToken } = require("../config/auth");

const multer = require("multer");
// Set up multer storage
const upload = multer({ dest: "uploads/" });
router.use(verifyToken) 
/**
 * @swagger
 * /api/pdf:
 *   post:
 *     tags : [PDF Controller]
 *     summary: Upload a PDF file
 *     description: Uploads a PDF file to the server
 *     consumes:
 *       - multipart/form-data
 *     responses:
 *       200:
 *         description: PDF uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 filename:
 *                   type: string
 *                   description: Name of the uploaded file
 *       500:
 *         description: Error uploading PDF
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */

router.post("/", upload.single('pdf'), uploadPdf);

/**
 * @swagger
 * /api/pdf/{filename}:
 *   get:
 *     tags : [PDF Controller]
 *     summary: Download a PDF file
 *     description: Downloads a PDF file by filename
 *     parameters:
 *       - in: path
 *         name: filename
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the PDF file to download
 *     responses:
 *       200:
 *         description: PDF downloaded successfully
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: PDF not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Error downloading PDF
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
router.get("/", getPdf);

/**
 * @swagger
 * /api/pdf/{filename}:
 *   get:
 *     tags : [PDF Controller]
 *     summary: Download a PDF file
 *     description: Downloads a PDF file by filename
 *     parameters:
 *       - in: path
 *         name: filename
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the PDF file to download
 *     responses:
 *       200:
 *         description: PDF downloaded successfully
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: PDF not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Error downloading PDF
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
router.get("/:filename", downloadPdf);

module.exports = router;