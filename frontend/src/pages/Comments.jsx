import { useEffect, useState } from "react";

const API = "http://localhost:4000/api";

function Comments() {
  const [comments, setComments] = useState([]);

  const fetchComments = () => {
    fetch(API + "/comments/my-posts-comments", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(data => setComments(data));
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const approve = async (id) => {
    await fetch(API + "/comments/approve/" + id, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    });

    fetchComments();
  };

  const remove = async (id) => {
    await fetch(API + "/comments/" + id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    });

    fetchComments();
  };

  return (
    <div className="container">
      <h2>Comments on Your Posts</h2>

      {comments.length === 0 ? (
        <p>No comments yet</p>
      ) : (
        comments.map((c) => (
          <div key={c._id} className="comment-card">

            <h4>{c.user?.name || "User"}</h4>
            <p>{c.content || c.text}</p>

            <small>On: {c.post?.title}</small>

            <p>
              Status:{" "}
              {c.approved ? (
                <span style={{ color: "green" }}>Approved</span>
              ) : (
                <span style={{ color: "orange" }}>Pending</span>
              )}
            </p>

            {!c.approved && (
              <button onClick={() => approve(c._id)} className="btn small">
                Approve
              </button>
            )}

            <button onClick={() => remove(c._id)} className="btn small">
              Delete
            </button>

          </div>
        ))
      )}
    </div>
  );
}

export default Comments;