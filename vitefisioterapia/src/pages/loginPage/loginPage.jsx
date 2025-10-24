import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./loginPage.css";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import Swal from "sweetalert2";
import { auth, db, GoogleProvider } from "../../firebase";


function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const cardRef = useRef(null);
  const formRef = useRef(null);

  // --- Helpers ---
  const pad = (v) => String(v).padStart(2, "0");

  const formatFechaYY = (date = new Date()) => {
    const dd = pad(date.getDate());
    const mm = pad(date.getMonth() + 1);
    const yy = String(date.getFullYear()).slice(-2); // two-digit year
    return `${dd}/${mm}/${yy}`;
  };

  const formatHora = (date = new Date()) => {
    const hh = pad(date.getHours());
    const mm = pad(date.getMinutes());
    const ss = pad(date.getSeconds());
    return `${hh}:${mm}:${ss}`;
  };

  // --- Input handlers & validation ---
  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    clearError(e.target.name);
  };

  const validateEmail = () => {
    const email = (formData.email || "").trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      showError("email", "Email is required");
      return false;
    }
    if (!emailRegex.test(email)) {
      showError("email", "Please enter a valid email");
      return false;
    }
    clearError("email");
    return true;
  };

  const validatePassword = () => {
    const password = formData.password || "";
    if (!password) {
      showError("password", "Password is required");
      return false;
    }
    if (password.length < 6) {
      showError("password", "Password must be at least 6 characters");
      return false;
    }
    clearError("password");
    return true;
  };

  const showError = (field, message) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
    const input = document.getElementById(field);
    if (input) {
      input.style.animation = "gentleShake 0.5s ease-in-out";
      setTimeout(() => (input.style.animation = ""), 500);
    }
  };

  const clearError = (field) => {
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  };

  // --- Animations / UI helpers ---
  const animateSoftPress = (element) => {
    if (!element) return;
    element.style.transform = "scale(0.95)";
    setTimeout(() => (element.style.transform = "scale(1)"), 150);
  };

  const handlePasswordToggle = () => {
    setShowPassword((s) => !s);
    animateSoftPress(document.getElementById("passwordToggle"));
  };

  const updateAmbientLight = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const angleX = (x - centerX) / centerX;
    const angleY = (y - centerY) / centerY;
    const shadowX = angleX * 30;
    const shadowY = angleY * 30;
    cardRef.current.style.boxShadow = `
      ${shadowX}px ${shadowY}px 60px #bec3cf,
      ${-shadowX}px ${-shadowY}px 60px #ffffff
    `;
  };

  const setLoading = (loading) => {
    setIsLoading(loading);
    const socialButtons = document.querySelectorAll(".neu-social");
    socialButtons.forEach((b) => {
      b.style.pointerEvents = loading ? "none" : "auto";
      b.style.opacity = loading ? "0.6" : "1";
    });
  };

  // --- Firebase login + registro en login_history ---
  const handleSubmit = async (e) => {
    e && e.preventDefault();

    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    if (!isEmailValid || !isPasswordValid) {
      animateSoftPress(document.querySelector(".login-btn"));
      return;
    }

    setLoading(true);

    try {
      const emailLower = formData.email.toLowerCase();
      const userCred = await signInWithEmailAndPassword(auth, emailLower, formData.password);

      // Registrar en Firestore colección 'login_history'
      try {
        const fecha = formatFechaYY(new Date());
        const hora = formatHora(new Date());
        await addDoc(collection(db, "login_history"), {
          uid: userCred.user.uid,
          email: userCred.user.email,
          fecha,
          hora,
        });
      } catch (regErr) {
        // No rompemos el flujo por error al registrar el historial; lo logueamos
        console.error("Error registrando en login_history:", regErr);
      }

      // Mostrar success y redirigir
      showNeumorphicSuccess();
      setTimeout(() => {
        navigate("/DashboardPage");
      }, 1400);
    } catch (error) {
      console.error("Login error:", error);
      let msg = "Login failed. Please try again.";
      if (error.code === "auth/user-not-found") msg = "User not found. Please check your email.";
      else if (error.code === "auth/wrong-password") msg = "Incorrect password. Try again.";
      else if (error.code === "auth/too-many-requests") msg = "Too many attempts. Please try later.";
      else if (error.code === "auth/invalid-email") msg = "Invalid email address.";
      Swal.fire("Error", msg, "error");
    } finally {
      setLoading(false);
    }
  };

  // --- Success animation ---
  const showNeumorphicSuccess = () => {
    if (formRef.current) {
      formRef.current.style.transform = "scale(0.95)";
      formRef.current.style.opacity = "0";
    }
    setTimeout(() => {
      setShowSuccess(true);
      const successIcon = document.querySelector(".success-icon.neu-icon");
      if (successIcon) successIcon.style.animation = "successPulse 0.6s ease-out";
    }, 300);
  };

  const handleSocialLogin = async (provider, button) => {
    animateSoftPress(button);
    button.style.pointerEvents = "none";
    button.style.opacity = "0.7";
  
    try {
      await new Promise((r) => setTimeout(r, 600));
  
      if (provider === "Google") {
        const result = await signInWithPopup(auth, GoogleProvider);
        const user = result.user;
  
        Swal.fire({
          icon: "success",
          title: "Inicio de sesión exitoso",
          text: `Bienvenido, ${user.displayName}`,
          timer: 1500,
          showConfirmButton: false,
        });
  
        setTimeout(() => {
          navigate("/DashboardPage");
        }, 1500);
      } else {
        Swal.fire("Info", `${provider} login not configured yet.`, "info");
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error al iniciar sesión",
        text: err.message,
      });
    } finally {
      button.style.pointerEvents = "auto";
      button.style.opacity = "1";
    }
  };
  

  // --- Effects: ambient light + keyframes injection ---
  useEffect(() => {
    const handleMouseMove = (e) => updateAmbientLight(e);
    document.addEventListener("mousemove", handleMouseMove);

    if (!document.querySelector("#neu-keyframes")) {
      const style = document.createElement("style");
      style.id = "neu-keyframes";
      style.textContent = `
        @keyframes gentleShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
        }
        @keyframes successPulse {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // --- Input focus handlers mimicking original JS soft press ---
  const handleFocus = (e) => {
    const inputGroup = e.target.closest(".neu-input");
    if (inputGroup) inputGroup.style.transform = "scale(0.98)";
  };
  const handleBlur = (e) => {
    const inputGroup = e.target.closest(".neu-input");
    if (inputGroup) inputGroup.style.transform = "scale(1)";
  };

  return (
    <div className="login-container">
      <div className="login-card" ref={cardRef}>
        <div className="login-header">
          <div className="neu-icon">
            <div className="icon-inner">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          </div>
          <h2>Login</h2>
          <p>Please sign in to continue</p>
        </div>

        {!showSuccess ? (
          <div ref={formRef}>
            <form className="login-form" id="loginForm" noValidate onSubmit={handleSubmit}>
              {/* Email */}
              <div className="form-group">
                <div className="input-group neu-input">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={validateEmail}
                    onFocus={handleFocus}
                    placeholder=" "
                    autoComplete="email"
                    required
                  />
                  <label htmlFor="email">Email address</label>
                  <div className="input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                </div>
                <span className={`error-message ${errors.email ? "show" : ""}`} id="emailError">
                  {errors.email}
                </span>
              </div>

              {/* Password */}
              <div className="form-group">
                <div className="input-group neu-input password-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={validatePassword}
                    onFocus={handleFocus}
                    placeholder=" "
                    autoComplete="current-password"
                    required
                  />
                  <label htmlFor="password">Password</label>
                  <div className="input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  </div>

                  <button
                    type="button"
                    id="passwordToggle"
                    className={`password-toggle neu-toggle ${showPassword ? "show-password" : ""}`}
                    onClick={handlePasswordToggle}
                    aria-label="Toggle password visibility"
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <svg className="eye-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    <svg className="eye-closed" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  </button>
                </div>
                <span className={`error-message ${errors.password ? "show" : ""}`} id="passwordError">
                  {errors.password}
                </span>
              </div>

              {/* Options */}
              <div className="form-options">
                <div className="remember-wrapper">
                  <input type="checkbox" id="remember" name="remember" />
                  <label htmlFor="remember" className="checkbox-label">
                    <div className="neu-checkbox">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    Remember me
                  </label>
                </div>
                <a href="#" className="forgot-link" onClick={(e) => e.preventDefault()}>
                  Forgot password?
                </a>
              </div>

              <button type="submit" className={`neu-button login-btn ${isLoading ? "loading" : ""}`} disabled={isLoading}>
                <span className="btn-text">Sign In</span>
                <div className="btn-loader">
                  <div className="neu-spinner" />
                </div>
              </button>
            </form>

            <div className="divider">
              <div className="divider-line" />
              <span>or continue with</span>
              <div className="divider-line" />
            </div>

            <div className="social-login">
              <button type="button" className="social-btn neu-social" onClick={(e) => handleSocialLogin("Google", e.currentTarget)}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              </button>

              <button type="button" className="social-btn neu-social" onClick={(e) => handleSocialLogin("GitHub", e.currentTarget)}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.56v-2.02C6.73 20.9 6.14 19.3 6.14 19.3c-.52-1.32-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.25 3.33.95.1-.74.4-1.25.72-1.54-2.66-.3-5.46-1.33-5.46-5.92 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1-.32 3.3 1.23A11.5 11.5 0 0112 6.8c1.02 0 2.05.14 3.01.4 2.29-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.41.36.78 1.07.78 2.16v3.2c0 .31.2.68.79.56C20.71 21.39 24 17.08 24 12c0-6.35-5.15-11.5-11.99-11.5z" />
                </svg>
              </button>

            </div>

            <div className="signup-link">
              <p>
                Don't have an account? <Link to="/register">Sign up</Link>
              </p>
            </div>
          </div>
        ) : (
          <div className="success-message show" id="successMessage">
            <div className="success-icon neu-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3>Success!</h3>
            <p>Redirecting to your dashboard...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
