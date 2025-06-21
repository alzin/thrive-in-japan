import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

interface Profile {
  id: string;
  userId: string;
  name: string;
  bio?: string;
  profilePhoto?: string;
  languageLevel?: string;
  points: number;
  badges: string[];
  level: number;
  createdAt: string;
  updatedAt: string;
}

interface ProfileState {
  data: Profile | null;
  loading: boolean;
  error: string | null;
  updateLoading: boolean;
}

const initialState: ProfileState = {
  data: null,
  loading: false,
  error: null,
  updateLoading: false,
};

export const fetchMyProfile = createAsyncThunk('profile/fetchMyProfile', async () => {
  const response = await api.get('/profile/me');
  return response.data;
});

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (data: { name?: string; bio?: string; languageLevel?: string }) => {
    const response = await api.put('/profile/me', data);
    return response.data;
  }
);

export const uploadProfilePhoto = createAsyncThunk(
  'profile/uploadPhoto',
  async (file: File) => {
    const formData = new FormData();
    formData.append('photo', file);
    const response = await api.post('/profile/me/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addPoints: (state, action) => {
      if (state.data) {
        state.data.points += action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch profile';
      })
      .addCase(updateProfile.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.data = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.error.message || 'Failed to update profile';
      })
      .addCase(uploadProfilePhoto.fulfilled, (state, action) => {
        if (state.data) {
          state.data.profilePhoto = action.payload.profilePhoto;
        }
      });
  },
});

export const { clearError, addPoints } = profileSlice.actions;
export default profileSlice.reducer;