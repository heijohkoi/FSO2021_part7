import React from 'react'
import { useSelector } from 'react-redux'
import { Alert } from '@mui/material'

const Notification = () => {
  const notification = useSelector((state) => state.notification)
  if (!notification) {
    return null
  }

  return (
    <div>
      <Alert severity={notification.type}>
        {notification.message}
      </Alert>
    </div>
  )
}

export default Notification
