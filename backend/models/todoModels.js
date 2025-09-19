import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Todo name is required"],
      trim: true,
      minlength: [3, "Todo name must be at least 3 characters long"],
      maxlength: [100, "Todo name cannot exceed 100 characters"],
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;
