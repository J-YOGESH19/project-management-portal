import { useState } from "react";
import { Link } from "react-router-dom";
import authService from "../../services/authService";
import Toast from "../../components/Toast";
import "../Login/login.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setToast({ type: "error", message: "Enter your email first" });
      return;
    }
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setToast({ type: "error", message: err.response?.data?.message || "Something went wrong" });
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
          <h1 className="pmp-auth-headline">Forgot your password?</h1>
          <p className="pmp-auth-sub">No problem. Enter the email on your account and we'll generate a reset link.</p>
        </div>
      </div>

      <div className="pmp-auth-form-panel">
        <div className="pmp-auth-form-card">
          {!submitted ? (
            <>
              <div className="pmp-auth-form-header">
                <h2>Reset password</h2>
                <p>We'll send a link to reset your password</p>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="pmp-field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    className="pmp-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    autoComplete="email"
                  />
                </div>
                <button type="submit" className="pmp-btn-primary" disabled={loading}>
                  {loading ? <span className="pmp-spinner" /> : "Send reset link"}
                </button>
              </form>
            </>
          ) : (
            <div className="pmp-auth-form-header">
              <h2>Check your email</h2>
              <p>If an account exists for {email}, a reset link has been sent. Check your inbox (and spam folder).</p>
            </div>
          )}
          <p className="pmp-auth-footer">
            Remembered it? <Link to="/login">Back to login</Link>
          </p>
        </div>
      </div>

      <Toast type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />
    </div>
  );
};

export default ForgotPassword;