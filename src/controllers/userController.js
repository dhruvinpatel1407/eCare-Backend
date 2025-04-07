/**
 * @file User Controller
 * @description Handles user registration, login, profile management, and deletion
 */

const UserCollection = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../config/auth");
const chalk = require("chalk");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: User ID
 *         userName:
 *           type: string
 *           description: Username
 *         email:
 *           type: string
 *           format: email
 *           description: User email
 *         passWord:
 *           type: string
 *           description: User password (hashed)
 *         mobileNumber:
 *           type: string
 *           description: User mobile number
 *       required:
 *         - userName
 *         - email
 *         - passWord
 *       example:
 *         _id: "12345"
 *         userName: "johndoe"
 *         email: "john@example.com"
 *         passWord: "hashedpassword"
 *         mobileNumber: "+91-99999-99999"
 */


/**
 * @function register
 * @description Handles user registration
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Promise<void>}
 * @throws {Error} If registration fails
 */
const register = async (req, res) => {
  try {
    // Extract user data from request body
    const { userName, email, passWord, mobileNumber } = req.body;

    // Check for existing user using username, email, or mobile number
    const existingUser = await UserCollection.findOne({
      $or: [{ userName }, { email }, { mobileNumber }],
    });

    if (existingUser) {
      // Return appropriate error message based on which field already exists
      return res.status(400).json({
        error: existingUser.userName === userName
          ? "Username already exists"
          : existingUser.email === email
          ? "Email already exists"
          : "Mobile number already exists"
      });
    }

    // Create new user document
    const newUser = new UserCollection({ 
      userName, 
      email, 
      passWord, 
      mobileNumber
    });

    // Save user to database and generate authentication token
    const savedUser = await newUser.save();
    const token = generateToken(savedUser);

    // Set token in response header and return user data
    res.header("x-auth-token", token);
    res.status(201).json({ 
      user: savedUser, 
      token: token 
    });
  } catch (err) {
    console.error(chalk.red.bold("Error in registration: "), err);
    res.status(500).json({ error: "Registration failed" });
  }
};

/**
 * @function login
 * @description Handles user login
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Promise<void>}
 * @throws {Error} If login fails
 */
const login = async (req, res) => {
  try {
    // Get login credentials
    const { emailOrUsername, passWord } = req.body;

    // Find user by username, email, or mobile number
    const user = await UserCollection.findOne({
      $or: [
        { userName: emailOrUsername },
        { email: emailOrUsername },
        { mobileNumber: emailOrUsername }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: "Username/Email/Mobile number not found" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(passWord, user.passWord);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate and return token with user data
    const token = generateToken(user);
    res.header("x-auth-token", token);
    res.status(200).json({
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        mobileNumber: user.mobileNumber,
      },
      token: token
    });
  } catch (err) {
    console.error(chalk.red.bold("Error in login: "), err);
    res.status(500).json({ error: "Login failed" });
  }
};

const firebaseLogin = async (req, res) => {
  try {
    const { uid, email, displayName } = req.body;

    // Check if user exists
    const user = await UserCollection.findOne({ email });

    if (!user) {
      // Create new user if doesn't exist
      const newUser = new UserCollection({
        userName: displayName,
        email,
        passWord: uid, // Store Firebase UID as password
        mobileNumber: ''
      });
      
      const savedUser = await newUser.save();
      const token = generateToken(savedUser);
      
      res.status(201).json({ token });
    } else {
      // Generate token for existing user
      const token = generateToken(user);
      res.status(200).json({ token });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Authentication failed' });
  }
}



/**
 * @function getMe
 * @description Retrieves current user's data
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Promise<void>}
 * @throws {Error} If user not found
 */
const getMe = async (req, res) => {
  try {
    // Get user ID from request
    const userId = req.user.userId;

    // Find user by ID, excluding password
    const user = await UserCollection.findById(userId).select("-passWord");
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return user data
    res.status(200).json({ 
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        mobileNumber: user.mobileNumber,
      }
    });
  } catch (err) {
    console.error(chalk.red.bold("Error in getting user: "), err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * @function deleteUser
 * @description Deletes a user by ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Promise<void>}
 * @throws {Error} If deletion fails
 */
const deleteUser = async (req, res) => {
  try {
    // Get user ID from request parameters
    const Id = req.params.id;

    // Find user by ID
    const user = await UserCollection.findById(Id);

    if (!user) {
      return res.status(404).json({ error: "User not exists" });
    }

    // Delete user from database
    await user.deleteOne();

    res.status(200).json({ message: "User deleted Successfully" });
  } catch (err) {
    console.error(chalk.red.bold("Error in deleting user: "), err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * @function updateUser
 * @description Updates user data
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Promise<void>}
 * @throws {Error} If update fails
 */
const updateUser = async (req, res) => {
  try {
    // Get user ID from request parameters
    const Id = req.params.id;

    // Get updated data from request body
    const updatedData = req.body;

    // Find user by ID
    const user = await UserCollection.findById(Id);

    if (!user) {
      return res.status(404).json({ error: "User not exists" });
    }

    // Update each field individually if provided in request
    if (updatedData.userName) user.userName = updatedData.userName;
    if (updatedData.email) user.email = updatedData.email;
    if (updatedData.mobileNumber) user.mobileNumber = updatedData.mobileNumber;
    if (updatedData.passWord) {
      user.passWord = updatedData.passWord; // Mongoose pre-save middleware will handle hashing
    }

    // Save updated user data
    await user.save();

    res.status(200).json({ 
      message: "User updated Successfully", 
      user: user 
    });
  } catch (err) {
    console.error(chalk.red.bold("Error in updating user: "), err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Export controller functions
module.exports = {
  register,
  login,
  getMe,
  deleteUser,
  updateUser,
  firebaseLogin,
};