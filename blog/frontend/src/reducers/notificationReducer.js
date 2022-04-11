import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      console.log('from setNotification: ', action.payload)
      return state.push(action.payload)
    }
  }
})

export const { setNotification } = notificationSlice.actions

export default notificationSlice.reducer
