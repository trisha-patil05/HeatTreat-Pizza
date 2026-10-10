import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");

  const [username, setUsername] = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const [fpEmail,      setFpEmail]      = useState("");
  const [otp,          setOtp]          = useState("");
  const [newPassword,  setNewPassword]  = useState("");
  const [confirmPw,    setConfirmPw]    = useState("");

  const showError = (msg) => { setError(msg); setTimeout(() => setError(""), 3000); };

  // Login
  const handleLogin = async () => {
    if (!username || !password) { showError("Please fill all fields"); return; }
    setLoading(true);
    try {
      const res  = await fetch("https://heattreat-backend.onrender.com/api/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) { showError(data.message || "Login failed"); return; }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user",  JSON.stringify(data.user));
      navigate(data.user?.role === "admin" ? "/admin-dashboard" : "/home");
    } catch { showError("Something went wrong"); }
    finally { setLoading(false); }
  };

  // Register
  const handleRegister = async () => {
    if (!username || !email || !password) { showError("Please fill all fields"); return; }
    setLoading(true);
    try {
      const res  = await fetch("https://heattreat-backend.onrender.com/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      if (!res.ok) { showError(data.message || "Registration failed"); return; }
      showError(""); setMode("login");
      setUsername(""); setEmail(""); setPassword("");
    } catch { showError("Something went wrong"); }
    finally { setLoading(false); }
  };

  // Send OTP
  const handleSendOtp = async () => {
    if (!fpEmail.trim()) { showError("Email daalo!"); return; }
    setLoading(true);
    try {
      const res  = await fetch("https://heattreat-backend.onrender.com/api/auth/forgot-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fpEmail })
      });
      const data = await res.json();
      if (!res.ok) { showError(data.message || "Email nahi mila"); return; }
      setMode("verify");
    } catch { showError("Something went wrong"); }
    finally { setLoading(false); }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp.trim()) { showError("OTP daalo!"); return; }
    setLoading(true);
    try {
      const res  = await fetch("https://heattreat-backend.onrender.com/api/auth/verify-otp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fpEmail, otp })
      });
      const data = await res.json();
      if (!res.ok) { showError(data.message || "Wrong OTP"); return; }
      setMode("reset");
    } catch { showError("Something went wrong"); }
    finally { setLoading(false); }
  };

  // Reset Password
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPw) { showError("Sab fields fill karo!"); return; }
    if (newPassword !== confirmPw)  { showError("Passwords match nahi!"); return; }
    if (newPassword.length < 6)     { showError("6+ characters chahiye!"); return; }
    setLoading(true);
    try {
      const res  = await fetch("https://heattreat-backend.onrender.com/api/auth/reset-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fpEmail, otp, newPassword })
      });
      const data = await res.json();
      if (!res.ok) { showError(data.message || "Reset failed"); return; }
      setMode("login"); setFpEmail(""); setOtp(""); setNewPassword(""); setConfirmPw("");
    } catch { showError("Something went wrong"); }
    finally { setLoading(false); }
  };

  const titles = { login: "Login", register: "Register", forgot: "🔑 Forgot Password", verify: "✉️ Verify OTP", reset: "🔒 New Password" };

  return (
    <div className="login-bg" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/background/background2.jpg)` }}>
      <div className="login-container">
        <h2>{titles[mode]}</h2>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '10px 14px', color: '#ef4444', fontSize: '13px', marginBottom: '14px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <div className="form-container">

          {/* LOGIN */}
          {mode === "login" && (
            <>
              <input type="text"     placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} disabled={loading} />
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} disabled={loading} />
              <button onClick={handleLogin} disabled={loading}>{loading ? "⏳ Logging in..." : "Login"}</button>
              <p style={{ textAlign: "center", marginTop: "6px" }}>
                <span className="toggle-link" onClick={() => setMode("forgot")}>🔑 Forgot Password?</span>
              </p>
              <p className="toggle-form">
                <span className="toggle-link" onClick={() => setMode("register")}>New user? Register here</span>
              </p>
            </>
          )}

          {/* REGISTER */}
          {mode === "register" && (
            <>
              <input type="text"     placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} disabled={loading} />
              <input type="email"    placeholder="Email"    value={email}    onChange={e => setEmail(e.target.value)}    disabled={loading} />
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} disabled={loading} />
              <button onClick={handleRegister} disabled={loading}>{loading ? "⏳ Registering..." : "Register"}</button>
              <p className="toggle-form">
                <span className="toggle-link" onClick={() => setMode("login")}>Already registered? Login</span>
              </p>
            </>
          )}

          {/* FORGOT */}
          {mode === "forgot" && (
            <>
              <p style={{ color: "#888", fontSize: "13px", textAlign: "center" }}>Registered email daalo — OTP bhejenge!</p>
              <input type="email" placeholder="Registered Email" value={fpEmail} onChange={e => setFpEmail(e.target.value)} disabled={loading} />
              <button onClick={handleSendOtp} disabled={loading}>{loading ? "⏳ Sending OTP..." : "📧 Send OTP"}</button>
              <p className="toggle-form"><span className="toggle-link" onClick={() => setMode("login")}>← Back to Login</span></p>
            </>
          )}

          {/* VERIFY OTP */}
          {mode === "verify" && (
            <>
              <p style={{ color: "#888", fontSize: "13px", textAlign: "center" }}>OTP sent to: <strong style={{ color: "#ff6600" }}>{fpEmail}</strong></p>
              <input type="text" placeholder="6-digit OTP" value={otp} maxLength={6}
                onChange={e => setOtp(e.target.value)} disabled={loading}
                style={{ letterSpacing: "8px", textAlign: "center", fontSize: "20px" }} />
              <button onClick={handleVerifyOtp} disabled={loading}>{loading ? "⏳ Verifying..." : "✅ Verify OTP"}</button>
              <p className="toggle-form"><span className="toggle-link" onClick={() => { setMode("forgot"); setOtp(""); }}>Resend OTP</span></p>
            </>
          )}

          {/* RESET */}
          {mode === "reset" && (
            <>
              <input type="password" placeholder="New Password"     value={newPassword} onChange={e => setNewPassword(e.target.value)} disabled={loading} />
              <input type="password" placeholder="Confirm Password" value={confirmPw}   onChange={e => setConfirmPw(e.target.value)}   disabled={loading} />
              {newPassword && (
                <div style={{
                  padding: "8px 12px", borderRadius: "8px", fontSize: "12px",
                  background: newPassword.length >= 8 ? "rgba(16,185,129,0.1)" : newPassword.length >= 6 ? "rgba(255,102,0,0.1)" : "rgba(239,68,68,0.1)",
                  color: newPassword.length >= 8 ? "#10b981" : newPassword.length >= 6 ? "#ff6600" : "#ef4444"
                }}>
                  Strength: {newPassword.length >= 8 ? "Strong 💪" : newPassword.length >= 6 ? "Medium 👍" : "Weak ⚠️"}
                </div>
              )}
              <button onClick={handleResetPassword} disabled={loading}>{loading ? "⏳ Resetting..." : "🔒 Reset Password"}</button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default Login;