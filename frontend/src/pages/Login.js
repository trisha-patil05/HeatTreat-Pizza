import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 const handleSubmit = async () => {
  try {
    if (!username || !password || (!isLogin && !email)) {
      alert("Please fill all fields");
      return;
    }

    const url = isLogin
      ? "http://localhost:5000/api/auth/login"
      : "http://localhost:5000/api/auth/register";

    const bodyData = isLogin
      ? { username, password }
      : { username, email, password };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bodyData)
    });

    const text = await res.text();
    console.log("Raw response:", text);

    let data = {};
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error("Backend did not return valid JSON");
    }

    if (res.ok) {
      alert(data.message);

      if (isLogin) {
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/home");
      } else {
        setUsername("");
        setEmail("");
        setPassword("");
        setIsLogin(true);
      }
    } else {
      alert(data.message || "Something went wrong");
    }
  } catch (error) {
    console.error("Frontend error:", error);
    alert(error.message || "Server error");
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

          <button onClick={handleSubmit}>
            {isLogin ? "Login" : "Register"}
          </button>

          <p className="toggle-form">
            <span
              className="toggle-link"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin
                ? "New user? Register here"
                : "Already registered? Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;