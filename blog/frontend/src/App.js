import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Routes, Route, Link, useParams } from 'react-router-dom'
import { Container, Button, AppBar, Toolbar } from '@mui/material'

import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import Blogs from './components/Blogs'
import Blog from './components/Blog'
import { createNotification } from './reducers/notificationReducer'
import { setBlogs } from './reducers/blogReducer'
import { initUser } from './reducers/userReducer'
import { setUsers } from './reducers/usersReducer'

import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/user'
import usersService from './services/users'

const App = () => {
  const blogFormRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      dispatch(setBlogs(blogs))
    })
  }, [dispatch])

  useEffect(() => {
    usersService.getAll().then((users) => {
      dispatch(setUsers(users))
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
        dispatch(
          createNotification(`${user.name} logged in!`, 'success')
        )
      })
      .catch(() => {
        dispatch(
          createNotification('wrong username/password', 'error')
        )
      })
  }

  const logout = () => {
    dispatch(initUser(null))
    userService.clearUser()
    dispatch(createNotification('good bye!', 'success'))
  }

  const user = useSelector((state) => state.user)
  const allUsers = useSelector((state) => state.users)

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

        <Blogs />
      </div>
    )
  }

  const Users = () => {
    // console.log(allUsers)
    if (!allUsers) {
      return null
    }
    const usersSortedByBlogCount = allUsers.sort(
      (a, b) => b.blogs.length - a.blogs.length
    )
    // console.log('sorted:', usersSortedByBlogCount)

    return (
      <div>
        <h2>Users</h2>
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>blogs created</th>
            </tr>
            {usersSortedByBlogCount.map((u) => {
              // console.log('u.id: ', u.id)
              return (
                <tr key={u.id}>
                  <td>
                    <Link to={`/users/${u.id}`}>{u.name}</Link>
                  </td>
                  <td>{u.blogs.length}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  const User = () => {
    const id = useParams().id
    const singleUser = allUsers.find((u) => u.id === id)
    if (!singleUser) {
      return null
    }
    // console.log('singleUser: ', singleUser)
    return (
      <div>
        <h1>{singleUser.name}</h1>
        <h2>added blogs</h2>
        {singleUser.blogs.map((b) => {
          return <li key={b.id}>{b.title}</li>
        })}
      </div>
    )
  }

  const padding = {
    padding: 5
  }

  return (
    <Container>
      <div>
        <Notification />

        <AppBar position="static">
          <Toolbar>
            <Button color="inherit" component={Link} to="/">
              home
            </Button>
            <Button color="inherit" component={Link} to="/users">
              users
            </Button>
            {user.name} logged in
            <Button color="inherit" onClick={logout}>
              logout
            </Button>
          </Toolbar>
        </AppBar>

        <div>
          <Link style={padding} to="/">
            home
          </Link>
          <Link style={padding} to="/users">
            users
          </Link>
          {user.name} logged in
          <Button
            variant="contained"
            color="primary"
            onClick={logout}
          >
            logout
          </Button>
        </div>

        <h2>blogs</h2>

        <Routes>
          <Route path="/blogs/:id" element={<Blog />} />
          <Route path="/users/:id" element={<User />} />
          <Route path="/users" element={<Users />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Container>
  )
}

export default App
