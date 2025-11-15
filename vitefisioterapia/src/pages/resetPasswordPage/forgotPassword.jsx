import { Link } from 'react-router-dom';
import './recoverPassword.css';
import React, { useState, useEffect, useRef } from 'react';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../../firebase';

function RecoverPassword() {
  const [formData, setFormData] = useState({ email: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const cardRef = useRef(null);
  const formRef = useRef(null);

  const handleInputChange = (e) => {
    setFormData({ email: e.target.value });
    if (errors.email) clearError("email");
  };

  const validateEmail = () => {
    const email = formData.email.trim();
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

  const showError = (field, msg) => setErrors(prev => ({ ...prev, [field]: msg }));
  const clearError = (field) => setErrors(prev => {
    const newErr = { ...prev };
    delete newErr[field];
    return newErr;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail()) return;

    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, formData.email);
      showNeumorphicSuccess();
    } catch (error) {
      showError("email", "Email not found or invalid");
    } finally {
      setIsLoading(false);
    }
  };

  const showNeumorphicSuccess = () => {
    if (formRef.current) {
      formRef.current.style.transform = 'scale(0.95)';
      formRef.current.style.opacity = '0';
    }

    setTimeout(() => {
      setShowSuccess(true);
    }, 300);
  };

  return (
    <div className="login-container">
      <div className="login-card" ref={cardRef}>
        
        {/* tu diseño intacto */}
        <div className="login-header">
          <h2>Forgot Password</h2>
          <p>Confirme su correo para el cambio de contraseña</p>
        </div>

        {!showSuccess ? (
          <div ref={formRef}>
            <div className="login-form">
              <div className="form-group">
                <div className="input-group neu-input">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={validateEmail}
                    placeholder=" "
                  />
                  <label>Email address</label>
                  <div className="input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                </div>
                <span className="error-message">{errors.email}</span>
              </div>

              <button 
                className={`neu-button login-btn ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
                onClick={handleSubmit}
              >
                <span className="btn-text">Enviar correo</span>
              </button>

            </div>
          </div>
        ) : (
          <div className="success-message show">
            <h3>Correo enviado</h3>
            <p>Revise su bandeja de entrada</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default RecoverPassword;
