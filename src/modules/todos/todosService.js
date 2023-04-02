const Todo = require("./todosModel");

const getAllTodos = async (req, res) => {
    try {
      let userId = req.userData._id;
      let users = await Todo.find({ user_id:{$ne: userId }}).populate("user_id");
      if (users) res.status(200).json({ status: true, result: users });
      else throw new Error("Please create Todos");
    } catch (e) {
      res.status(204).json({ status: false, result: e.message });
    }
  };
const getAllTodosExceptUser = async (req, res) => {
  try {
    // let userId = req.userData._id;
    // let users = await Todo.find({ user_id:{$ne: userId }}).populate("user_id","email")
    // if (users) res.status(200).json({ status: true, result: users });
    // else throw new Error("Please create Todos");
    res.status(200).json(res.paginatedData)
  } catch (e) {
    res.status(200).json({ status: false, result: e.message });
  }
};

const getUserTodos = async (req, res) => {
    try {
      let userId = req.userData._id;
      let users = await Todo.find({ user_id: userId });
      if (users) res.status(200).json({ status: true, result: users });
      else throw new Error("Please create Todos");
    } catch (e) {
      res.status(204).json({ status: false, result: e.message });
    }
  };

const createTodo = async (req, res) => {
  const { title, description } = req.body;
  if (title) {
    try {
      let user_id = req.userData._id;
      let newTodo = await new Todo({ title, description, user_id }).save();
      if (newTodo) res.status(201).json({ status: true, result: newTodo });
    } catch (e) {
      res.status(200).json({ status: false, result: e.message });
    }
  } else res.status(200).json({ status: false, error: "Title is missing" });
};

const getTodoById = async (req, res) => {
  try {
    const id = req.params.id;
    let todo = await Todo.findById({ _id: id });
    console.log(todo, "new todo");
    if (!todo)
      res.status(200).json({ status: false, result: "Todo Not Found" });
    else res.status(200).json({ status: true, result: todo });
  } catch (e) {
    res.status(200).json({ status: false, result: e.message });
  }
};

const updateTodoById = async (req, res) => {
  const id = req.params.id;
  const { title, description } = req.body;
  if (title || description) {
    try {
      let user_id = req.userData._id;
      let updatedTodo = await Todo.findOneAndUpdate(
        { _id: id, user_id: user_id },
        { $set: { title, description } }
      );
      if (updatedTodo)
        res.status(200).json({ status: true, result: updatedTodo });
    } catch (e) {
      res.status(200).json({ status: false, result: e.message });
    }
  } else res.status(200).json({ status: false, error: "Title is missing" });
};

const deleteTodo = async (req, res) => {
  try {
    const id = req.params.id;
    let todo = await Todo.findByIdAndDelete({ _id: id });
    if (!todo)
      res.status(200).json({ status: false, result: "This todo id is not registered." });
    else res.status(200).json({ status: true, result: todo });
  } catch (e) {
    res.status(200).json({ status: false, result: e.message });
  }
};

module.exports = {
  getAllTodos,
  createTodo,
  updateTodoById,
  getTodoById,
  deleteTodo,
  getAllTodosExceptUser,
  getUserTodos
};
