"use-client"
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth", // Update with your backend URL
  withCredentials: true, // Enable cookies for authentication
});

// Register user
export const registerUser = async (userData) => {
  try {
    const response = await API.post("/register", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Registration failed" };
  }
};

// Login user
export const loginUser = async (userData) => {
  try {
    const response = await API.post("/login", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    const response = await API.post("/logout");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Logout failed" };
  }
};
