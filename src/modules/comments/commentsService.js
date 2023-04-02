const Comment = require("./commentsModel");
const Post = require("../posts/postsModel")

const getAllComments = async (req, res) => {
  try {
    let userId = req.userData._id;
    let comments = await Comment.find({ user_id: userId });
    if (comments) res.status(200).json({ status: true, result: comments });
    else throw new Error("Please create Comments");
  } catch (e) {
    res.status(204).json({ status: false, result: e.message });
  }
};

const createComment = async (req, res) => {
  const { post_id, description } = req.body;
  if (post_id && description) {
    try {
      let user_id = req.userData._id;
      let post = await Post.findById(post_id);
      if(!post) throw new Error("Please enter valid post_id");
      let newComment = await new Comment({
        post_id: post._id,
        description,
        user_id,
      }).save();
      if (newComment)
        res.status(201).json({ status: true, result: newComment });
    } catch (e) {
      res.status(200).json({ status: false, result: e.message });
    }
  } else res.status(200).json({ status: false, error: "post_id and description is required!" });
};

const getCommentByPostId = async (req, res) => {
  try {
    const id = req.params.post_id;
    let comment = await Comment.find({ post_id: id }).select(
      "description post_id user_id updated_at"
    );
    if (!comment)
      res.status(200).json({ status: false, result: "Comments Not Found" });
    else res.status(200).json({ status: true, result: comment });
  } catch (e) {
    res.status(200).json({ status: false, result: e.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const id = req.params.id;
    let user_id = req.userData._id;
    let comment = await Comment.findById(id);
    if(!comment) throw new Error("Comment not found");
    if(!user_id.equals(comment.user_id) && req.userData.role !== 'admin') throw new Error("You are not Authorised");
    let deletedComment = await Comment.findByIdAndDelete({ _id: id });
    if (!deletedComment)
      res
        .status(200)
        .json({ status: false, result: "This comment id is not registered." });
    else res.status(200).json({ status: true, result: deletedComment });
  } catch (e) {
    res.status(200).json({ status: false, result: e.message });
  }
};

module.exports = {
  getAllComments,
  createComment,
  getCommentByPostId,
  deleteComment,
};
