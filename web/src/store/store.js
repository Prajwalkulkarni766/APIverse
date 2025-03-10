import { configureStore } from "@reduxjs/toolkit";
import tokenReducer from "../redux/auth.slice.js";
import loadingReducer from "../redux/loading.slice.js";
import collectionReducer from "../redux/collection.slice.js";

export const store = configureStore({
  reducer: {
    token: tokenReducer,
    loading: loadingReducer,
    collection: collectionReducer,
  },
});
