// src/features/auth/authSlice.ts
import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { authAPI } from './authApi';
import type { User, LoginCredentials, SignupData } from './authApi';
import type { RootState } from '../../store/index';

export interface AuthState {
  user: User ;
  users: Record<string, User>; // Add this to cache users by ID
  isLoading: boolean; // For auth operations (login, signup, logout, getCurrentUser)
  isLoadingData: boolean; // For data operations (getAllCustomers, getUserById)
  error: string | null;
  initialized: boolean;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: {} as User,
  users: {}, // Initialize empty object for caching
  isLoading: false,
  isLoadingData: false,
  error: null,
  initialized: false,
  isAuthenticated: false,
};

// Helper to safely extract an error message from unknown errors
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  try {
    return JSON.stringify(error);
  } catch {
    return 'An unknown error occurred';
  }
}

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      return response.user;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async (data: SignupData, { rejectWithValue }) => {
    try {
      const response = await authAPI.signup(data);
      return response.user;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await authAPI.logout();
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const timeoutPromise = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('Authentication check timed out')), 10000)
      );

      const user = await Promise.race([
        authAPI.getCurrentUser(),
        timeoutPromise,
      ]);
      return user;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (data: Partial<User>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      if (!state.auth.user?.id) {
        throw new Error('No user ID found');
      }
      
      const updatedUser = await authAPI.updateProfile(state.auth.user.id, data);
      return updatedUser;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      await authAPI.resetPassword(email);
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async (newPassword: string, { rejectWithValue }) => {
    try {
      await authAPI.updatePassword(newPassword);
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Demo login helper
export const demoLogin = createAsyncThunk(
  'auth/demoLogin',
  async (role: 'Customer' | 'agent', { rejectWithValue }) => {
    try {
      const response = await authAPI.demoLogin(role);
      return response.user;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getAllCustomers = createAsyncThunk(
  'auth/getAllCustomers',
  async (_, { rejectWithValue }) => {
    try {
      const customers = await authAPI.getAllCustomers();
      return customers;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Fetch user by ID - stores in cache without overwriting current user
export const getUserById = createAsyncThunk(
  'auth/getUserById',
  async (userId: string, { rejectWithValue }) => {
    try {
      const user = await authAPI.getProfileById(userId);
      return { userId, user };
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // For setting user after OAuth redirect
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
      state.initialized = true;
      state.isAuthenticated = !!action.payload;
    },
    // Clear cached users (optional, for logout)
    clearUsersCache: (state) => {
      state.users = {};
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.initialized = true;
      state.isAuthenticated = !!action.payload;
      // Also cache the user
      if (action.payload) {
        state.users[action.payload.id] = action.payload;
      }
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.initialized = true;
      state.isAuthenticated = false;
    });

    // Signup
    builder.addCase(signup.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(signup.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.initialized = true;
      state.isAuthenticated = !!action.payload;
      if (action.payload) {
        state.users[action.payload.id] = action.payload;
      }
    });
    builder.addCase(signup.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.initialized = true;
      state.isAuthenticated = false;
    });

    // Logout
    builder.addCase(logout.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.users = {}; // Clear cache on logout
      state.isLoading = false;
      state.initialized = true;
      state.isAuthenticated = false;
    });
    builder.addCase(logout.rejected, (state) => {
      state.isLoading = false;
      state.initialized = true;
      state.isAuthenticated = false;
    });

    // Get Current User
    builder.addCase(getCurrentUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getCurrentUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.initialized = true;
      state.isAuthenticated = !!action.payload;
      if (action.payload) {
        state.users[action.payload.id] = action.payload;
      }
    });
    builder.addCase(getCurrentUser.rejected, (state) => {
      state.isLoading = false;
      state.user = null;
      state.initialized = true;
      state.isAuthenticated = false;
    });

    // Get All Customers
    builder.addCase(getAllCustomers.pending, (state) => {
      state.isLoadingData = true;
      state.error = null;
    });
    builder.addCase(getAllCustomers.fulfilled, (state, action) => {
      state.isLoadingData = false;
      // Cache all customers by ID
      action.payload.forEach((customer) => {
        state.users[customer.id] = customer;
      });
    });
    builder.addCase(getAllCustomers.rejected, (state, action) => {
      state.isLoadingData = false;
      state.error = action.payload as string;
    });

    // Update Profile
    builder.addCase(updateProfile.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      if (action.payload) {
        state.users[action.payload.id] = action.payload;
      }
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Demo Login
    builder.addCase(demoLogin.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(demoLogin.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.initialized = true;
      state.isAuthenticated = !!action.payload;
      if (action.payload) {
        state.users[action.payload.id] = action.payload;
      }
    });
    builder.addCase(demoLogin.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.isAuthenticated = false;
    });

    // Get User By ID - stores in cache without overwriting current user
    builder.addCase(getUserById.pending, (state) => {
      // Don't set global loading for fetching other users
    });
    builder.addCase(getUserById.fulfilled, (state, action) => {
      const { userId, user } = action.payload;
      state.users[userId] = user; // Store in cache
    });
    builder.addCase(getUserById.rejected, (state, action) => {
      console.error('Failed to fetch user:', action.payload);
    });

    // Password Reset
    builder.addCase(resetPassword.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(resetPassword.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError, setUser, clearUsersCache } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectUserById = (state: RootState, userId: string) => state.auth.users[userId];

// Memoized selector to prevent unnecessary rerenders
export const selectAllUsers = createSelector(
  (state: RootState) => state.auth.users,
  (users) => Object.values(users)
);

// Selector for customers only (users with role 'Customer')
export const selectAllCustomers = createSelector(
  (state: RootState) => state.auth.users,
  (users) => Object.values(users).filter(user => user.role === 'Customer')
);

export default authSlice.reducer;