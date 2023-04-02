const Post = require("./postsModel");
const mongoose = require("mongoose");
const logger = require("../../../logger");


const getAllPosts = async (req, res) => {
  try {
    // let userId = req.userData._id;
    // let posts = await Post.find().populate("user_id","email");
    // if (posts) res.status(200).json({ status: true, result: posts });
    // else throw new Error("Please create Todos");
    res.status(200).json(res.paginatedData)

  } catch (e) {
    logger.postError(e.message)
    res.status(200).json({ status: false, result: e.message });
  }
};



const createPost = async (req, res) => {
  const { title, description } = req.body;
  if (title && description) {
    try {
      let user_id = req.userData._id;
      let newPost = await new Post({ title, description,user_id:user_id }).save();
      if (newPost) res.status(201).json({ status: true, result: newPost });
    } catch (e) {
      logger.postError(e.message)
      res.status(200).json({ status: false, result: e.message });
    }
  } else res.status(200).json({ status: false, error: "Something is missing" });
};

const getPostById = async (req, res) => {
  try {
    const id = req.params.id;
    let post = await Post.findById({ _id: id });
    console.log(post, "new todo");
    if (!post)
      res.status(200).json({ status: false, result: "Todo Not Found" });
    else res.status(200).json({ status: true, result: post });
  } catch (e) {
    logger.postError(e.message)
    res.status(200).json({ status: false, result: e.message });
  }
};

const updatePostById = async (req, res) => {
  const id = req.params.id;
  const { title, description } = req.body;
  if (title || description) {
    try {
      let user_id = req.userData._id;
      let updatedPost = await Post.findOneAndUpdate(
        { _id: id, user_id: user_id },
        { $set: { title, description } }
      );
      if (updatedPost)
        res.status(200).json({ status: true, result: updatedPost });
    } catch (e) {
      res.status(200).json({ status: false, result: e.message });
    }
  } else res.status(200).json({ status: false, error: "Title is missing" });
};

const deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    let post = await Post.findByIdAndDelete({ _id: id });
    if (!post)
      res
        .status(200)
        .json({ status: false, result: "This post id is not registered." });
    else res.status(200).json({ status: true, result: post });
  } catch (e) {
    logger.postError(e.message)
    res.status(200).json({ status: false, result: e.message });
  }
};

module.exports = {
  getAllPosts,
  createPost,
  updatePostById,
  getPostById,
  deletePost,
};
