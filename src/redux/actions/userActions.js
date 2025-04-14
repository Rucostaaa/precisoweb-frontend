// actions/userActions.js
import axios from "axios";
import { setUser, setToken } from "../redux/userSlice";

// Login action
export const loginUser = (email, password) => async (dispatch) => {
  try {
    const response = await axios.post("http://localhost:5000/api/auth/login", {
      email,
      password,
    });

    if (response.data.token) {
      // Store token in localStorage
      localStorage.setItem("token", response.data.token);

      // Store token in Redux store
      dispatch(setToken(response.data.token));

      // Store user data and token in Redux store
      dispatch(
        setUser({
          name: response.data.name,
          email: response.data.email,
          token: response.data.token,
        })
      );
    }
  } catch (error) {
    console.error("Login Error:", error.response ? error.response.data.message : error.message);
  }
};
