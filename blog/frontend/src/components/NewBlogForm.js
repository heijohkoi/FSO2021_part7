import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { TextField, Button } from '@mui/material'
import { addBlog } from '../reducers/blogReducer'
import blogService from '../services/blogs'
import { createNotification } from '../reducers/notificationReducer'

const NewBlogForm = ({ blogFormRef }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const dispatch = useDispatch()

  const createBlog = async (blog) => {
    blogService
      .create(blog)
      .then((createdBlog) => {
        dispatch(
          createNotification(
            `a new blog '${createdBlog.title}' by ${createdBlog.author} added`,
            'success'
          )
        )
        dispatch(addBlog(createdBlog))
        blogFormRef.current.toggleVisibility()
      })
      .catch((error) => {
        dispatch(
          createNotification(
            'creating a blog failed: ' + error.response.data.error,
            'error'
          )
        )
      })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({ title, author, url, likes: 0 })
    setAuthor('')
    setTitle('')
    setUrl('')
  }

  return (
    <div>
      <h2>Create new</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            label="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            id="title"
            placeholder="title of the blog"
          />
        </div>
        <div>
          <TextField
            label="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            id="author"
            placeholder="author of the blog"
          />
        </div>
        <div>
          <TextField
            label="url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            id="url"
            placeholder="url of the blog"
          />
        </div>
        <Button
          size="small"
          variant="contained"
          color="primary"
          type="submit"
        >
          create
        </Button>
      </form>
    </div>
  )
}

export default NewBlogForm
