// Server/src/controllers/appointmentController.js
const AppointmentCollection = require("../models/appointmentModel");
const PhysicianCollection = require("../models/physicianModel");
const UserCollection = require("../models/userModel");

/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Appointment ID
 *         user:
 *           type: string
 *           description: User ID who booked the appointment
 *         physician:
 *           type: string
 *           description: Physician ID
 *         bookedTime:
 *           type: string
 *           format: date-time
 *           example: "20/09/2023 10:00 AM"
 *           description: Time slot when appointment is booked in dd/mm/yyyy hh:mm AM/PM format
 *         status:
 *           type: string
 *           enum: ["booked", "cancelled", "rescheduled"]
 *           description: Status of the appointment
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When appointment was created
 *       required:
 *         - user
 *         - physician
 *         - bookedTime
 *       example:
 *         _id: "12345"
 *         user: "67890"
 *         physician: "54321"
 *         bookedTime: "20/09/2023 10:00 AM"
 *         status: "booked"
 *         createdAt: "2023-12-15T08:30:00"
 */

const UserAppointments = async (req, res) => {
    try {
        const appointments = await AppointmentCollection.find({ user: req.user.userId })
            .populate("physician", "_id name speciality contactNumber clinics.clinicName")
            .exec();

        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const PhysicianAppointments = async (req, res) => {
    try {
        const physicianId = req.params.physicianId;

        const appointments = await AppointmentCollection
            .find({ physician: physicianId })
            .populate("physician", "_id name specialty")
            .exec();


        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const AppointmentBooking = async (req, res) => {
    try {
        const { physicianId, selectedTime } = req.body;
        // Check if user exists
        const user = await UserCollection.findById(req.user.userId).exec();
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find the physician
        const physician = await PhysicianCollection.findById(physicianId).exec();

        if (!physician) {
            return res.status(404).json({ message: "Physician not found" });
        }

        // Check if slot is available
        const existingAppointment = await AppointmentCollection.findOne({
            user: req.user.userId,
            physician: physicianId,
            bookedTime: selectedTime,
            status : "booked"
        });

        if (existingAppointment) {
            return res.status(400).json({ message: "Slot is already booked" });
        }

        const appointment = new AppointmentCollection({
            user: req.user.userId,
            physician: physicianId,
            bookedTime: selectedTime,
            status: "booked"
        });

        await appointment.save();
        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const UpdateAppointmentStatus = async (req, res) => {
    try {
        const appointmentId = req.params.appointmentId;
        const { newTime, status } = req.body;

        const existingAppointment = await AppointmentCollection.findById(appointmentId).exec();
        if (!existingAppointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        // If rescheduling
        if (newTime) {
            // Check if new time slot is available
            const slotAvailable = await AppointmentCollection.findOne({
                user: existingAppointment.user,
                physician: existingAppointment.physician,
                bookedTime: newTime,
                status : "booked"
            });

            if (slotAvailable) {
                return res.status(400).json({ message: "New slot is already booked" });
            }

            existingAppointment.bookedTime = newTime;
            existingAppointment.status = "rescheduled"; // Reset status if rescheduling
        }

        // If cancelling
        if (status === "cancelled") {
            existingAppointment.status = status;
        }

        // Update the appointment
        const updatedAppointment = await existingAppointment.save();
        res.status(200).json(updatedAppointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    UserAppointments,
    PhysicianAppointments,
    AppointmentBooking,
    UpdateAppointmentStatus
}