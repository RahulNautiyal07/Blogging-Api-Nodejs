const express = require("express");
const router = express.Router();
const {
  getAllTodos,
  createTodo,
  updateTodoById,
  getTodoById,
  deleteTodo,
  getAllTodosExceptUser,
  getUserTodos
} = require("./todosService");
const auth = require("../authentication/jwtAuth");
const { pagination } = require("../common/pagination");
const todoModal = require("./todosModel");

/**
 * @swagger
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the todo
 *         title:
 *           type: string
 *           description: The todo title
 *         decsription:
 *           type: string
 *           description: The todo description
 *       example:
 *         id: 34783248732h4td47t4h2dh
 *         title: Hello Here
 *         description: Today I went to delhi
 */

/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: The todos managing API
 */

/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Returns the list of all the todos except for current user
 *     tags: [Todos]
 *     responses:
 *       200:
 *         description: The list of the todos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */
router.get("/", auth, pagination(todoModal), getAllTodosExceptUser);

/**
 * @swagger
 * /todos/{id}:
 *   get:
 *     summary: Get the todo by id
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The todo id
 *     responses:
 *       200:
 *         description: The todo description by id
 *         contens:
 *           application/json:
 *             schema:
 *       404:
 *         description: The todo was not found
 */

router.get("/:id", auth, getTodoById);

/**
 * @swagger
 * /todos:
 *   post:
 *     summary: Create a new todo
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *     responses:
 *       200:
 *         description: The todo was successfully created
 *         content:
 *           application/json:
 *             schema:
 *       500:
 *         description: Some server error
 */
router.post("/", auth, createTodo);

/**
 * @swagger
 * /todos/{id}:
 *  put:
 *    summary: Update the todo by the id
 *    tags: [Todos]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *        type: string
 *        required: true
 *        description: The todo id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/todo'
 *    responses:
 *      200:
 *        description: The todo was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/todo'
 *      404:
 *        description: The todo was not found
 *      500:
 *        description: Some error happened
 */
router.put("/:id", auth, updateTodoById);

/**
 * @swagger
 * /todos/{id}:
 *   delete:
 *     summary: Remove the todo by id
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The todo id
 * 
 *     responses:
 *       200:
 *         description: The todo was deleted
 *       404:
 *         description: The todo was not found
 */
router.delete("/:id",auth, deleteTodo);

/**
 * @swagger
 * /todos/user-todos:
 *   get:
 *     summary: Get the User specific Todo 
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The todo id
 *     responses:
 *       200:
 *         description: The todo description by id
 *         contens:
 *           application/json:
 *             schema:
 *       404:
 *         description: The todo was not found
 */

router.get("/user/my-todos",auth, getUserTodos)

/**
 * @swagger
 * /todos/all-todos:
 *   get:
 *     summary: Get the todo 
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The todo id
 *     responses:
 *       200:
 *         description: The todo description by id
 *         contens:
 *           application/json:
 *             schema:
 *       404:
 *         description: The todo was not found
 */

router.get("/all-todos", getAllTodos)

module.exports = router;
