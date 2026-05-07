import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Toast from "../components/Toast";

const API = "http://localhost:4000/api";

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [toast, setToast] = useState(null);

  // Load existing post
  useEffect(() => {
    fetch(API + "/posts/" + id)
      .then(res => res.json())
      .then(data => {
        setTitle(data.title);
        setContent(data.content);
        setImage(data.image || "");
      });
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const res = await fetch(API + "/posts/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify({
        title,
        content,
        image
      })
    });

    const data = await res.json();

    if (res.ok) {
      setToast({message: "Post updated successfully", type: "success"});
      setTimeout(() => {
      navigate("/");
     },1200);
    } else {
      setToast({message: "Update failed", type: "fail"});
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

      <h2>Edit Post</h2>

      <form onSubmit={handleUpdate} className="form">

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        {image && (
          <img
            src={`http://localhost:4000${image}`}
            alt="preview"
            style={{
              width: "100%",
              maxHeight: "250px",
              objectFit: "cover",
              borderRadius: "8px",
              marginBottom: "15px"
            }}
          />
        )}

        <button type="submit" className="btn">
          Update Post
        </button>

      </form>
    </div>
  );
}

export default EditPost;