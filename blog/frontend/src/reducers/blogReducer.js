import { createSlice } from '@reduxjs/toolkit'

const initialState = []
const byLikes = (b1, b2) => (b2.likes > b1.likes ? 1 : -1)

const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    addBlog(state, action) {
      state.push(action.payload)
    },
    initializeBlogs(state, action) {
      return action.payload.sort(byLikes)
    }
  }
})

export const { addBlog, initializeBlogs } = blogSlice.actions

export default blogSlice.reducer
