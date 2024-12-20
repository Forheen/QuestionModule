import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  role: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
    },
    clearToken: (state) => {
      state.token = null;
      state.role = null;
    },
  },
});

export const { setToken, clearToken } = authSlice.actions;

export default authSlice.reducer;
