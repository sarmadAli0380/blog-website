const express = require('express');
const router = express.Router();

const Blog = require('./../models/blogschema.js');
const User = require('./../models/userSchema.js');
const authenticate = require('../auth');

// POST: create a blog (auth required)
/* JSON REQUEST
{
  "title": "My Title",
  "description": "Short summary",
  "content": "Full blog content",
  "image": "https://..." // optional
}
*/
router.post('/', authenticate, async (req, res) => {
  try {
    const data = req.body;

    if (!data.title || !data.description || !data.content) {
      return res.status(401).json({ message: 'title, description and content are mandatory' });
    }

    // make sure logged-in user exists
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const newBlog = new Blog({
      ...data,
      author: req.user.id
    });

    const response = await newBlog.save();

    console.log('blog saved');
    res.status(200).json({ message: 'Blog saved', data: response });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET: list all blogs (public)
router.get('/', async (req, res) => {
  try {
    const data = await Blog.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    console.log('blogs fetched');
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET: logged-in user's blogs
router.get('/mine', authenticate, async (req, res) => {
  try {
    const data = await Blog.find({ author: req.user.id })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET: simple search by title (example: /api/blogs/search?title=react)
router.get('/search', async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) return res.status(401).json({ message: 'title query is mandatory' });

    const data = await Blog.find({ title: { $regex: title, $options: 'i' } })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ count: data.length, data: data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET: blog detail by id (public)
router.get('/:id', async (req, res) => {
  try {
    const blogId = req.params.id;

    const data = await Blog.findById(blogId).populate('author', 'name email');
    if (!data) return res.status(404).json({ message: 'Blog not found' });

    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT: update blog (auth + ownership)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const blogId = req.params.id;
    const updatedBlogData = req.body;

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    if (blog.author.toString() !== req.user.id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const response = await Blog.findByIdAndUpdate(blogId, updatedBlogData, {
      new: true,
      runValidators: true
    }).populate('author', 'name email');

    console.log('blog updated');
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE: delete blog (auth + ownership)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const blogId = req.params.id;

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    if (blog.author.toString() !== req.user.id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await Blog.findByIdAndDelete(blogId);

    console.log('blog deleted');
    res.status(200).json({ message: 'Blog Deleted Successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
