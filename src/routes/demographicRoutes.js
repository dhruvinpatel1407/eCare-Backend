// Server/src/routes/demographicRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../config/auth");
const controller = require("../controllers/demographicController");
const validators = require("../utils/utils");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
router.use(verifyToken);

// Add this configuration for file upload
// const upload = multer({
//     dest: "./uploads/", // You can specify an upload directory
//     limits: {
//       fileSize: 5 * 1024 * 1024, // 1MB file size limit
//     },
//     fileFilter(req, file, cb) {
//       const allowedTypes = [
//         "image/png",
//         "image/jpg",
//         "image/jpeg",
//         "image/gif",
//       ];
//       cb(null, allowedTypes.includes(file.mimetype));
//     },
//   });

//   // Define the fields you want to accept
// const uploadFields = upload.fields([
//   { 
//     name: "profilePicture", // Name of the field in your form
//     maxCount: 1           // Maximum number of files for this field
//   }
// ]);
 

const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure diskStorage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir); // Save in /uploads folder
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
/**
 * @swagger
 * /api/demographics/:
 *   get:
 *     tags: [Demographic Controller]
 *     summary: Get all demographics
 *     responses:
 *       200:
 *         description: Demographics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Demographic'
 *       500:
 *         description: Server error
 * @route GET /api/demographics/
 * @description Route for retrieving all demographics
 * @returns {Array} 200: List of all demographics
 * @returns {Object} 500: Server error
 */
router.get("/", controller.getDemographics);

/**
 * @swagger
 * /api/demographics/:
 *   post:
 *     tags: [Demographic Controller]
 *     summary: Create a new demographic
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Demographic'
 *     responses:
 *       201:
 *         description: Demographic created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Demographic'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 * @route POST /api/demographics/
 * @description Route for creating a new demographic
 * @returns {Object} 201: Newly created demographic
 * @returns {Object} 400: Bad request
 * @returns {Object} 500: Server error
 */
router.post("/", upload.single("profilePicture"), controller.createDemographic);

/**
 * @swagger
 * /api/demographics/{id}:
 *   put:
 *     tags: [Demographic Controller]
 *     summary: Update a demographic by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the demographic to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Demographic'
 *     responses:
 *       200:
 *         description: Demographic updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Demographic'
 *       404:
 *         description: Demographic not found
 *       500:
 *         description: Server error
 * @route PUT /api/demographics/{id}
 * @description Route for updating a demographic by ID
 * @param {string} id The ID of the demographic to update
 * @returns {Object} 200: Updated demographic
 * @returns {Object} 404: Demographic not found
 * @returns {Object} 500: Server error
 */
router.put("/:id", upload.single("profilePicture"), controller.updateDemographic);

module.exports = router; 