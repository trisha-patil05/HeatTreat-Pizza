import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import "./Login.css";

function Login() {
  const navigate  = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState("login"); // login | register | forgot | verify | reset

  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);

  const [fpEmail, setFpEmail]         = useState("");
  const [otp, setOtp]                 = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPw, setConfirmPw]     = useState("");

  const handleSubmit = async () => {
    if (!username || !password || (mode === "register" && !email)) {
      showToast("Please fill all fields", "error"); return;
    }
    setLoading(true);
    try {
      if (mode === "login") {
        await login(username, password);
        showToast("Welcome back! 🍕", "success");
        navigate("/home");
      } else {
        const res  = await fetch("http://localhost:5000/api/auth/register", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();
        if (res.ok) {
          showToast("✅ Registered! Ab login karo.", "success");
          setUsername(""); setEmail(""); setPassword(""); setMode("login");
        } else {
          showToast(data.message || "Registration failed", "error");
        }
      }
    } catch (err) {
      showToast(err.message || "Something went wrong", "error");
    } finally { setLoading(false); }
  };

  const handleSendOtp = async () => {
    if (!fpEmail.trim()) { showToast("Email daalo!", "error"); return; }
    setLoading(true);
    try {
      const res  = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fpEmail })
      });
      const data = await res.json();
      if (res.ok) { showToast("✅ OTP bheja gaya! Email check karo.", "success"); setMode("verify"); }
      else showToast(data.message || "Email nahi mila", "error");
    } catch { showToast("Something went wrong", "error"); }
    finally { setLoading(false); }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) { showToast("OTP daalo!", "error"); return; }
    setLoading(true);
    try {
      const res  = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fpEmail, otp })
      });
      const data = await res.json();
      if (res.ok) { showToast("✅ OTP verified!", "success"); setMode("reset"); }
      else showToast(data.message || "Wrong OTP", "error");
    } catch { showToast("Something went wrong", "error"); }
    finally { setLoading(false); }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPw)    { showToast("Sab fields fill karo!", "error"); return; }
    if (newPassword !== confirmPw)     { showToast("Passwords match nahi!", "error"); return; }
    if (newPassword.length < 6)        { showToast("6+ characters chahiye!", "error"); return; }
    setLoading(true);
    try {
      const res  = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fpEmail, otp, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        showToast("✅ Password reset ho gaya! Login karo.", "success");
        setMode("login"); setFpEmail(""); setOtp(""); setNewPassword(""); setConfirmPw("");
      } else showToast(data.message || "Reset failed", "error");
    } catch { showToast("Something went wrong", "error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="login-bg" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/background/background2.jpg)` }}>
      <div className="login-container">

        {/* LOGIN */}
        {mode === "login" && (
          <>
            <h2>Login</h2>
            <div className="form-container">
              <input type="text" placeholder="Username" value={username}
                onChange={e => setUsername(e.target.value)} onKeyDown={e => e.key==="Enter"&&handleSubmit()} disabled={loading} />
              <input type="password" placeholder="Password" value={password}
                onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key==="Enter"&&handleSubmit()} disabled={loading} />
              <button onClick={handleSubmit} disabled={loading}>
                {loading ? "⏳ Logging in..." : "Login"}
              </button>
              <p style={{ textAlign:"center", margin:"8px 0 0" }}>
                <span className="toggle-link" onClick={() => setMode("forgot")}>🔑 Forgot Password?</span>
              </p>
              <p className="toggle-form">
                <span className="toggle-link" onClick={() => setMode("register")}>New user? Register here</span>
              </p>
            </div>
          </>
        )}

        {/* REGISTER */}
        {mode === "register" && (
          <>
            <h2>Register</h2>
            <div className="form-container">
              <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} disabled={loading} />
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} disabled={loading} />
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} disabled={loading} />
              <button onClick={handleSubmit} disabled={loading}>{loading ? "⏳ Registering..." : "Register"}</button>
              <p className="toggle-form">
                <span className="toggle-link" onClick={() => setMode("login")}>Already registered? Login</span>
              </p>
            </div>
          </>
        )}

        {/* FORGOT — Enter Email */}
        {mode === "forgot" && (
          <>
            <h2>🔑 Forgot Password</h2>
            <div className="form-container">
              <p style={{ color:"#94a3b8", fontSize:"13px", textAlign:"center", marginBottom:"12px" }}>
                Registered email daalo — OTP bhejenge!
              </p>
              <input type="email" placeholder="Registered Email" value={fpEmail}
                onChange={e => setFpEmail(e.target.value)} disabled={loading} />
              <button onClick={handleSendOtp} disabled={loading}>
                {loading ? "⏳ Sending OTP..." : "📧 Send OTP"}
              </button>
              <p className="toggle-form">
                <span className="toggle-link" onClick={() => setMode("login")}>← Wapas Login pe</span>
              </p>
            </div>
          </>
        )}

        {/* VERIFY OTP */}
        {mode === "verify" && (
          <>
            <h2>✉️ Verify OTP</h2>
            <div className="form-container">
              <p style={{ color:"#94a3b8", fontSize:"13px", textAlign:"center", marginBottom:"12px" }}>
                OTP bheja: <strong style={{ color:"#f97316" }}>{fpEmail}</strong>
              </p>
              <input type="text" placeholder="6-digit OTP" value={otp} maxLength={6}
                onChange={e => setOtp(e.target.value)} disabled={loading}
                style={{ letterSpacing:"8px", textAlign:"center", fontSize:"20px" }} />
              <button onClick={handleVerifyOtp} disabled={loading}>
                {loading ? "⏳ Verifying..." : "✅ Verify OTP"}
              </button>
              <p style={{ textAlign:"center", margin:"8px 0 0" }}>
                <span className="toggle-link" onClick={() => { setMode("forgot"); setOtp(""); }}>
                  OTP nahi aaya? Dobara bhejo
                </span>
              </p>
            </div>
          </>
        )}

        {/* RESET PASSWORD */}
        {mode === "reset" && (
          <>
            <h2>🔒 New Password</h2>
            <div className="form-container">
              <input type="password" placeholder="New Password" value={newPassword}
                onChange={e => setNewPassword(e.target.value)} disabled={loading} />
              <input type="password" placeholder="Confirm Password" value={confirmPw}
                onChange={e => setConfirmPw(e.target.value)} disabled={loading} />
              {newPassword && (
                <div style={{
                  padding:"6px 12px", borderRadius:"6px", fontSize:"12px",
                  background: newPassword.length>=8?"rgba(16,185,129,0.1)":newPassword.length>=6?"rgba(249,115,22,0.1)":"rgba(239,68,68,0.1)",
                  color: newPassword.length>=8?"#10b981":newPassword.length>=6?"#f97316":"#ef4444"
                }}>
                  Strength: {newPassword.length>=8?"Strong 💪":newPassword.length>=6?"Medium 👍":"Weak ⚠️"}
                </div>
              )}
              <button onClick={handleResetPassword} disabled={loading}>
                {loading ? "⏳ Resetting..." : "🔒 Reset Password"}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default Login;