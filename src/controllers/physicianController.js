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
*         specialty:
*           type: string
*           description: Physician's medical specialty
*         contactNumber:
*           type: string
*           description: Physician's contact number
*         clinics:
*           type: array
*           items:
*             type: object
*             properties:
*               _id:
*                 type: string
*                 description: Clinic ID
*               clinicName:
*                 type: string
*                 description: Name of the clinic
*               address:
*                 type: string
*                 description: Clinic address
*           description: List of clinics where physician is available
*       required:
*         - name
*         - specialty
*         - contactNumber
*         - clinics
*       example:
*         _id: "12345"
*         name: "Dr. John Doe"
*         specialty: "Cardiology"
*         contactNumber: "+91-99999-99999"
*         clinics:
*           - _id: "clinic1"
*             clinicName: "Heart Care Clinic"
*             address: "123 Health Street, City"
*           - _id: "clinic2"
*             clinicName: "Specialist Clinic"
*             address: "456 Medical Road, City"
*/

const getAllPhysicians = async (req, res) => {
    try {
      const physicians = await PhysicianCollection.find().exec();
      res.status(200).json(physicians);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

const  getPhysicianById = async (req, res) => {
    try {
      const physician = await PhysicianCollection.findById(req.params.id).exec();
      if (!physician) {
        return res.status(404).json({ message: "Physician not found" });
      }
      res.status(200).json(physician);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } 

  module.exports = {
    getAllPhysicians,
    getPhysicianById,
  };