const express = require("express");
const router = express.Router();
const { verifyToken } = require("../config/auth");
const {
  UserAppointments,
  PhysicianAppointments,
  AppointmentBooking,
  UpdateAppointmentStatus,
} = require("../controllers/appointmentController");

router.use(verifyToken);

// Create a new appointment
/**
 * @swagger
 * /api/appointments:
 *   post:
 *     tags: [Appointments Controller]
 *     summary: Create a new appointment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - physicianId
 *               - date
 *               - time
 *               - reason
 *             properties:
 *               physicianId:
 *                 type: string
 *                 description: The ID of the physician (MongoDB ID)
 *                 example: "612ec0f85a4fbd0015cc9c5d"
 *               date:
 *                 type: string
 *                 format: date
 *                 description: The appointment date in YYYY-MM-DD format
 *                 example: "2023-09-20"
 *               time:
 *                 type: string
 *                 format: time
 *                 description: The appointment time in HH:mm format
 *                 example: "10:00"
 *               reason:
 *                 type: string
 *                 description: The reason for the appointment
 *                 example: "Regular checkup"
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 * @route POST /api/appointments
 * @description Create a new appointment with patient and physician details
 * @auth Required
 * @body {Object} appointmentData - Appointment details
 * @param {string} appointmentData.physicianId - Physician's MongoDB ID
 * @param {string} appointmentData.date - Appointment date (YYYY-MM-DD)
 * @param {string} appointmentData.time - Appointment time (HH:mm)
 * @param {string} appointmentData.reason - Reason for appointment
 * @returns {Object} 201: Created appointment
 * @returns {Object} 400: Invalid request
 * @returns {Object} 500: Server error
 */
router.post("/", AppointmentBooking);

// Get all appointments for a specific user
/**
 * @swagger
 * /api/appointments/all:
 *   get:
 *     tags: [Appointments Controller]
 *     summary: Get all appointments for authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Appointments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: No appointments found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 * @route GET /api/appointments/all
 * @description Get all appointments for the authenticated user
 * @auth Required
 * @returns {Array} 200: List of appointments
 * @returns {Object} 404: No appointments found
 * @returns {Object} 500: Server error
 */
router.get("/all", UserAppointments);

// Get all appointments for a specific physician
/**
 * @swagger
 * /api/appointments/physician/{physicianId}:
 *   get:
 *     tags: [Appointments Controller]
 *     summary: Get all appointments for a specific physician
 *     parameters:
 *       - in: path
 *         name: physicianId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the physician
 *     responses:
 *       200:
 *         description: Appointments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: No appointments found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 * @route GET /api/appointments/physician/{physicianId}
 * @description Get all appointments for a specific physician
 * @param {string} physicianId - Physician's MongoDB ID
 * @returns {Array} 200: List of appointments
 * @returns {Object} 404: No appointments found
 * @returns {Object} 500: Server error
 */
router.get("/physician/:physicianId", PhysicianAppointments);

// Update appointment (reschedule or cancel)
/**
 * @swagger
 * /api/appointments/{appointmentId}:
 *   put:
 *     tags: [Appointments Controller]
 *     summary: Update appointment status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the appointment to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ "pending", "confirmed", "cancelled" ]
 *                 description: The new status of the appointment
 *                 example: "confirmed"
 *     responses:
 *       200:
 *         description: Appointment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Appointment not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       400:
 *         description: Invalid status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 * @route PUT /api/appointments/{appointmentId}
 * @description Update the status of an appointment
 * @auth Required
 * @param {string} appointmentId - MongoDB ID of the appointment
 * @body {Object} Update data
 * @param {string} body.status - New status of appointment (pending, confirmed, cancelled)
 * @returns {Object} 200: Updated appointment details
 * @returns {Object} 404: Appointment not found
 * @returns {Object} 400: Invalid status
 * @returns {Object} 500: Server error
 */
router.put("/:appointmentId", UpdateAppointmentStatus);

module.exports = router;