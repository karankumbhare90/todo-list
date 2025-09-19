import express from "express";
import { protect } from "../utils/protect.js";
import { addTodo, deleteTodo, getTodos, updateTodo } from "../controller/todoController.js";


const router = express.Router();

router.post("/add", protect, addTodo);
router.get("/get-all", protect, getTodos);
router.put("/update/:id", protect, updateTodo);
router.delete("/delete/:id", protect, deleteTodo);

export default router;
