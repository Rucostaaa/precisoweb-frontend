import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name:"",
  email:"",
  token:"",
  userTo:{
    name:"",
    email:"",
    phone:"",
    userToken:"",
  }
};

export const admin = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdmin: (state, action) => {
        const {name,email,token}=action.payload
        state.name = name;
        state.email = email;
        state.token = token;
      },
      setUserTo: (state, action) => {
        const {name,email,phone,userToken}=action.payload
        state.userTo.name = name;
        state.userTo.email = email;
        state.userTo.phone = phone;
        state.userTo.userToken = userToken;
      },
      clearUserto: (state) => {
        state.userTo={

        }
      },

  },
});

export const {

  setAdmin,
  setUserTo,clearUserto
} = admin.actions;

export default admin.reducer;
