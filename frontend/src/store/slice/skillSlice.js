import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

export const createSkill = createAsyncThunk(
  'skills/create',
  async (skillData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/skills`, skillData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create skill');
    }
  }
);

const initialState = {
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