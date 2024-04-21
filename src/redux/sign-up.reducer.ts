import { PayloadAction, createSlice } from "@reduxjs/toolkit"

const signUpSlice = createSlice({
  name: "signUp",
  initialState: {
    photoUrl: '',
    nickname: '',
    email: '',
    password: ''
  },
  reducers: {
    setPhotoUrl(state, action: PayloadAction<string>) {
      state.photoUrl = action.payload;
    },
    setNickname(state, action: PayloadAction<string>) {
      state.nickname = action.payload;
    },
    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    setPassword(state, action: PayloadAction<string>) {
      state.password = action.payload;
    },
    setSignUpFromReset(state) {
      state.photoUrl = '';
      state.nickname = '';
      state.email = '';
      state.password = '';
    }
  }
})

export const { setPhotoUrl, setNickname, setEmail, setPassword, setSignUpFromReset } = signUpSlice.actions;
export default signUpSlice.reducer;