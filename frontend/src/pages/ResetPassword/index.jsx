import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import authService from "../../services/authService";
import Toast from "../../components/Toast";
import "../Login/login.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setToast({ type: "error", message: "Password must be at least 6 characters" });
      return;
    }
    if (password !== confirmPassword) {
      setToast({ type: "error", message: "Passwords don't match" });
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword(token, password);
      setToast({ type: "success", message: "Password updated. Redirecting to login..." });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setToast({ type: "error", message: err.response?.data?.message || "Reset link is invalid or expired" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pmp-auth">
      <div className="pmp-auth-brand">
        <div className="pmp-auth-brand-glow" />
        <div className="pmp-auth-brand-inner">
          <div className="pmp-logo">
            <span className="pmp-logo-mark">PM</span>
            <span className="pmp-logo-word">Project Management Portal</span>
          </div>
          <h1 className="pmp-auth-headline">Set a new password</h1>
          <p className="pmp-auth-sub">Choose a strong password you haven't used before.</p>
        </div>
      </div>

      <div className="pmp-auth-form-panel">
        <div className="pmp-auth-form-card">
          <div className="pmp-auth-form-header">
            <h2>New password</h2>
            <p>Enter and confirm your new password</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="pmp-field">
              <label htmlFor="password">New password</label>
              <input id="password" type="password" className="pmp-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="new-password" />
            </div>
            <div className="pmp-field">
              <label htmlFor="confirmPassword">Confirm password</label>
              <input id="confirmPassword" type="password" className="pmp-input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" autoComplete="new-password" />
            </div>
            <button type="submit" className="pmp-btn-primary" disabled={loading}>
              {loading ? <span className="pmp-spinner" /> : "Update password"}
            </button>
          </form>
          <p className="pmp-auth-footer">
            <Link to="/login">Back to login</Link>
          </p>
        </div>
      </div>

      <Toast type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />
    </div>
  );
};

export default ResetPassword;