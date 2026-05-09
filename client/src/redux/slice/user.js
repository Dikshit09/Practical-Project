import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createUserApi, loginUserApi } from "../api/user";

const initialState = {
  // ✅ Page reload pe bhi user rahe
  user: JSON.parse(localStorage.getItem('t_A1b2C3d')) || null,
  users: [],
  isLoading: false,
  error: "",
};

const AsyncFunctionThunk = (name, apiFunction) => {
  return createAsyncThunk(`user/${name}`, async (data, { rejectWithValue }) => {
    try {
      const response = await apiFunction(data);
      return response.data;
    } catch (error) {
      console.error(`Failed to ${name}:`, error);
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ error: error.message });
    }
  });
};

export const createUserSlice = AsyncFunctionThunk("createUserApi", createUserApi);
export const loginUserSlice = AsyncFunctionThunk("loginUserApi", loginUserApi);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = null;
    },
    // ✅ Logout action
    logoutUser: (state) => {
      state.user = null;
      localStorage.removeItem('t_A1b2C3d');
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(createUserSlice.fulfilled, (state, action) => {
        state.isLoading = false;
        // ✅ state.user = true wala bug hataya
      })
      .addCase(createUserSlice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createUserSlice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(loginUserSlice.fulfilled, (state, action) => {
        state.user = action.payload.data; // ✅ user data save karo
        localStorage.setItem("t_A1b2C3d", JSON.stringify(action.payload.data));
        state.isLoading = false;
        // ✅ state.user = true wala bug hataya
      })
      .addCase(loginUserSlice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUserSlice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setError, logoutUser } = userSlice.actions;
export default userSlice.reducer;