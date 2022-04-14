import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { initializeBlogs } from '../reducers/blogReducer'
import blogService from '../services/blogs'

const NewBlogForm = ({ notify, blogFormRef }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const blogs = useSelector((state) => state.blogs)

  const dispatch = useDispatch()

  const createBlog = async (blog) => {
    blogService
      .create(blog)
      .then((createdBlog) => {
        notify(
          `a new blog '${createdBlog.title}' by ${createdBlog.author} added`
        )
        dispatch(initializeBlogs(blogs.concat(createdBlog)))
        // setBlogs(blogs.concat(createdBlog))
        blogFormRef.current.toggleVisibility()
      })
      .catch((error) => {
        notify(
          'creating a blog failed: ' + error.response.data.error,
          'alert'
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

  // const handleSubmit = (event) => {
  //   event.preventDefault()
  //   onCreate({ title, author, url, likes: 0 })
  //   setAuthor('')
  //   setTitle('')
  //   setUrl('')
  // }

  return (
    <div>
      <h2>Create new</h2>

      <form onSubmit={handleSubmit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            id="title"
            placeholder="title of the blog"
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            id="author"
            placeholder="author of the blog"
          />
        </div>
        <div>
          url
          <input
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            id="url"
            placeholder="url of the blog"
          />
        </div>
        <button id="create-butto" type="submit">
          create
        </button>
      </form>
    </div>
  )
}

export default NewBlogForm
