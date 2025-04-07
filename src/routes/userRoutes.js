const express = require("express");
const router = express.Router();
const { verifyToken } = require("../config/auth");

const {
  register,
  login,
  getMe,
  deleteUser,
  updateUser,
  firebaseLogin,
} = require("../controllers/userController");

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     tags: [User Controller]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *               - email
 *               - passWord
 *             properties:
 *               userName:
 *                 type: string
 *                 description: The username chosen by the user
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address
 *               passWord:
 *                 type: string
 *                 format: password
 *                 description: The user's password
 *               mobileNumber:
 *                 type: string
 *                 description: The user's 10-digit Indian mobile number
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: Authentication token
 *       400:
 *         description: User already exists or invalid data
 *       500:
 *         description: Server error
 * @route POST /api/users/register
 * @description Register a new user
 * @body {Object} Request body containing user registration details
 * @param {string} body.userName The username chosen by the user
 * @param {string} body.email The user's email address
 * @param {string} body.passWord The user's password
 * @param {string} body.mobileNumber The user's 10-digit Indian mobile number
 * @returns {Object} 201: User created successfully with user details and token
 * @returns {Object} 400: User already exists or invalid data
 * @returns {Object} 500: Server error
 */
router.post("/register", register);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     tags: [User Controller]
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emailOrUsername
 *               - passWord
 *             properties:
 *               emailOrUsername:
 *                 type: string
 *                 description: The user's email or username
 *               passWord:
 *                 type: string
 *                 format: password
 *                 description: The user's password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     userName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     mobileNumber:
 *                       type: string
 *                 token:
 *                   type: string
 *                   description: Authentication token
 *       401:
 *         description: Invalid password
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 * @route POST /api/users/login
 * @description Route for authenticating a user
 * @body {Object} Request body containing user login credentials
 * @param {string} body.emailOrUsername The user's email or username
 * @param {string} body.passWord The user's password
 * @returns {Object} 200: User logged in successfully with user details and token
 * @returns {Object} 401: Invalid password
 * @returns {Object} 404: User not found
 * @returns {Object} 500: Server error
 */
router.post("/login", login);

router.post("/firebase-signin", firebaseLogin);



router.use(verifyToken);

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     tags: [User Controller]
 *     summary: Get current user details
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 * @route GET /api/users/me
 * @description Route for retrieving current user details
 * @auth Required
 * @returns {Object} 200: Current user details
 * @returns {Object} 404: User not found
 * @returns {Object} 500: Server error
 */
router.get("/me", getMe);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     tags: [User Controller]
 *     summary: Delete a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 * @route DELETE /api/users/{id}
 * @description Route for deleting a user
 * @auth Required
 * @param {string} id The ID of the user to delete
 * @returns {Object} 200: User deleted successfully
 * @returns {Object} 404: User not found
 * @returns {Object} 500: Server error
 */
router.delete("/:id", deleteUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     tags: [User Controller]
 *     summary: Update a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *               email:
 *                 type: string
 *               passWord:
 *                 type: string
 *               mobileNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 * @route PUT /api/users/{id}
 * @description Route for updating user details
 * @auth Required
 * @param {string} id The ID of the user to update
 * @body {Object} Request body containing new user details
 * @returns {Object} 200: User updated successfully
 * @returns {Object} 404: User not found
 * @returns {Object} 500: Server error
 */
router.put("/:id", updateUser);

module.exports = router;