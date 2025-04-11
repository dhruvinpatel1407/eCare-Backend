const PhysicianCollection = require("../models/physicianModel");

/**
 * @swagger
 * components:
 *   schemas:
 *     Physician:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Physician ID
 *         name:
 *           type: string
 *           description: Physician's full name
 *         speciality:
 *           type: string
 *           description: Physician's medical specialty
 *         contactNumber:
 *           type: string
 *           description: Physician's contact number
 *         email:
 *           type: string
 *           format: email
 *           description: Physician's email address
 *         clinics:
 *           type: array
 *           description: List of clinics where the physician is available
 *           items:
 *             type: object
 *             properties:
 *               clinicName:
 *                 type: string
 *                 description: Name of the clinic
 *               address:
 *                 type: string
 *                 description: Address of the clinic
 *               city:
 *                 type: string
 *                 description: City where the clinic is located
 *               workingDays:
 *                 type: array
 *                 description: Days and times the physician is available at the clinic
 *                 items:
 *                   type: object
 *                   properties:
 *                     day:
 *                       type: string
 *                       enum:
 *                         - Monday
 *                         - Tuesday
 *                         - Wednesday
 *                         - Thursday
 *                         - Friday
 *                         - Saturday
 *                         - Sunday
 *                       description: Day of availability
 *                     startTime:
 *                       type: string
 *                       format: date-time
 *                       description: Start time of availability
 *                     endTime:
 *                       type: string
 *                       format: date-time
 *                       description: End time of availability
 *       required:
 *         - name
 *         - speciality
 *         - contactNumber
 *         - email
 *         - clinics
 *       example:
 *         _id: "507f1f77bcf86cd799439011"
 *         name: "Dr. Jane Smith"
 *         speciality: "Dermatology"
 *         contactNumber: "+91-98765-43210"
 *         email: "dr.jane@example.com"
 *         clinics:
 *           - clinicName: "Skin Wellness Clinic"
 *             address: "456 Care Street"
 *             city: "Mumbai"
 *             workingDays:
 *               - day: "Monday"
 *                 startTime: "2024-04-10T09:00:00Z"
 *                 endTime: "2024-04-10T13:00:00Z"
 *               - day: "Wednesday"
 *                 startTime: "2024-04-10T14:00:00Z"
 *                 endTime: "2024-04-10T18:00:00Z"
 */

const getAllPhysicians = async (req, res) => {
  try {
    const physicians = await PhysicianCollection.find().exec();
    res.status(200).json(physicians);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPhysicianById = async (req, res) => {
  try {
    const physician = await PhysicianCollection.findById(req.params.id).exec();
    if (!physician) {
      return res.status(404).json({ message: "Physician not found" });
    }
    res.status(200).json(physician);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllPhysicians,
  getPhysicianById,
};
