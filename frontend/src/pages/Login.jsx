import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Toast from "../components/Toast";

const API = "http://localhost:4000/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch(API + "/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

if (res.ok) {
  setToast({ message: "Login successful", type: "success" });

  localStorage.setItem("token", data.token);
  localStorage.setItem("userId", data.user.id);
  localStorage.setItem("userName", data.user.name);
  localStorage.setItem("userEmail", data.user.email);

  setTimeout(() => {
    navigate("/");
  }, 1200);

} else {
  setToast({ message: data.message || "Login failed", type: "error" });
}
  };

  return (
    <>
    {toast && (
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(null)}
     />
    )}
     
    <div className="container">

      <h2>Login</h2>

      <form onSubmit={handleLogin} className="form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="btn">Login</button>
      </form>

      <p>
        Don't have an account? <Link to="/signup">Register</Link>
      </p>
    </div>
</>
);
}
export default Login;