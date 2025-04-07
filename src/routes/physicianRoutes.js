const express = require("express");
const router = express.Router();
const {
  getAllPhysicians,
  getPhysicianById,
} = require("../controllers/physicianController");



// Get all physicians

/**
 * @swagger
 * /api/physicians/all:
 *   get:
 *     tags: [Physician Controller]
 *     summary: Get all physicians
 *     responses:
 *       200:
 *         description: Physicians retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Physician'
 *       500:
 *         description: Server error
 * @route GET /api/physicians/all
 * @description Route for retrieving all physicians
 * @returns {Array} 200: List of all physicians
 * @returns {Object} 500: Server error
 */

router.get("/all", getAllPhysicians);

// Get a specific physician by ID

/**
 * @swagger
 * /api/physicians/{id}:
 *   get:
 *     tags: [Physician Controller]
 *     summary: Get a specific physician by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the physician to retrieve
 *     responses:
 *       200:
 *         description: Physician retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Physician'
 *       404:
 *         description: Physician not found
 *       500:
 *         description: Server error
 * @route GET /api/physicians/{id}
 * @description Route for retrieving a specific physician by ID
 * @param {string} id The ID of the physician to retrieve
 * @returns {Object} 200: Physician details
 * @returns {Object} 404: Physician not found
 * @returns {Object} 500: Server error
 */

router.get("/:id", getPhysicianById);

module.exports = router;