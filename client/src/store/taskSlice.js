import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchTasks,
  createTask as createTaskApi,
  updateTask as updateTaskApi,
  deleteTask as deleteTaskApi,
} from '../services/taskService';

const initialState = {
  items: [],
  status: 'idle',
  error: null,
  filters: {
    search: '',
    status: '',
    priority: '',
    sortBy: 'dueDate_asc',
  },
};

export const loadTasks = createAsyncThunk('tasks/load', async (_, { rejectWithValue }) => {
  try {
    return await fetchTasks();
  } catch (err) {
    return rejectWithValue(err.friendlyMessage || 'Failed to load tasks');
  }
});

export const addTask = createAsyncThunk('tasks/add', async (payload, { rejectWithValue }) => {
  try {
    return await createTaskApi(payload);
  } catch (err) {
    return rejectWithValue(err.friendlyMessage || 'Failed to create task');
  }
});

export const editTask = createAsyncThunk(
  'tasks/edit',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await updateTaskApi(id, payload);
    } catch (err) {
      return rejectWithValue(err.friendlyMessage || 'Failed to update task');
    }
  }
);

export const removeTask = createAsyncThunk('tasks/remove', async (id, { rejectWithValue }) => {
  try {
    await deleteTaskApi(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.friendlyMessage || 'Failed to delete task');
  }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetTasks(state) {
      state.items = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTasks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(loadTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(editTask.fulfilled, (state, action) => {
        const idx = state.items.findIndex((t) => t._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t._id !== action.payload);
      });
  },
});

export const { setFilters, resetTasks } = taskSlice.actions;
export default taskSlice.reducer;
