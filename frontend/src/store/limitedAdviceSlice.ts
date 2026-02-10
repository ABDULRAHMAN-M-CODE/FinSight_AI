import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { type limitedAdvice } from '../types/limitedAdviceData';

/*
Action = intent
Reducer = state change logic
Store = global memory

Or even shorter:

Actions speak(describes what happened ). Reducers act (it makes things happen).

*/

// Redux  tell  that it store something (AI response) , sometimes it exist, sometimes not (null). 
// this is just definition of the shape of the something to be stored, nothing is stored yet

interface limitedAdviceState{
    data: limitedAdvice| null;
}

// initial state of the AI response is null of course , App starts because AI response is generated
// storing of the initial value does happen here 
const  initialState:limitedAdviceState = {
    data:null,
}


// setting initial value  of the  the data and editing(updating, or mutating ) of the data  happens here, this is not storing of the data, storing does not happen here, at least that what I think
const limitedAdviceSlice = createSlice({
  name: 'limitedAdviceData',
  initialState,
  reducers: {
// does 'state' means the something that is stored   ? 
    setLimitedAdviceData: (state, action: PayloadAction<limitedAdvice>) => {
      state.data = action.payload;
    },
    // prevent data from being stuck on the store 
    clearLimitedAdviceData: (state) => {
      state.data = null;
      
    },
  },
});


// if some one want to update the gobal data or clear it , we give them tools to Describe there intent only , but they cannot mutate the state yet  .
export const {setLimitedAdviceData,clearLimitedAdviceData}=limitedAdviceSlice.actions

//reducer responds to action (Description of intent), it's the actuall thing that mutate the state based on the intent being described
// Reducers are pure functions that take the current state and the action as arguments, and return the new state.
export default limitedAdviceSlice.reducer
