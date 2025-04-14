import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false, 
  error:{
    code:0,
    msg:""
  }
};

export const application = createSlice({
  name: "application",
  initialState,
  reducers: {
  
    // Action to toggle between languages
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setErrorMessage: (state, action) => {
      const {code, msg}= action.payload;
      state.error.code = code;
      state.error.msg = msg;
    },
    clearErrorMessage: (state) => {
      state.error=initialState.error
    },
    toggleLoading: (state, action) => {
        state.loading = !state.loading 
      },
  },
});

export const {
 setLoading,toggleLoading,clearErrorMessage,setErrorMessage
} = application.actions;

export default application.reducer;
