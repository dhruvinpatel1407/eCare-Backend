// Server/src/controllers/serviceController.js
const ServiceCollection = require("../models/servicesModel");

/**
 * @swagger
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Service ID
 *         name:
 *           type: string
 *           description: Name of the service
 *         description:
 *           type: string
 *           description: Detailed description of the service
 *         price:
 *           type: number
 *           description: Price of the service
 *         category:
 *           type: string
 *           description: Category of the service (e.g., "Surgery", "Consultation")
 *       required:
 *         - name
 *         - description
 *         - price
 *         - category
 *       example:
 *         _id: "12345"
 *         name: "General Consultation"
 *         description: "General medical consultation with a physician"
 *         price: 100
 *         category: "Consultation"
 */



const getAllServices = async (req, res) => {
    try {
        const services = await ServiceCollection.find().exec();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getAllServices
}