import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Routes, Route, Link } from 'react-router-dom'
import _ from 'lodash'

import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import Blogs from './components/Blogs'
import { createNotification } from './reducers/notificationReducer'
import { setBlogs } from './reducers/blogReducer'
import { initUser } from './reducers/userReducer'

import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/user'

const App = () => {
  const blogFormRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      dispatch(setBlogs(blogs))
    })
  }, [dispatch])

  useEffect(() => {
    const userFromStorage = userService.getUser()
    if (userFromStorage) {
      dispatch(initUser(userFromStorage))
    }
  }, [dispatch])

  const login = async (username, password) => {
    loginService
      .login({
        username,
        password
      })
      .then((user) => {
        dispatch(initUser(user))
        userService.setUser(user)
        dispatch(createNotification(`${user.name} logged in!`))
      })
      .catch(() => {
        dispatch(
          createNotification('wrong username/password', 'alert')
        )
      })
  }

  const logout = () => {
    dispatch(initUser(null))
    userService.clearUser()
    dispatch(createNotification('good bye!'))
  }

  const user = useSelector((state) => state.user)

  if (user === null) {
    return (
      <>
        <Notification />
        <LoginForm onLogin={login} />
      </>
    )
  }

  const Home = () => {
    return (
      <div>
        <Togglable buttonLabel="new blog" ref={blogFormRef}>
          <NewBlogForm blogFormRef={blogFormRef} />
        </Togglable>

        <Blogs user={user} />
      </div>
    )
  }

  const Users = () => {
    const blogs = useSelector((state) => state.blogs)
    const byUser = _.groupBy(blogs, (b) => b.user.name)
    const blogCounts = Object.keys(byUser).map((name) => {
      return {
        name,
        addedBlogs: byUser[name].length
      }
    })
    const sortedByBlogCounts = blogCounts.sort(
      (a, b) => b.blogs - a.blogs
    )
    return (
      <div>
        <h2>Users</h2>
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>blogs created</th>
            </tr>
            {sortedByBlogCounts.map((u) => {
              return (
                <tr key={u.name}>
                  <td>{u.name}</td>
                  <td>{u.addedBlogs}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  const padding = {
    padding: 5
  }

  return (
    <div>
      <h2>blogs</h2>

      <Notification />

      <div>
        <Link style={padding} to="/">
          home
        </Link>
        <Link style={padding} to="/users">
          users
        </Link>
        {user.name} logged in
        <button onClick={logout}>logout</button>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
      </Routes>

      {/* <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <NewBlogForm blogFormRef={blogFormRef} />
      </Togglable>

      <Blogs user={user} /> */}
    </div>
  )
}

export default App
