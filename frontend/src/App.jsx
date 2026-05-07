import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Post from "./pages/Post";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NewPost from "./pages/NewPost";
import EditPost from "./pages/EditPost";
import Blogs from "./pages/Blogs";
import Dashboard from "./pages/Dashboard";
import Comments from "./pages/Comments";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<Post />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/new" element={<NewPost />} />
        <Route path="/edit/:id" element={<EditPost />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/comments" element={<Comments />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;