// Server/src/controllers/demographicController.js
const DemographicsCollection = require("../models/demographicModel");
const UserCollection = require("../models/userModel");
const fs = require("fs");
const path = require("path");
const validator = require("../utils/utils")
/**
 * @swagger
 * components:
 *   schemas:
 *     Demographic:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique ID for the demographic document
 *         userId:
 *           type: string
 *           description: ObjectId of the user associated with this demographic
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           example: "1990-01-01"
 *           description: Date of birth in YYYY-MM-DD format
 *         gender:
 *           type: string
 *           enum: ["Male", "Female", "Other", "Prefer not to say"]
 *           description: Gender of the user
 *         bloodGroup:
 *           type: string
 *           enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
 *           description: Blood group of the user
 *         height:
 *           type: number
 *           example: 175
 *           description: Height in centimeters
 *         weight:
 *           type: number
 *           example: 70
 *           description: Weight in kilograms
 *         address:
 *           type: object
 *           properties:
 *             street:
 *               type: string
 *               example: "123 Main Street"
 *               description: Street address
 *             city:
 *               type: string
 *               example: "New York"
 *               description: City name
 *             state:
 *               type: string
 *               example: "NY"
 *               description: State name or abbreviation
 *             zipCode:
 *               type: string
 *               pattern: "^[0-9]{6}$"
 *               example: "100001"
 *               description: 6-digit ZIP/postal code
 *         maritalStatus:
 *           type: string
 *           enum: ["Single", "Married", "Divorced", "Widowed"]
 *           description: Marital status of the user
 *         occupation:
 *           type: string
 *           example: "Software Engineer"
 *           description: Occupation or profession of the user
 *         profilePicture:
 *           type: string
 *           format: binary
 *           description: Base64-encoded image data (optional, max 1MB)
 *         profilePictureType:
 *           type: string
 *           enum: ["image/png", "image/jpg", "image/jpeg", "image/gif"]
 *           description: MIME type of the uploaded profile picture
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the demographic entry was created
 *       required:
 *         - userId
 *         - dateOfBirth
 *         - gender
 *         - bloodGroup
 *         - height
 *         - weight
 *         - address
 *         - maritalStatus
 *         - occupation
 *       example:
 *         _id: "6616d92d67c4bc001234abcd"
 *         userId: "660fcb6f1234567890abcde1"
 *         dateOfBirth: "1990-01-01"
 *         gender: "Male"
 *         bloodGroup: "A+"
 *         height: 175
 *         weight: 70
 *         address:
 *           street: "123 Main Street"
 *           city: "New York"
 *           state: "NY"
 *           zipCode: "100001"
 *         maritalStatus: "Single"
 *         occupation: "Software Engineer"
 *         createdAt: "2023-12-15T08:30:00.000Z"
 *         profilePicture: "base64string..."
 *         profilePictureType: "image/png"
 */



getDemographics = async (req, res) => {
  try {
    // Get user ID from the authenticated user
    const userId = req.user.userId; // Assuming you have user object in req from your auth middleware

    // Find demographics for the logged-in user and populate user details
    const demographics = await DemographicsCollection.find({ userId: userId })
      .populate("userId")
      .exec();

    if (!demographics || demographics.length === 0) {
      // If no demographics found, return user details
      const user = await UserCollection.findById(userId).exec();
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      return res.json({
        message: "No demographics found",
        userId: user,
      });
    }

    // demographics.forEach(d => {
    //   if (d.profilePicture && d.profilePictureType) {
    //     console.log(d.profilePicture);
    //     d.profilePicture = `data:image/${d.profilePictureType};base64,${Buffer.from(d.profilePicture).toString('base64')}`;
    //   }
    // });

    res.json(demographics);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching demographics",
    });
  }
};

createDemographic = async (req, res) => {
  try {
    // Get user ID from the authenticated user
    const userId = req.user.userId; // Assuming you have user object in req from your auth middleware

    // Check if file was uploaded
    if (req.file) {
      const fileType = req.file.originalname.split(".").pop().toLowerCase();

      const isValidType = validator.imageTypeValidator(fileType);
      if (!isValidType) {
        return res.status(400).json({
          message: "Invalid image type. Only PNG, JPG, JPEG, and GIF are allowed.",
        });
      }

      const imageBuffer = fs.readFileSync(req.file.path);

      const isValidSize = validator.imageSizeValidator(imageBuffer, 5);
      if (!isValidSize) {
        return res.status(400).json({
          message: "Profile picture must be less than 1MB",
        });
      }
      // Create demographic with profile picture
      const demographic = new DemographicsCollection({
        ...req.body,
        userId: userId,
        profilePicture: imageBuffer,
        profilePictureType: fileType,
      });

      await demographic.save();
      res.status(201).json(demographic);
    } else {
      // Handle case where no file was uploaded
      const demographic = new DemographicsCollection({
        ...req.body,
        userId: userId,
      });

      await demographic.save();
      res.status(201).json(demographic);
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      const validationErrors = {};
      for (const [key, value] of Object.entries(error.errors)) {
        validationErrors[key] = value.message;
      }
      return res.status(400).json({
        message: "Validation errors occurred",
        errors: validationErrors,
      });
    }
    if (error.name === "AuthorizationError") {
      return res.status(401).json({
        message: "Unauthorized. Please login to continue",
      });
    }
    res.status(500).json({
      message: "Error creating demographic",
    });
  }
};

updateDemographic = async (req, res) => {
  try {
    const id = req.params.id;
    const update = req.body;
    
   
    if (req.file) {
      const fileType = req.file.originalname.split(".").pop().toLowerCase();
     
      const isValidType = validator.imageTypeValidator(fileType);
      
      if (!isValidType) {
        return res.status(400).json({
          message: "Invalid image type. Only PNG, JPG, JPEG, and GIF are allowed.",
        });
      }
     
      // Read image buffer from disk since you're using multer.diskStorage
      const imageBuffer = fs.readFileSync(req.file.path);
      
      const isValidSize = validator.imageSizeValidator(imageBuffer, 5);
      
      if (!isValidSize) {
        
        return res.status(400).json({
          message: "Profile picture must be less than 1MB",
        });
      }
      
      update.profilePicture = imageBuffer;
      update.profilePictureType = fileType;

      // Optional: delete file from uploads/ after saving
      fs.unlinkSync(req.file.path);
    }
    
    const isUsernameChanging = 'userName' in update;
    
    const options = {
      new: true,
      runValidators: true
    };
    
    const demographic = await DemographicsCollection.findByIdAndUpdate(
      id,
      update,
      options
    ).populate("userId");
    
    if (!demographic) {
      return res.status(404).json({ message: "Demographic not found" });
    }

    if (isUsernameChanging) {
      const { userName: newUsername } = update;
      const { userId } = demographic;
      
      const user = await UserCollection.findByIdAndUpdate(
        userId,
        { userName: newUsername },
        { new: true }
      );
      
      if (!user) {
        return res.status(404).json({ 
          message: "User not found" 
        });
      }
    }
    
    res.json(demographic);
  } catch (error) {
    
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation failed", details: error.message });
    }
    res.status(500).json({ message: "Error updating demographic" });
  }
};

module.exports = {
  updateDemographic,
  createDemographic,
  getDemographics
};
