import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

// Load saved user & token from localStorage
const userFromStorage = JSON.parse(localStorage.getItem("user"));
let isTokenValid = false;

const initialState = {
  user: userFromStorage?.user || null,
  token: userFromStorage?.token || null,
  isAuthenticated: !!userFromStorage,
};

if (userFromStorage?.token) {
  try {
    const decoded = jwtDecode(userFromStorage.token);
    const now = Date.now() / 1000; // seconds
    isTokenValid = decoded.exp > now;
  } catch (error) {
    isTokenValid = false;
  }
}


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      // Save both user and token in localStorage
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
    },
    updateUser: (state, action) => {
      console.log("Updating user with:", action.payload);
      // Update user in Redux
      state.user = { ...state.user, ...action.payload };
      console.log("Updated user in Redux:", state.user);

      // Preserve the token while updating the user in localStorage
      const stored = JSON.parse(localStorage.getItem("user")) || {};
      console.log("Stored user before update:", stored.user);
      const updated = {
        user: { ...stored.user, ...action.payload },
        token: stored.token,
      };
      console.log("Updated user:", updated.user);
      localStorage.setItem("user", JSON.stringify(updated));
      console.log("User saved to localStorage:", localStorage.getItem("user"));
    },
  },
});

export const { loginSuccess, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
