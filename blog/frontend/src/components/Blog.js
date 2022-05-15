import { React, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { TextField, Button } from '@mui/material'

import blogService from '../services/blogs'
import commentService from '../services/comment'
import { setBlogs } from '../reducers/blogReducer'
import { createNotification } from '../reducers/notificationReducer'

const Blog = () => {
  const [commentField, setCommentField] = useState('')
  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const id = useParams().id
  const blog = blogs.find((b) => b.id === id)

  const likeBlog = async (id) => {
    const toLike = blogs.find((b) => b.id === id)
    const liked = {
      ...toLike,
      likes: (toLike.likes || 0) + 1,
      user: toLike.user.id
    }

    blogService.update(liked.id, liked).then((updatedBlog) => {
      dispatch(
        createNotification(
          `you liked '${updatedBlog.title}' by ${updatedBlog.author}`,
          'success'
        )
      )
      const updatedBlogs = blogs.map((b) =>
        b.id === id ? updatedBlog : b
      )
      dispatch(setBlogs(updatedBlogs))
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
      dispatch(setBlogs(updatedBlogs))
    })
  }

  const createComment = async (comment) => {
    const commentToSend = { comment: comment }
    commentService
      .create(blog.id, commentToSend)
      .then((updatedBlog) => {
        const updatedBlogs = blogs.map((b) =>
          b.id === id ? updatedBlog : b
        )
        dispatch(setBlogs(updatedBlogs))
      })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    createComment(commentField)
    setCommentField('')
  }

  if (!blog) {
    return null
  }

  return (
    <div className="blog">
      <h2>
        {blog.title} {blog.author}
      </h2>
      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div>
        {blog.likes} likes{' '}
        <Button
          variant="contained"
          color="primary"
          onClick={() => likeBlog(blog.id)}
        >
          like
        </Button>
      </div>
      <div>added by {blog.user.name}</div>
      {user.username === blog.user.username ? (
        <Button
          variant="contained"
          color="primary"
          onClick={() => removeBlog(blog.id)}
        >
          remove
        </Button>
      ) : null}
      <h3>comments</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            label="comment"
            value={commentField}
            onChange={({ target }) => setCommentField(target.value)}
            id="comment"
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          id="comment-button"
          type="submit"
        >
          add comment
        </Button>
      </form>

      <ul>
        {blog.comments.map((comment) => (
          <li key={Math.floor(Math.random() * 100000000)}>
            {comment}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Blog
