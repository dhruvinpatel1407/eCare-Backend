const express = require("express");
const router = express.Router();
const { getAllServices } = require("../controllers/servicesController");

/**
 * @swagger
 * /api/services:
 *   get:
 *     tags : [Services Controller]
 *     summary: Get all services
 *     description: Retrieve a list of all available services
 *     responses:
 *       200:
 *         description: Successfully retrieved services
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 *       500:
 *         description: Failed to retrieve services
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */

router.get("/", getAllServices);

module.exports = router;