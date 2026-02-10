// class required to make the shared memory for the whole app, but where that memory Lives  phsyically?
import { configureStore } from '@reduxjs/toolkit';

// we import reducers, not actions, store need the thing that changes states in the store, not the thing that describes intnet
import authReducer from './authSlice';
import limitedAdviceReducer from './limitedAdviceSlice';


/* 

  1- make physicall shared memory for whole app, all the States are registerd
   
   2-We register all the reducers, each reducer is responsible for one Slice of the App:
   when action is dispatched, all reducers recives it , but only one reducer act upon it .
   
   
*/
const store = configureStore({
  reducer: {
    auth: authReducer,
    limitedAdvice:limitedAdviceReducer
  },
});

// every component has the ability to access the store,hence the export!
export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;