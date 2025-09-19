
import Todo from "../models/todoModels.js";
import asyncHandler from "../utils/asyncHandler.js";

export const addTodo = asyncHandler(async (req, res) => {
  const { name, status } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Todo name is required",
    });
  }

  const todo = await Todo.create({
    name,
    status: status || "Pending",
    user: req.user.id,
  });

  res.status(201).json({
    success: true,
    message: "Todo created successfully",
    todo,
  });
});

// GET /todo/get-all?page=1&limit=10
export const getTodos = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  const todos = await Todo.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Todo.countDocuments();

  res.status(200).json({
    success: true,
    todos,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
});

export const updateTodo = asyncHandler(async (req, res) => {
  const { name, status } = req.body;
  const todo = await Todo.findOne({ _id: req.params.id });

  if (!todo) {
    return res.status(404).json({
      success: false,
      message: "Todo not found",
    });
  }

  if (name) todo.name = name;
  if (status) todo.status = status;

  const updatedTodo = await todo.save();

  res.status(200).json({
    success: true,
    message: "Todo updated successfully",
    todo: updatedTodo,
  });
});


export const deleteTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findOne({ _id: req.params.id });

  if (!todo) {
    return res.status(404).json({
      success: false,
      message: "Todo not found",
    });
  }

  await todo.deleteOne();

  res.status(200).json({
    success: true,
    message: "Todo deleted successfully",
  });
});
