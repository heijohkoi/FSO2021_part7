import { createSlice } from '@reduxjs/toolkit'

const initialState = null

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      return action.payload
    }
  }
})

export const { setNotification } = notificationSlice.actions

let timeoutID = null

export const createNotification = (
  message,
  type = 'info',
  duration = 5
) => {
  return (dispatch) => {
    dispatch(setNotification({ message, type }))

    if (timeoutID) {
      clearTimeout(timeoutID)
    }

    timeoutID = setTimeout(() => {
      dispatch(setNotification(null))
    }, duration * 1000)
  }
}

export default notificationSlice.reducer
