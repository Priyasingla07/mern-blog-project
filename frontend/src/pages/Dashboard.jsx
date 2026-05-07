import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Toast from "../components/Toast";

const API = "http://localhost:4000/api";

function Dashboard() {
  const [posts, setPosts] = useState([]);

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");
   const [toast, setToast] = useState(null);

  useEffect(() => {
    fetch(API + "/posts")
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) return;

        const myPosts = data.filter((p) => {
          return p.user && p.user._id === userId;
        });

        setPosts(myPosts);
      })
      .catch((err) => console.error(err));
  }, [userId]);

  const deletePost = async (id) => {
    const ok = window.confirm("Delete this post?");
    if (!ok) return;

    await fetch(API + "/posts/" + id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    setPosts((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <div className="container">
      {/* PROFILE */}
      <div className="dashboard-header">
        <h1>Welcome, {userName}</h1>
        <p>{userEmail}</p>

        <Link to="/new" className="btn">
          + Create New Post
        </Link>
      </div>

      {/* POSTS */}
      <h2 style={{ marginTop: "30px" }}>Your Posts</h2>

      <div id="posts">
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          posts.map((p) => (
            <div className="post-card-new" key={p._id}>
              {p.image && (
                <img
                  src={`http://localhost:4000${p.image}`}
                  className="post-img-new"
                  alt=""
                />
              )}

              <div className="overlay">
                <h3>{p.title}</h3>

                <div className="actions">
                  <Link to={`/post/${p._id}`} className="btn small">
                    View
                  </Link>

                  <Link to={`/edit/${p._id}`} className="btn small">
                    Edit
                  </Link>

                  <button
                    className="btn small"
                    onClick={() => deletePost(p._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;