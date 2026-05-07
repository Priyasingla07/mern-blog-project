import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API = "http://localhost:4000/api";

function Blogs() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(API + "/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  const filteredPosts = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.content.toLowerCase().includes(search.toLowerCase()) ||
    (p.category || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">

      {/* Heading */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1>All Blogs</h1>
        <p>Explore all articles, ideas and stories</p>
      </div>

      {/* Search */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <input
          type="text"
          placeholder="Search blogs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "350px",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #ccc"
          }}
        />
      </div>

      {/* Grid */}
      <div id="posts">
        {filteredPosts.map((p) => (
          <div className="post-card-new" key={p._id}>

            {p.image && (
              <img
                src={`http://localhost:4000${p.image}`}
                className="post-img-new"
                alt=""
              />
            )}

            <div className="overlay">

              <p className="category-tag">
                {p.category || "General"}
              </p>

              <h3>{p.title}</h3>

              <p className="meta">
                by {p.user?.name || "Unknown"}
              </p>

              <div className="actions">
                <Link
                  className="btn small"
                  to={`/post/${p._id}`}
                >
                  Read More
                </Link>
              </div>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

export default Blogs;