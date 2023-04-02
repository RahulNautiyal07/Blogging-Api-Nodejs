const express = require("express");
const router = express.Router();
const {
  getAllPosts,
  createPost,
  updatePostById,
  getPostById,
  deletePost,
} = require("./postsService");
const auth = require("../authentication/jwtAuth");
const { pagination } = require("../common/pagination");
const PostModel = require("./postsModel");

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the post
 *         title:
 *           type: string
 *           description: The post title
 *         decsription:
 *           type: string
 *           description: The post description
 *       example:
 *         id: 34783248732h4td47t4h2dh
 *         title: Hello Here
 *         description: Today I went to delhi
 */

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: The posts managing API
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Returns the list of all the Posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: The list of the Posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */
router.get("/", auth, pagination(PostModel), getAllPosts);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get the post by id
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post id
 *     responses:
 *       200:
 *         description: The post description by id
 *         contens:
 *           application/json:
 *             schema:
 *       404:
 *         description: The post was not found
 */
router.get("/:id", getPostById);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *     responses:
 *       200:
 *         description: The post was successfully created
 *         content:
 *           application/json:
 *             schema:
 *       500:
 *         description: Some server error
 */
router.post("/", auth, createPost);

/**
 * @swagger
 * /posts/{id}:
 *  put:
 *    summary: Update the post by the id
 *    tags: [Posts]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *        type: string
 *        required: true
 *        description: The post id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/post'
 *    responses:
 *      200:
 *        description: The post was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/post'
 *      404:
 *        description: The post was not found
 *      500:
 *        description: Some error happened
 */

router.put("/:id", auth, updatePostById);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Remove the post by id
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post id
 * 
 *     responses:
 *       200:
 *         description: The post was deleted
 *       404:
 *         description: The post was not found
 */
router.delete("/:id", auth, deletePost);

module.exports = router;
