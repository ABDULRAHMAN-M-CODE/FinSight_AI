import { createSlice } from '@reduxjs/toolkit';
const mainSlice=createSlice({
 name:'main',
 initialState:{
  page:"Welcome_Page",
 },
 reducers:{
  setPage:(state,action)=>{state.page=action.payload}
 }

})
export const {setPage}=mainSlice.actions
export default mainSlice.reducer