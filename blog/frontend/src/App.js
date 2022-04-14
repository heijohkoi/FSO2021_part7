import React, { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'

import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import Blogs from './components/Blogs'
import {
  setNotification,
  clearNotification
} from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogReducer'

import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/user'

const App = () => {
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      dispatch(initializeBlogs(blogs))
    })
  }, [dispatch])

  useEffect(() => {
    const userFromStorage = userService.getUser()
    if (userFromStorage) {
      setUser(userFromStorage)
    }
  }, [])

  const login = async (username, password) => {
    loginService
      .login({
        username,
        password
      })
      .then((user) => {
        setUser(user)
        userService.setUser(user)
        notify(`${user.name} logged in!`)
      })
      .catch(() => {
        notify('wrong username/password', 'alert')
      })
  }

  const logout = () => {
    setUser(null)
    userService.clearUser()
    notify('good bye!')
  }

  const notify = (message, type = 'info') => {
    dispatch(setNotification({ message, type }))
    setTimeout(() => {
      dispatch(clearNotification())
    }, 5000)
  }

  if (user === null) {
    return (
      <>
        <Notification />
        <LoginForm onLogin={login} />
      </>
    )
  }

  return (
    <div>
      <h2>blogs</h2>

      <Notification />

      <div>
        {user.name} logged in
        <button onClick={logout}>logout</button>
      </div>

      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <NewBlogForm notify={notify} blogFormRef={blogFormRef} />
      </Togglable>

      <Blogs notify={notify} user={user} />
    </div>
  )
}

export default App
