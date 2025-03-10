import { createSlice } from "@reduxjs/toolkit";

const collectionSlice = createSlice({
  name: "collection",
  initialState: {
    name: null,
    description: null,
    requests: [],
  },
  reducers: {
    // Action to set the collection name
    setCollectionName: (state, action) => {
      state.name = action.payload;
    },
    // Action to set the collection description
    setCollectionDescription: (state, action) => {
      state.description = action.payload;
    },
    // Action to add a new request to the collection
    addRequest: (state, action) => {
      state.requests.push(action.payload);
    },
  },
});

export const { setCollectionName, setCollectionDescription, addRequest } =
  collectionSlice.actions;

export default collectionSlice.reducer;
