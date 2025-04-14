// redux/userSlice.js
import { createSlice, } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  email: "",
  phone:"",
  vehicle: {
    brand: "",
    model: "",
    plate:"",
    directions:{},
    pickUp: {
      address: "",
      street: "",
      city: "",
      number: "",
      coordinates:[],
    },
    destination: {
      address: "",
      street: "",
      city: "",
      number: "",
      coordinates:[],

    }, 
    cateegory:"",
    issue:"",

  },
  transport:{  
    selectedService:"Transporte",
    distancia:0,
    duracao:0,
    preco:0,
  },
   
  payment: {
    paymentMethod: "",
    creditCardNumber: "",
    expirationDate: "",
    cvv: "",
  },
  token: "",  
  orders:[],
  location:[],
  currentOrder:{
  },onGoingOrders:[]
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Set user info
    setUser: (state, action) => {
      const { field, value } = action.payload;
      
      if (field && field.includes(".")) {  // Check if field is defined and contains a "."
        const [parent, child] = field.split(".");
        if (state[parent]) {
          state[parent][child] = value;
        }
      } else if (field) {
        state[field] = value; // For top-level fields
      }
    },
    setIssue: (state, action) => {
      state.issue=action.payload
    },
    setOrderStatus: (state, action) => {
      const { _id,  newState } = action.payload;      
      state.orders = state.orders.map((order) =>
        order._id === _id ? { ...order, state: newState } : order
      );
      console.log(state.orders);
      
    },
    // Clear user info
    clearUser: (state) => {
      state.name = "";
      state.email = "";
      state.token = "";  // Clear token on logout
      state.vehicle = initialState.vehicle;  // Clear vehicle information
      state.payment = initialState.payment;  // Clear payment information
    },

    setPayment: (state, action) => {
      state.payment = action.payload; // Updates payment state directly
    },
    setVehicle: (state, action) => {
      state.vehicle = action.payload; // Updates payment state directly
    },
    // Set token
    setToken: (state, action) => {
      state.token = action.payload;  // Update token directly
    },

    // Clear token
    clearToken: (state) => {
      state.token = "";  // Clear token when logged out
    },
    // Clear vehicle info
    clearVehicle: (state) => {
      state.vehicle = initialState.vehicle;  // Reset vehicle state
    },

    setTransport: (state,action) => {
      state.transport = action.payload;  // Reset payment state
    },
    setDriverLocation: (state, action) => {
      const { orderId, coords } = action.payload;
    
      // Find the order
      const order = state.onGoingOrders.find(order => order._id === orderId);
      if (order && order.driver?.location) {
        order.driver.location.coordinates = coords;
        console.log(coords);
        
      } else {
        console.error(`Order ${orderId} not found or missing driver location`);
      }
    },
    
    clearDriverLocation: (state) => {
      state.currentOrder.driver.location.coordinates = [];  // Reset payment state
    },
    // Clear payment info
    clearPayment: (state) => {
      state.payment = initialState.payment;  
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = initialState.currentOrder;  
    },
  },
});

export const {
  setUser,setIssue,
  clearUser,
  setToken,
  clearToken,
  setVehicle,
  clearVehicle,
  setPayment,clearCurrentOrder,setDriverLocation,clearDriverLocation,setOrderStatus,
  clearPayment,setTransport
} = userSlice.actions;

export default userSlice.reducer;
