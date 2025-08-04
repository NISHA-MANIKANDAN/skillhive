import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

// Helper function to serialize file metadata
const serializeFile = (file) => ({
  name: file.name,
  size: file.size,
  type: file.type,
  lastModified: file.lastModified,
});

// Action for skill creation (without files)
export const createSkill = createAsyncThunk(
  'skills/create',
  async (skillData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.post(`${API_URL}/skills`, skillData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Action for skill creation with file upload
export const createSkillWithFiles = createAsyncThunk(
  'skills/createWithFiles',
  async (formData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.post(`${API_URL}/skills`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  name: '',
  skill: '',
  location: {
    street: '',
    suite: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'Canada',
    isOnline: false,
  },
  availability: [],
  fees: {
    classLength: '60 mins',
    price: '',
    attendants: '1',
    priceChange: '0',
  },
  requirements: {
    ageLimit: '',
    languages: '',
    requirements: '',
    materials: '',
  },
  curriculum: {
    lessons: [],
  },
  certificates: [],
  faqs: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
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
      state.availability.push({
        fromDay: '',
        toDay: '',
        fromTime: '',
        toTime: '',
      });
    },
    addLesson: (state) => {
      state.curriculum.lessons.push({
        title: '',
        objective: '',
        description: '',
      });
    },
    deleteLesson: (state, action) => {
      state.curriculum.lessons.splice(action.payload, 1);
    },
    addCertificate: (state) => {
      state.certificates.push({
        name: '',
        issuer: '',
        date: '',
        fileInfo: null,
      });
    },
    updateCertificate: (state, action) => {
      const { index, field, value } = action.payload;
      if (field === 'file') {
        state.certificates[index].fileInfo = serializeFile(value);
      } else {
        state.certificates[index][field] = value;
      }
    },
    deleteCertificate: (state, action) => {
      state.certificates = state.certificates.filter((_, index) => index !== action.payload);
    },
    resetForm: () => initialState,
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
        state.error = action.payload || 'Failed to create skill';
      })
      .addCase(createSkillWithFiles.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createSkillWithFiles.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(createSkillWithFiles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to create skill';
      });
  },
});

export const {
  setName,
  setSkill,
  setLocation,
  setAvailability,
  setFees,
  setRequirements,
  setCurriculum,
  addCertificate,
  updateCertificate,
  deleteCertificate,
  addTimeSlot,
  addLesson,
  deleteLesson,
  resetForm,
} = formSlice.actions;

export default formSlice.reducer;