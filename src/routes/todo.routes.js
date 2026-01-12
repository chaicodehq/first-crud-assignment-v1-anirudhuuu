import express from "express";
import {
  createTodo,
  listTodos,
  getTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
} from "../controllers/todo.controller.js";
import { validateObjectId } from "../middlewares/validateObjectId.middleware.js";

const router = express.Router();

/**
 * Define routes
 *
 * POST   /              → createTodo
 * GET    /              → listTodos
 * GET    /:id           → getTodo (use validateObjectId middleware)
 * PATCH  /:id           → updateTodo (use validateObjectId middleware)
 * PATCH  /:id/toggle    → toggleTodo (use validateObjectId middleware)
 * DELETE /:id           → deleteTodo (use validateObjectId middleware)
 */

// Create and list routes (no ID validation needed)
router.post("/", createTodo);
router.get("/", listTodos);

// Routes with ID parameters (need validation)
router.get("/:id", validateObjectId, getTodo);
router.patch("/:id", validateObjectId, updateTodo);
router.patch("/:id/toggle", validateObjectId, toggleTodo);
router.delete("/:id", validateObjectId, deleteTodo);

export default router;
