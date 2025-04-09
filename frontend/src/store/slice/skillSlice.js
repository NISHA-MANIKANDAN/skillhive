import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

export const createSkill = createAsyncThunk(
  'skills/create',
  async (skillData, { getState, rejectWithValue }) => {
    try {
      // Get the token from the Redux state
      const token = getState().auth.token;

      if (!token) {
        throw new Error('Token is missing. Please log in again.');
      }

      const response = await axios.post(`${API_URL}/skills`, skillData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      console.error('Error details:', error.response?.data);
      return rejectWithValue(error.response?.data?.error || 'Failed to create skill');
    }
  }
);

const initialState = {
  name: '',
  skill: '',
  location: {
    street: '',
    suite: '',
    country: 'Canada',
    city: '',
    province: '',
    postalCode: '',
    isOnline: false
  },
  availability: [],
  fees: {
    classLength: '30 mins',
    price: '',
    attendants: 1,
    priceChange: 0
  },
  requirements: {
    ageLimit: '',
    languages: '',
    requirements: '',
    materials: ''
  },
  curriculum: {
    lessons: [{
      title: '',
      objective: '',
      description: ''
    }]
  },
  faqs: [],
  status: 'idle',
  error: null
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
    },
    setSkill: (state, action) => {
      state.skill = action.payload;
    },
    
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    setAvailability: (state, action) => {
      state.availability = action.payload;
    },
    setFees: (state, action) => {
      state.fees = action.payload;
    },
    setRequirements: (state, action) => {
      state.requirements = action.payload;
    },
    setCurriculum: (state, action) => {
      state.curriculum = action.payload;
    },
    addTimeSlot: (state) => {
      state.availability.push({ fromDay: '', toDay: '', fromTime: '', toTime: '' });
    },
    addLesson: (state) => {
      state.curriculum.lessons.push({ title: '', objective: '', description: '' });
    },
    deleteLesson: (state, action) => {
      state.curriculum.lessons = state.curriculum.lessons.filter((_, index) => index !== action.payload);
    },
    resetForm: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSkill.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createSkill.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(createSkill.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const {
  setName,
  setSkill,
  setLocation,
  setAvailability,
  setFees,
  setRequirements,
  setCurriculum,
  addTimeSlot,
  addLesson,
  deleteLesson,
  resetForm
} = formSlice.actions;

export default formSlice.reducer;