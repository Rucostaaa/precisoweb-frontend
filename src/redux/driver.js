import { createSlice } from "@reduxjs/toolkit";
import { customFetch } from "../utils/customFetch";

const initialState = {
  name: "",
  email: "",
  phone: "",
  available:false,
  location: {
    lat: 0,
    lng: 0,
  },
  
  route:[],
  orders:[],
  currentOrder:{
    
  }
};
export const updateDBLocation = async ({ coords, token }) => {

  try {
    await customFetch("PATCH", token, coords, "driver/update-location");
  } catch (error) {
    console.error("Error updating location in DB:", error);
  }
};

export const driver = createSlice({
  name: "driver",
  initialState,
  reducers: {
    setDriver: (state, action) => {
      const { name, email, phone,orders,available, location} = action.payload;
      state.name = name;
      state.email = email;
      state.phone = phone;
      state.orders = orders;
      state.available = available;
      state.location = location;
    },
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    setState: (state, action) => {
      const { _id, state: newState } = action.payload;      
      console.log( "payload",action.payload);
      state.currentOrder.state=newState
      state.orders = state.orders.map((order) =>
        order._id === _id ? { ...order, state: newState } : order
      );
      console.log(state.orders);
      
    },
    setCurrentOrder:(state,action)=>{
      console.log("updated",action.payload);
      
        state.currentOrder=action.payload
    },
    clearCurrentOrder:(state)=>{
      state.currentOrder={}
  },
    
    clearRoute: (state) => {
      state.route = [];
    },
    pushToRoute: (state, action) => {
      const { lat, lng } = action.payload;
      console.log("added",action.payload);
      
      // Ensure state.route is initialized as an array
      if (!state.route) {
        state.route = [];
      }
    
      state.route.push({ lat, lng });

    },
    
    setLocation: (state, action) => {
      const { lat, lng } = action.payload;    
      // Ensure state.location is defined
      if (!state.location) {
        state.location = {  lat: 0, lng: 0 };
      }
      state.location.lat = lat;
      state.location.lng = lng;
    },
    
    setAvailable:(state)=>{
        state.available=true
    },
    setUnAvailable:(state)=>{
        state.available=false
    }

  },
});

export const { setDriver,setCurrentOrder,clearCurrentOrder,setState, clearRoute,pushToRoute,setOrders,setLocation,setAvailable,setUnAvailable } = driver.actions;

export default driver.reducer;