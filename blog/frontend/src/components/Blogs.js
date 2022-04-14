import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Blog from './Blog'
import blogService from '../services/blogs'
import { initializeBlogs } from '../reducers/blogReducer'

const Blogs = ({ notify, user }) => {
  const blogs = useSelector((state) => state.blogs)
  const dispatch = useDispatch()

  const likeBlog = async (id) => {
    const toLike = blogs.find((b) => b.id === id)
    const liked = {
      ...toLike,
      likes: (toLike.likes || 0) + 1,
      user: toLike.user.id
    }

    blogService.update(liked.id, liked).then((updatedBlog) => {
      notify(
        `you liked '${updatedBlog.title}' by ${updatedBlog.author}`
      )
      const updatedBlogs = blogs.map((b) =>
        b.id === id ? updatedBlog : b
      )
      dispatch(initializeBlogs(updatedBlogs))
    })
  }

  const removeBlog = (id) => {
    const toRemove = blogs.find((b) => b.id === id)

    const ok = window.confirm(
      `remove '${toRemove.title}' by ${toRemove.author}?`
    )

    if (!ok) {
      return
    }

    blogService.remove(id).then(() => {
      const updatedBlogs = blogs.filter((b) => b.id !== id)
      dispatch(initializeBlogs(updatedBlogs))
    })
  }

  return (
    <div id="blogs">
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          likeBlog={likeBlog}
          removeBlog={removeBlog}
          user={user}
        />
      ))}
    </div>
  )
}

export default Blogs
