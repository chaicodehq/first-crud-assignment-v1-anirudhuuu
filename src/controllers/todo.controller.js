import { Todo } from "../models/todo.model.js";

/**
 * Create a new todo
 * - Extract data from req.body
 * - Create todo in database
 * - Return 201 with created todo
 */
export async function createTodo(req, res, next) {
  try {
    const todo = await Todo.create(req.body);
    res.status(201).json(todo);
  } catch (error) {
    next(error);
  }
}

/**
 * List todos with pagination and filters
 * - Support query params: page, limit, completed, priority, search
 * - Default: page=1, limit=10
 * - Return: { data: [...], meta: { total, page, limit, pages } }
 */
export async function listTodos(req, res, next) {
  try {
    const { page = 1, limit = 10, completed, priority, search } = req.query;

    // Build filter object
    const filter = {};

    if (completed !== undefined) {
      filter.completed = completed === "true";
    }

    if (priority) {
      filter.priority = priority;
    }

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    // Convert to numbers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get total count for pagination meta
    const total = await Todo.countDocuments(filter);

    // Get todos with filters, pagination, and sorting
    const todos = await Todo.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Calculate total pages
    const pages = Math.ceil(total / limitNum);

    res.json({
      data: todos,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        pages,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get single todo by ID
 * - Return 404 if not found
 */
export async function getTodo(req, res, next) {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        error: {
          message: "Todo not found",
        },
      });
    }

    res.json(todo);
  } catch (error) {
    next(error);
  }
}

/**
 * Update todo by ID
 * - Use findByIdAndUpdate with { new: true, runValidators: true }
 * - Return 404 if not found
 */
export async function updateTodo(req, res, next) {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!todo) {
      return res.status(404).json({
        error: {
          message: "Todo not found",
        },
      });
    }

    res.json(todo);
  } catch (error) {
    next(error);
  }
}

/**
 * Toggle completed status
 * - Find todo, flip completed, save
 * - Return 404 if not found
 */
export async function toggleTodo(req, res, next) {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        error: {
          message: "Todo not found",
        },
      });
    }

    todo.completed = !todo.completed;
    await todo.save();

    res.json(todo);
  } catch (error) {
    next(error);
  }
}

/**
 * Delete todo by ID
 * - Return 204 (no content) on success
 * - Return 404 if not found
 */
export async function deleteTodo(req, res, next) {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(404).json({
        error: {
          message: "Todo not found",
        },
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
