import { Link, useSearchParams } from 'react-router-dom';
import './recoverPassword.css';
import React, { useState } from 'react';
import { confirmPasswordReset } from "firebase/auth";
import { auth } from '../../firebase';


function ResetPassword() {
  const [params] = useSearchParams();
  const oobCode = params.get("oobCode");

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) clearError(e.target.name);
  };

  const validatePassword = () => {
    if (!formData.password) {
      showError("password", "Password required");
      return false;
    }
    if (formData.password.length < 6) {
      showError("password", "Minimum 6 characters");
      return false;
    }
    return true;
  };

  const validateConfirmPassword = () => {
    if (formData.password !== formData.confirmPassword) {
      showError("confirmPassword", "Passwords do not match");
      return false;
    }
    return true;
  };

  const showError = (field, msg) =>
    setErrors(prev => ({ ...prev, [field]: msg }));

  const clearError = (field) =>
    setErrors(prev => {
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword() || !validateConfirmPassword()) return;

    setIsLoading(true);

    try {
      await confirmPasswordReset(auth, oobCode, formData.password);
      setShowSuccess(true);
    } catch (error) {
      showError("password", "Invalid or expired reset link");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <div className="login-header">
          <h2>Reset Password</h2>
          <p>Cambie su contraseña</p>
        </div>

        {!showSuccess ? (
          <>
            <div className="login-form">
              
            <div className="form-group">
              <div className="input-group neu-input password-group">

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder=" "
                />
                <label>Password</label>
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
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  
                  <svg
                    style={{ flexShrink: 0 }}
                    className="eye-open"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>

                  <svg
                    className="eye-closed"
                    style={{ flexShrink: 0 }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                </button>

              </div>

              <span className="error-message">{errors.password}</span>
            </div>


              <div className="form-group">
                <div className="input-group neu-input password-group">

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder=" "
                  />
                  <label>Confirm password</label>
                  <div className="input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  </div>
                  <button
                    type="button"
                    className={`password-toggle neu-toggle ${showConfirmPassword ? "show-password" : ""}`}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label="Toggle password visibility"
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {/* 👁 Ojo abierto */}
                    <svg
                      style={{ flexShrink: 0 }}
                      className="eye-open"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>

                    {/* 👁 Ojo cerrado */}
                    <svg
                      className="eye-closed"
                      style={{ flexShrink: 0 }}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  </button>

                </div>

                <span className="error-message">{errors.confirmPassword}</span>
              </div>


              <button 
                className={`neu-button login-btn ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
                onClick={handleSubmit}
              >
                Cambiar contraseña
              </button>

            </div>
          </>
        ) : (
          <div className="success-message show">
            <h3>Contraseña cambiada</h3>
            <p>Ahora puede iniciar sesión</p>

            <Link 
              to="/"
              className="neu-button login-btn"
              style={{ marginTop: "20px", display: "inline-block", textDecoration: "none" }}
            >
              Iniciar sesión
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}

export default ResetPassword;
