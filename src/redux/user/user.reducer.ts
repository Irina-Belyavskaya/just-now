import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UserStateType } from "./types/user-state.type";
import { getUser } from "./users.actions";
import { User } from "@/src/types/user.type";

const initialState: UserStateType = {
  userInfo: null,
  pending: {
    userInfo: false,
  },
  errors: {
    userInfo: null,
  }
}

/*
{
    user_id: '',
    user_email: '',
    user_password: '',
    user_nickname: '',
    user_profile_picture_url: '',
    user_entry_date: '',    
    user_created_at: ''
  }
*/

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // setUserProfilePictureUrl(state, action: PayloadAction<string>) {
    //   state.userState.user_profile_picture_url = action.payload;
    // },
    // setUserNickname(state, action: PayloadAction<string>) {
    //   state.userState.user_nickname = action.payload;
    // },
    // setUserEmail(state, action: PayloadAction<string>) {
    //   state.userState.user_email = action.payload;
    // },
    // setUserEntryDate(state, action: PayloadAction<string>) {
    //   state.userState.user_entry_date = action.payload;
    // },
    // setUserFromReset(state) {
    //   state.userState.user_profile_picture_url = '';
    //   state.userState.user_nickname = '';
    //   state.userState.user_email = '';
    //   state.userState.user_entry_date = '';
    // }
    setUserReset(state) {
      state.userInfo = null;
    },
    setUserInfo(state, action: PayloadAction<User>) {
      state.userInfo = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // ============ Get user =========================
      .addCase(getUser.pending, (state) => {
        state.pending.userInfo = true;
        state.errors.userInfo = null;
      })
      .addCase(getUser.fulfilled, (state, { payload }) => {
        state.pending.userInfo = false;
        console.log('fulfilled!!!!!!!', payload)
        state.userInfo = payload;
      })
      .addCase(getUser.rejected, (state, action: any & { payload: any }) => {
        state.pending.userInfo = false;
        state.errors.userInfo = action.payload;
      })
  }
})

export const {
  // setUserProfilePictureUrl, 
  // setUserEntryDate, 
  // setUserNickname, 
  // setUserEmail, 
  // setUserFromReset 
  setUserInfo,
  setUserReset
} = userSlice.actions;
export default userSlice.reducer;