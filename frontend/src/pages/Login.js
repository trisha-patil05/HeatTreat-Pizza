import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    if (!username || !password || (!isLogin && !email)) {
      setError("Please fill all fields");
      return;
    }

    try {
      if (isLogin) {
        await login(username, password);
        navigate("/home");
      } else {
        // Register via direct fetch (AuthContext ka register alag hai)
        const res = await fetch("http://localhost:5000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password })
        });

        const data = await res.json();

        if (res.ok) {
          setUsername("");
          setEmail("");
          setPassword("");
          setIsLogin(true);
          setError("✅ Registered! Ab login karo.");
        } else {
          setError(data.message || "Registration failed");
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div
      className="login-bg"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/background/background2.jpg)`
      }}
    >
      <div className="login-container">
        <h2>{isLogin ? "Login" : "Register"}</h2>

        <div className="form-container">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {!isLogin && (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p style={{ color: error.startsWith("✅") ? "green" : "red", textAlign: "center", marginTop: "8px" }}>
              {error}
            </p>
          )}

          <button onClick={handleSubmit}>
            {isLogin ? "Login" : "Register"}
          </button>

          <p className="toggle-form">
            <span className="toggle-link" onClick={() => { setIsLogin(!isLogin); setError(""); }}>
              {isLogin ? "New user? Register here" : "Already registered? Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;