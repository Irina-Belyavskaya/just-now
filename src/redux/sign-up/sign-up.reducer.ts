import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { SignUpDto } from "./types/sign-up.dto";

const initialState = {
  user_profile_picture_url: '',
  user_nickname: '',
  user_password: '',
  user_email: ''
}

const signUpSlice = createSlice({
  name: "signUp",
  initialState,
  reducers: {
    setPhotoUrl(state, action: PayloadAction<string>) {
      state.user_profile_picture_url = action.payload;
    },
    setNickname(state, action: PayloadAction<string>) {
      state.user_nickname = action.payload;
    },
    setEmail(state, action: PayloadAction<string>) {
      state.user_email = action.payload;
    },
    setPassword(state, action: PayloadAction<string>) {
      state.user_password = action.payload;
    },
    setSignUpFromReset(state) {
      state.user_profile_picture_url = '';
      state.user_nickname = '';
      state.user_email = '';
      state.user_email = '';
    },
  },
});

export const {
  setPhotoUrl,
  setNickname,
  setEmail,
  setPassword,
  setSignUpFromReset
} = signUpSlice.actions;
export default signUpSlice.reducer;