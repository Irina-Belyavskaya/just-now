import repository from "@/src/repository";
import { User } from "@/src/types/user.type";
import { createAsyncThunk } from "@reduxjs/toolkit";

const headers = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}

export const getUser = createAsyncThunk<User>(
  'users/info',
  async (_, thunkAPI) => {
    try {
      const response = await repository.get('/users/user-info', headers);
      return response.data;
    } catch (e) {
      return thunkAPI.rejectWithValue('Can\'t get user info')
    }
  }
);

// export const updateUser = createAsyncThunk<UpdateUserInfoDtoType, { dto: UpdateUserInfoDtoType }>(
//   'user/update',
//   async ({ dto }, thunkAPI) => {
//       try {
//           const response = await repository.put('/users/info/user', dto, headers);
//           return response.data;
//       } catch (e) {
//           return thunkAPI.rejectWithValue('Can`t update user info')
//       }
//   }
// );
