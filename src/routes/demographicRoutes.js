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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 * @route GET /api/demographics/
 * @description Route for retrieving all demographics
 * @returns {Array<Demographic>} 200: List of all demographics
 * @returns {Object} 500: Server error
 */

router.get("/", controller.getDemographics);

/**
 * @swagger
 * /api/demographics/:
 *   post:
 *     tags: [Demographic Controller]
 *     summary: Create a new demographic
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - dateOfBirth
 *               - gender
 *               - bloodGroup
 *               - height
 *               - weight
 *               - occupation
 *               - maritalStatus
 *               - address[street]
 *               - address[city]
 *               - address[state]
 *               - address[zipCode]
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Chirag Patidar
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: 2025-03-31
 *               gender:
 *                 type: string
 *                 enum: [Male, Female, Other]
 *                 example: Male
 *               bloodGroup:
 *                 type: string
 *                 enum: [A+, B+, AB+, O+, A-, B-, AB-, O-]
 *                 example: O+
 *               height:
 *                 type: number
 *                 example: 123
 *               weight:
 *                 type: number
 *                 example: 50
 *               occupation:
 *                 type: string
 *                 example: Businessman
 *               maritalStatus:
 *                 type: string
 *                 enum: [Single, Married, Divorced, Widowed]
 *                 example: Married
 *               address[street]:
 *                 type: string
 *                 example: 112 main street
 *               address[city]:
 *                 type: string
 *                 example: Junagadh
 *               address[state]:
 *                 type: string
 *                 example: Gujarat
 *               address[zipCode]:
 *                 type: string
 *                 example: 362002
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: Profile picture upload
 *     responses:
 *       201:
 *         description: Demographic created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Demographic'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid input
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 * @route POST /api/demographics/
 * @description Route for creating a new demographic with personal and address details
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
 *     consumes:
 *       - multipart/form-data
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - dateOfBirth
 *               - gender
 *               - bloodGroup
 *               - height
 *               - weight
 *               - occupation
 *               - maritalStatus
 *               - address[street]
 *               - address[city]
 *               - address[state]
 *               - address[zipCode]
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Chirag Patidar
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: 2025-03-31
 *               gender:
 *                 type: string
 *                 enum: [Male, Female, Other]
 *                 example: Male
 *               bloodGroup:
 *                 type: string
 *                 example: O+
 *               height:
 *                 type: number
 *                 example: 123
 *               weight:
 *                 type: number
 *                 example: 50
 *               occupation:
 *                 type: string
 *                 example: Businessman
 *               maritalStatus:
 *                 type: string
 *                 enum: [Single, Married, Divorced, Widowed]
 *                 example: Married
 *               address[street]:
 *                 type: string
 *                 example: 112 main street
 *               address[city]:
 *                 type: string
 *                 example: Junagadh
 *               address[state]:
 *                 type: string
 *                 example: Gujarat
 *               address[zipCode]:
 *                 type: string
 *                 example: 362002
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: Profile picture file (optional)
 *     responses:
 *       200:
 *         description: Demographic updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Demographic'
 *       404:
 *         description: Demographic not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Demographic not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 * @route PUT /api/demographics/{id}
 * @description Route for updating a demographic by ID with personal, address, and profile picture
 * @param {string} id The ID of the demographic to update
 * @returns {Object} 200: Updated demographic
 * @returns {Object} 404: Demographic not found
 * @returns {Object} 500: Server error
 */

router.put("/:id", upload.single("profilePicture"), controller.updateDemographic);

module.exports = router; 