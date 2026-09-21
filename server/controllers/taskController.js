const Task = require('../models/Task');
const { ApiError } = require('../middleware/errorHandler');

const VALID_STATUS = ['pending', 'in-progress', 'completed'];
const VALID_PRIORITY = ['low', 'medium', 'high'];

async function getTasks(req, res, next) {
  try {
    const { search, status, priority, sortBy } = req.query;
    const query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (status && VALID_STATUS.includes(status)) {
      query.status = status;
    }
    if (priority && VALID_PRIORITY.includes(priority)) {
      query.priority = priority;
    }

    const sort = {};
    if (sortBy === 'dueDate_asc') sort.dueDate = 1;
    else if (sortBy === 'dueDate_desc') sort.dueDate = -1;
    else sort.createdAt = -1;

    const tasks = await Task.find(query)
      .sort(sort)
      .populate('assignedUser', 'name email')
      .populate('createdBy', 'name email');

    res.json({ tasks });
  } catch (err) {
    next(err);
  }
}

async function getTaskById(req, res, next) {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedUser', 'name email')
      .populate('createdBy', 'name email');
    if (!task) {
      throw new ApiError(404, 'Task not found');
    }
    res.json({ task });
  } catch (err) {
    next(err);
  }
}

async function createTask(req, res, next) {
  try {
    const { title, description, priority, dueDate, status, assignedUser } = req.body;

    if (!title || !dueDate || !assignedUser) {
      throw new ApiError(400, 'Title, due date and assigned user are required');
    }

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      status,
      assignedUser,
      createdBy: req.user.id,
    });

    const populated = await task.populate([
      { path: 'assignedUser', select: 'name email' },
      { path: 'createdBy', select: 'name email' },
    ]);

    res.status(201).json({ task: populated });
  } catch (err) {
    next(err);
  }
}

async function updateTask(req, res, next) {
  try {
    const { title, description, priority, dueDate, status, assignedUser } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      throw new ApiError(404, 'Task not found');
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (status !== undefined) task.status = status;
    if (assignedUser !== undefined) task.assignedUser = assignedUser;

    await task.save();
    const populated = await task.populate([
      { path: 'assignedUser', select: 'name email' },
      { path: 'createdBy', select: 'name email' },
    ]);

    res.json({ task: populated });
  } catch (err) {
    next(err);
  }
}

async function deleteTask(req, res, next) {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      throw new ApiError(404, 'Task not found');
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };
