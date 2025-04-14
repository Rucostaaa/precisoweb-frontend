import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import lojaReducer from "./loja.js";
import userReducer from "./user.js";
import applicationReducer from "./application.js";
import driverReducer from "./driver.js";
import adminReducer from "./admin.js";



const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const persistedLojaReducer = persistReducer(persistConfig, lojaReducer);
const persistedUserReducer = persistReducer(
  { key: "user", version: 1, storage },
  userReducer
);
const persistedDriverReducer = persistReducer(
  { key: "driver", version: 1, storage },
  driverReducer
);
const persistedApplicationReducer = persistReducer(
  { key: "application", version: 1, storage },
  applicationReducer
);
const persistedAdminReducer = persistReducer(
  { key: "admin", version: 1, storage },
  adminReducer
);

export const store = configureStore({
  reducer: {
    loja: persistedLojaReducer,
    user: persistedUserReducer,
    application: persistedApplicationReducer,
    driver: persistedDriverReducer,
    admin: persistedAdminReducer,



  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export let persistor = persistStore(store);
