import { createSlice } from '@reduxjs/toolkit'

const initialState = []

const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    initializeBlogs(state, action) {
      return action.payload
    }
  }
})

export const { initializeBlogs } = blogSlice.actions

export default blogSlice.reducer
