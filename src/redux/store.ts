import { configureStore } from '@reduxjs/toolkit';
import signUpReducer from './sign-up/sign-up.reducer';
import userReducer from './user/user.reducer';

export const store = configureStore({
  reducer: {
    signUpReducer,
    userReducer
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;