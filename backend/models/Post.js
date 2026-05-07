const mongoose = require('mongoose');
const PostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  image: { type: String }, // path to uploaded image
  category: {
    type: String,
    default: "General"},
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
}, { timestamps: true });
module.exports = mongoose.model('Post', PostSchema);
