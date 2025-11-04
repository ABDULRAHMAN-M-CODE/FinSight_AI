import { configureStore } from "@reduxjs/toolkit";
import mainReducer from './mainSlice'
/**
  {main:mainReducer}
  Explanation
 key = the name of the slice in the state (state.main).

reducerFunction = the function that handles that slice (mainReducer).
 */
export const store= configureStore({
    reducer :{main:mainReducer} 
})