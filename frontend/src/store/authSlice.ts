import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  email: string;
}

const initialState: AuthState = {
  email: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    clearAuth: (state) => {
      state.email = '';
    },
  },
});

export const { setEmail, clearAuth } = authSlice.actions;
export default authSlice.reducer;