const express = require("express");
const router = express.Router();
const {
  getAllComments,
  createComment,
//   updateCommentById,
getCommentByPostId,
  deleteComment,
} = require("./commentsService");
const auth = require("../authentication/jwtAuth");

router.get("/", auth, getAllComments);
router.get("/:post_id", getCommentByPostId);
router.post("/", auth, createComment);
// router.put("/:post_id/:comment_id", auth, updateCommentById);
router.delete("/:id",auth, deleteComment);

module.exports = router;
