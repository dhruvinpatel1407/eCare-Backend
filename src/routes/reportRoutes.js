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
 *     tags: [PDF Controller]
 *     summary: Upload a PDF file
 *     description: Uploads a PDF file to the server.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               pdf:
 *                 type: string
 *                 format: binary
 *                 description: PDF file to upload
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
 *                 filename:
 *                   type: string
 *       500:
 *         description: Error uploading PDF
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

router.post("/", upload.single('pdf'), uploadPdf);

/**
 * @swagger
 * /api/pdf:
 *   get:
 *     tags: [PDF Controller]
 *     summary: Get list or metadata of PDFs
 *     description: Retrieves information about available or uploaded PDF files.
 *     responses:
 *       200:
 *         description: PDF metadata retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   filename:
 *                     type: string
 *       500:
 *         description: Error retrieving PDF data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/", getPdf);

/**
 * @swagger
 * /api/pdf/{filename}:
 *   get:
 *     tags: [PDF Controller]
 *     summary: Download a PDF file
 *     description: Downloads a PDF file by filename
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
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
 *       500:
 *         description: Error downloading PDF
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/:filename", downloadPdf);

module.exports = router;