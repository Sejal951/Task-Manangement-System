import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser } from '../services/authService';
import { saveSession, loadSession, clearSession } from '../utils/tokenStorage';

const existingSession = loadSession();

const initialState = {
  user: existingSession?.user || null,
  token: existingSession?.token || null,
  isAuthenticated: Boolean(existingSession?.token),
  status: 'idle',
  error: null,
};

export const login = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const data = await loginUser(payload);
    saveSession({ token: data.token, user: data.user, remember: Boolean(payload.rememberMe) });
    return data;
  } catch (err) {
    return rejectWithValue(err.friendlyMessage || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const data = await registerUser(payload);
    saveSession({ token: data.token, user: data.user, remember: false });
    return data;
  } catch (err) {
    return rejectWithValue(err.friendlyMessage || 'Registration failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      clearSession();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    sessionExpired(state) {
      clearSession();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = 'Your session has expired. Please log in again.';
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout, sessionExpired, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
