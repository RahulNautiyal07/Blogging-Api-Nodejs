const express = require("express");
const router = express.Router();
const { signUp, signIn, getAllUsers, searchUser, changeRole, refreshToken, logout } = require("./usersService");
const auth = require("../authentication/jwtAuth");
const { pagination } = require("../common/pagination");
const userModal = require("./usersModel");


/**
 * @swagger
 * components:
 *   schemas:
 *     user:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *         - email
 *         - password
 *         - role (bydefault "user")
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         first_name:
 *           type: string
 *           description: The user first name
 *         last_name:
 *           type: string
 *           description: The user last name
 *         email:
 *           type: string
 *           description: The user email
 *         password:
 *           type: string
 *           description: The user password
 *         role:
 *           type: string
 *           description: The user role ("user", "admin")
 *       example:
 *         id: 34783248732h4td47t4h2dh
 *         first_name: "Robo"
 *         last_name: "sharma"
 *         email: "test@gmail.com"
 *         password: "123@123"
 *         role: "user"
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Returns the list of all the users (Access restriction with admin)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */
router.get("/", auth, pagination(userModal), getAllUsers);
// router.get('/:id', getUserById)

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *     responses:
 *       200:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *       500:
 *         description: Some server error
 */
router.post("/", signUp);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login for users
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *     responses:
 *       200:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *       500:
 *         description: Some server error
 */
router.post("/login", signIn);

/**
 * @swagger
 * /users/search?search="searchString":
 *   get:
 *     summary: Returns the list of all the users for which you will search  
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */
router.get("/search", auth, searchUser);

/**
 * @swagger
 * /users/change-role/{user_id}?role=admin || user:
 *   get:
 *     summary: Returns the list of all the users for which you will search  
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */
router.put("/change-role/:id", auth, changeRole);
// router.put('/:id', getUserById)
// router.get('/:id', getUserById)

router.post('/refresh-token', refreshToken)

router.delete('/logout', auth, logout)

module.exports = router;
