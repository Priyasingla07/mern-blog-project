const express = require("express");
const router = express.Router();

const Comment = require("../models/Comment");
const Post = require("../models/Post");
const auth = require("../middleware/auth");


// DASHBOARD FEATURES

// ➤ Get ALL comments on logged-in user's posts
router.get("/my-posts-comments", auth, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id });

    const postIds = posts.map(p => p._id);

    const comments = await Comment.find({
      post: { $in: postIds }
    })
      .populate("user", "name")
      .populate("post", "title")
      .sort({ createdAt: -1 });

    res.json(comments);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// ➤ Approve comment
router.put("/approve/:id", auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.approved = true;
    await comment.save();

    res.json({ message: "Approved" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// ➤ Delete comment
router.delete("/:id", auth, async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ➤ Add comment (FOR POST PAGE)
router.post("/:postId", async (req, res) => {
  try {
    const { name, text } = req.body;

    const comment = await Comment.create({
      post: req.params.postId,
      name,
      text
    });

    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// ➤ Get approved comments (FOR POST PAGE )
router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({
      post: req.params.postId,
      approved: true
    }).sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching comments" });
  }
});



module.exports = router;