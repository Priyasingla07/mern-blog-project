import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Chatbot from "../components/Chatbot";
import { FaMoon,FaSun } from "react-icons/fa";

const API = "http://localhost:4000/api";

function Home() {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showMenu, setShowMenu] = useState(false);

  const [darkMode, setDarkMode] = useState(
    document.body.classList.contains("dark"));
  
    const menuRef = useRef();


  // Fetch posts
 useEffect(() => {
  fetch(API + "/posts")
    .then(res => res.json())
    .then(data => setPosts(data));
}, []);
 
// Dropdown close
  useEffect(() => {
   const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowMenu(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
  }, []);

  const likePost = async (id) => {
  await fetch(API + "/posts/like/" + id, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  });

  window.location.reload();
};

const deletePost = async (id) => {
  const ok = window.confirm("Delete this post?");
  if (!ok) return;

  await fetch(API + "/posts/" + id, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  });

  window.location.reload();
};

 const filteredPosts =
    selectedCategory === "All"
      ? posts
      : posts.filter((p) => p.category === selectedCategory);

  return (
    <div>
      {/* Navbar */}
      <div className="topbar">
    <div className="topbar-inner">

   <div className="logo">Blog</div>

<div className="center-nav">
  
  </div>

  <div className="right-nav">

{localStorage.getItem("token") ? (
  <div className="profile-box" ref={menuRef}>
    
    <div
      className="profile-btn"
      onClick={() => setShowMenu(!showMenu)}
    >
      👤 {localStorage.getItem("userName")}
    </div>

    {showMenu && (
      <div className="dropdown-menu">
        <Link to="/dashboard">Dashboard</Link>

        <Link to="/new">Create Blog</Link>

        <Link to="/comments">Comments</Link>

        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          Logout ➜
        </button>
      </div>
    )}

  </div>
  ) : (
    <>
      <Link to="/login" className="btn">Login</Link>
      <Link to="/signup" className="btn">Signup</Link>
    </>
  )}

  <button
    className="toggle-btn"
    onClick={() => {
      document.body.classList.toggle("dark");
      setDarkMode(document.body.classList.contains("dark"));
    }}
  >
      {darkMode ? <FaSun /> : <FaMoon />}
  </button>
</div>

</div>
</div>

{/* Hero */}
      <div className="hero">
  <div className="hero-content">
    <h2>Welcome to Blog</h2>
    <p>Read amazing stories, ideas and insights</p>
    <Link to="/blogs" className="btn hero-btn">Explore More Blogs</Link>
  </div>
</div>

{/* Content */}
      <div className="container">

        {/* Category Filters */}
         <div className="filters">
          {[
            "All",
            "General",
            "Tech",
            "Travel",
            "Health",
            "Food",
            "Education",
            "Motivation"
          ].map((cat) => (
            <button
              key={cat}
              className="filter-btn"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts */}
        <div id="posts">
          {Array.isArray(filteredPosts) && filteredPosts.slice(0,3).map((p) => (
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

                <p className="meta">by {p.user?.name || "Unknown"}</p>

               <div className="actions">

                <Link className="btn small" to={`/post/${p._id}`}>Read More →
                </Link>

             </div>
 </div>
  </div>
  ))}
 </div>
 </div>
 <Chatbot posts={posts} />

 <footer className="footer">
  <div className="footer-container">

    <div className="footer-brand">
      <h2>Blog</h2>
      <p>
        Read inspiring stories, ideas and insights from creators around the world.
      </p>
    </div>

    <div className="footer-links">
      <h4>Quick Links</h4>
      <a href="/">Home</a>
      <a href="/about">About</a>
      <a href="/new">Create Post</a>
      <a href="/blogs">Blogs</a>
    </div>

    <div className="footer-links">
      <h4>Categories</h4>
      <a href="/">Tech</a>
      <a href="/">Travel</a>
      <a href="/">Health</a>
      <a href="/">Motivation</a>
    </div>

    <div className="footer-links">
      <h4>Connect</h4>
      <a href="/">Instagram</a>
      <a href="/">Email</a>
    </div>

  </div>

  <div className="footer-bottom">
    © 2026 Blog. All rights reserved.
  </div>
</footer>

</div>

  );
}

export default Home;