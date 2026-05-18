import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import "./Login.css";

function Login() {
  const navigate         = useNavigate();
  const { login, register } = useAuth();
  const { showToast }    = useToast(); // ✅ Toast

  const [isLogin, setIsLogin]   = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false); // ✅ Loading state

  const handleSubmit = async () => {
    if (!username || !password || (!isLogin && !email)) {
      showToast("Please fill all fields", "error");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(username, password);
        showToast("Welcome back! 🍕", "success");
        navigate("/home");
      } else {
        const res = await fetch("http://localhost:5000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();

        if (res.ok) {
          showToast("✅ Registered! Ab login karo.", "success");
          setUsername(""); setEmail(""); setPassword("");
          setIsLogin(true);
        } else {
          showToast(data.message || "Registration failed", "error");
        }
      }
    } catch (err) {
      showToast(err.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  // Enter key support
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div
      className="login-bg"
      style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/background/background2.jpg)` }}
    >
      <div className="login-container">
        <h2>{isLogin ? "Login" : "Register"}</h2>

        <div className="form-container">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />

          {!isLogin && (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
          )}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />

          {/* ✅ Loading button */}
          <button onClick={handleSubmit} disabled={loading}>
            {loading
              ? (isLogin ? "⏳ Logging in..." : "⏳ Registering...")
              : (isLogin ? "Login" : "Register")
            }
          </button>

          <p className="toggle-form">
            <span
              className="toggle-link"
              onClick={() => { if (!loading) setIsLogin(!isLogin); }}
            >
              {isLogin ? "New user? Register here" : "Already registered? Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;