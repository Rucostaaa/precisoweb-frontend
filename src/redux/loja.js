import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: [],
  language: "pt", 
};

export const loja = createSlice({
  name: "loja",
  initialState,
  reducers: {
  
    // Action to toggle between languages
    chooseLanguage: (state, action) => {
      state.language = action.payload;
    },
  },
});

export const {

  chooseLanguage,
} = loja.actions;

export default loja.reducer;
