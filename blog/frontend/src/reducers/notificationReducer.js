import { createSlice } from '@reduxjs/toolkit'

const initialState = []

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      const message = action.payload.message
      const type = action.payload.type
      state.push({
        message,
        type
      })
    },
    clearNotification() {
      return initialState
    }
  }
})

export const { setNotification, clearNotification } =
  notificationSlice.actions

export default notificationSlice.reducer
