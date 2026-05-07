import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API = "http://localhost:4000/api";

function Post() {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  const [text, setText] = useState("");

  // Fetch post
  useEffect(() => {
    fetch(API + "/posts/" + id)
      .then(res => res.json())
      .then(data => {
        setPost(data);
        setComments(data.comments || []); // ✅ important
      });
  }, [id]);

  // Add comment
  const handleComment = async (e) => {
    e.preventDefault();

    console.log("Comment button clicked");

    try {
      const res = await fetch(API + "/posts/comment/" + id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token") // ✅ required
        },
        body: JSON.stringify({ content: text }) // ✅ correct field
      });

      console.log("Status:", res.status);

      let data;
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      console.log("Response:", data);

      if (res.ok) {
        setComments([data, ...comments]);
        setText("");
      } else {
        alert(data.message || "Failed to post comment");
      }

    } catch (err) {
      console.error("Error:", err);
    }
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div className="container">
      <h1>{post.title}</h1>

      {post.image && (
        <img
          src={`http://localhost:4000${post.image}`}
          className="post-img"
          alt=""
        />
      )}

      <p className= "post-content">{post.content}</p>

      {/* COMMENTS */}
      <div className="comments-section">

        <h3>Leave a Comment</h3>

        <form onSubmit={handleComment} className="form">
          <textarea
            placeholder="Write your comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />

          <button className="btn">Post Comment</button>
        </form>

        <h3 style={{ marginTop: "30px" }}>Comments</h3>

        {comments.length === 0 ? (
          <p>No comments yet</p>
        ) : (
          comments.map((c) => (
            <div key={c._id} className="comment-card">
              <h4>{c.user?.name || "User"}</h4>
              <p>{c.content}</p>
              <span>{new Date(c.createdAt).toLocaleString()}</span>
            </div>
          ))
        )}

      </div>
    </div>
  );
}

export default Post;