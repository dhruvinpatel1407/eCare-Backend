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
 *               - user
 *               - physicianId
 *               - bookedTime
 *               - status
 *             properties:
 *               user:
 *                 type: string
 *                 description: The ID of the user (MongoDB ID)
 *                 example: "67f8ab60d192a3c97f5f03a4"
 *               physicianId:
 *                 type: string
 *                 description: The ID of the physician (MongoDB ID)
 *                 example: "67e428193a1311546acb4d45"
 *               selectedTime:
 *                 type: string
 *                 description: Date and time of the appointment (DD/MM/YYYY HH:mm AM/PM format)
 *                 example: "16/04/2025 10:00 AM"
 *               status:
 *                 type: string
 *                 description: Status of the appointment
 *                 example: "booked"
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
 * @description Create a new appointment with user and physician details
 * @auth Required
 * @body {Object} appointmentData - Appointment details
 * @param {string} appointmentData.user - User's MongoDB ID
 * @param {string} appointmentData.physicianId - Physician's MongoDB ID
 * @param {string} appointmentData.selectedTime - Appointment date and time (e.g. 16/04/2025 10:00 AM)
 * @param {string} appointmentData.status - Status of the appointment
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
 *     summary: Update appointment status (cancel or reschedule)
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
 *                 enum: [booked, cancelled, rescheduled]
 *                 description: New status of the appointment
 *                 example: "rescheduled"
 *               newTime:
 *                 type: string
 *                 description: New appointment time (only required if status is "rescheduled")
 *                 example: "17/04/2025 5:00 PM"
 *     responses:
 *       200:
 *         description: Appointment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
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
 * @description Update the status of an appointment (cancel or reschedule). If rescheduling, provide the new time.
 * @auth Required
 * @param {string} appointmentId - MongoDB ID of the appointment
 * @body {Object} updateData - The update payload
 * @param {string} updateData.status - New status (cancelled or rescheduled)
 * @param {string} [updateData.newTime] - New appointment time (required when status is rescheduled)
 * @returns {Object} 200: Updated appointment details
 * @returns {Object} 400: Invalid request
 * @returns {Object} 404: Appointment not found
 * @returns {Object} 500: Server error
 */

router.put("/:appointmentId", UpdateAppointmentStatus);

module.exports = router;