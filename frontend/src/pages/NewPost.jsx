import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";

const API = "http://localhost:4000/api";

function NewPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("General");
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  console.log("Publish clicked");

  try{
    const formData = new FormData();

    formData.append("title", title.trim());
    formData.append("content", content.trim());
    formData.append("category", category);

    if (image) {
      formData.append("image", image);
    }
    console.log("Sending request....");

      const token = localStorage.getItem("token");

    const res = await fetch(API + "/posts", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token
      },
      body: formData
    });
    console.log("Response status:", res.status);

    
    const data = await res.json();
    console.log("Response data:", data);

    if (res.ok) {
      setToast({message: "Post created!", type: "success"});
      setTimeout(() => {
      navigate("/");
     },1200);
    } else {
      setToast({message: "Failed to create post", type: "fail"});
    }
  } catch (error) {
    console.error("Submit error:", error);
    setToast({message: "Something went wrong", type: "fail"});
  }
  };

  return (
    <div className="container">
      
      {toast && (
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(null)}
      />
    )}

      <h2>Create New Post</h2>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Enter post Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Write your Content"
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />


        <select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
>
  <option>General</option>
  <option>Tech</option>
  <option>Travel</option>
  <option>Health</option>
  <option>Food</option>
  <option>Education</option>
  <option>Motivation</option>
</select>

      <input
          type="file"
          onChange={e => setImage(e.target.files[0])}
        />

        <button type="submit" className="btn">Publish</button>
      </form>
    </div>
  );
}

export default NewPost;