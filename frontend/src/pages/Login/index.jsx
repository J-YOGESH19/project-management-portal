import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Toast from "../../components/Toast";
import "./login.css";

const EyeIcon = ({ off }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {off ? (
      <>
        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-6 0-10-7-10-7a18.6 18.6 0 0 1 4.22-5.06M9.9 4.24A10.4 10.4 0 0 1 12 4c6 0 10 7 10 7a18.6 18.6 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24" />
        <path d="M1 1l22 22" />
      </>
    ) : (
      <>
        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    )}
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const FEATURES = ["AI Task Generation", "Dashboard Analytics", "Activity Timeline", "Secure JWT Authentication"];

const TICKER = [
  { icon: "✅", text: 'Completed "Design landing page"' },
  { icon: "🆕", text: 'Created "Fix login bug"' },
  { icon: "✏️", text: 'Updated "API integration"' },
];

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const next = {};
    if (!formData.email.trim()) next.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) next.email = "Enter a valid email";
    if (!formData.password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await login(formData.email, formData.password, remember);
      setToast({ type: "success", message: `Welcome back, ${data.name.split(" ")[0]}.` });
      setTimeout(() => navigate("/dashboard"), 600);
    } catch (err) {
      setToast({ type: "error", message: err.response?.data?.message || "Login failed. Check your credentials." });
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

          <h1 className="pmp-auth-headline">Manage tasks smarter with AI-powered tracking</h1>
          <p className="pmp-auth-sub">
            Manage tasks smarter with AI-powered project tracking and productivity insights.
          </p>

          <ul className="pmp-feature-list">
            {FEATURES.map((f) => (
              <li key={f}>
                <span className="pmp-feature-check"><CheckIcon /></span>
                {f}
              </li>
            ))}
          </ul>

          <div className="pmp-ticker">
            <span className="pmp-ticker-label">Live activity</span>
            <div className="pmp-ticker-track">
              {TICKER.map((item, i) => (
                <div className="pmp-ticker-item" key={i} style={{ animationDelay: `${i * 4}s` }}>
                  <span>{item.icon}</span> {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pmp-auth-form-panel">
        <div className="pmp-auth-form-card">
          <div className="pmp-auth-form-header">
            <h2>Welcome back</h2>
            <p>Log in to manage your tasks</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="pmp-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                className={`pmp-input ${errors.email ? "is-invalid" : ""}`}
                value={formData.email}
                onChange={handleChange}
                placeholder="you@company.com"
                autoComplete="email"
              />
              {errors.email && <span className="pmp-error">{errors.email}</span>}
            </div>

            <div className="pmp-field">
              <label htmlFor="password">Password</label>
              <div className="pmp-input-wrap">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={`pmp-input ${errors.password ? "is-invalid" : ""}`}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="pmp-input-icon-btn"
                  onClick={() => setShowPassword((p) => !p)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  <EyeIcon off={showPassword} />
                </button>
              </div>
              {errors.password && <span className="pmp-error">{errors.password}</span>}
            </div>

            <div className="pmp-field-row">
              <label className="pmp-checkbox">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="pmp-link">Forgot password?</Link>
            </div>

            <button type="submit" className="pmp-btn-primary" disabled={loading}>
              {loading ? <span className="pmp-spinner" /> : "Login"}
            </button>
          </form>

          <p className="pmp-auth-footer">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>

      <Toast type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />
    </div>
  );
};

export default Login;