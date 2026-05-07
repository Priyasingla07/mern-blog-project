const express = require('express');
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const router = express.Router();
const multer = require("multer");
const path = require("path");

// multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// create post
router.post('/', auth, upload.single("image"), async (req, res) => {
  console.log("Route hit");

  try {
  console.log("BODY:", req.body);
  console.log("FILE:", req.file);

  
    const { title, content, category } = req.body;
    if (!title || !content) return res.status(400).json({ message: 'Title and content required' });
    const post = new Post({ user: req.user.id, title, content, image: req.file ? "/uploads/" + req.file.filename : "", category});
    console.log("Saving post...");
    await post.save();
    console.log("Saved successfully");
    res.json(post);
  } catch (err) {
    console.error("Create error:", err);
    console.error(err); res.status(500).json({ message: 'Server error' });
  }
});

// get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('user','name email').sort({ createdAt:-1 });
    const safePosts = posts.map(p => ({
  ...p._doc,
  user: p.user || { name: "Unknown" }
}));

res.json(safePosts);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

// get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('user','name').populate({ path:'comments', populate:{ path:'user', select:'name' }});
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

// update post
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content, image } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.user.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    post.title = title || post.title;
    post.content = content || post.content;
    post.image = image || post.image;
    await post.save();
    res.json(post);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

// delete post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// like / unlike post
router.post('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const idx = post.likes.findIndex(id => id.toString() === req.user.id);
    if (idx === -1) {
      post.likes.push(req.user.id);
    } else {
      post.likes.splice(idx,1);
    }
    await post.save();
    res.json({ likes: post.likes.length });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

// add comment
router.post('/comment/:id', auth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Content required' });
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const comment = new Comment({ user: req.user.id, post: post._id, content });
    await comment.save();
    post.comments.push(comment._id);
    await post.save();
    const populated = await comment.populate('user','name');
    res.json(populated);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
