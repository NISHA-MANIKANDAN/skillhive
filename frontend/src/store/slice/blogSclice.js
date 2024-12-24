// src/store/slice/blog.js
import { createSlice } from "@reduxjs/toolkit";

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    categories: [
      { id: 1, name: "Tutoring" },
      { id: 2, name: "Music" },
      { id: 3, name: "Sports" },
      { id: 4, name: "Languages" },
      { id: 5, name: "Arts" },
      { id: 6, name: "Digital" },
    ],
    selectedCategoryId: null,
    blogPosts: [
      { id: 1, title: "How to learn almost anything with AI", categoryId: 1, description: "Learn faster with AI!" },
      { id: 2, title: "Online lessons are now available", categoryId: 1, description: "Explore online lessons on Clascity." },
      { id: 3, title: "Discover the exciting world of music", categoryId: 2, description: "Start your musical journey." },
      // Add more posts here...
    ],
  },
  reducers: {
    selectCategory: (state, action) => {
      state.selectedCategoryId = action.payload;
    },
  },
});

export const { selectCategory } = blogSlice.actions;
export default blogSlice.reducer;
