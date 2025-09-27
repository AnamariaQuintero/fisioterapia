import { Link } from 'react-router-dom';
import './recoverPassword.css';
import React, { useState, useEffect, useRef } from 'react';


function RecoverPassword() {
  const [formData, setFormData] = useState({
    email: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const cardRef = useRef(null);
  const formRef = useRef(null);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      clearError(name);
    }
  };

   // Validation functions
   const validateEmail = () => {
    const email = formData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      showError('email', 'Email is required');
      return false;
    }
    
    if (!emailRegex.test(email)) {
      showError('email', 'Please enter a valid email');
      return false;
    }
    
    clearError('email');
    return true;
  };

  // Error handling
  const showError = (field, message) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  };

  const clearError = (field) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

   // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isPasswordValid = validatePassword();
    
    if (!isEmailValid || !isPasswordValid) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate soft authentication
      await new Promise(resolve => setTimeout(resolve, 2000));
      showNeumorphicSuccess();
    } catch (error) {
      showError('password', 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Success animation
  const showNeumorphicSuccess = () => {
    if (formRef.current) {
      formRef.current.style.transform = 'scale(0.95)';
      formRef.current.style.opacity = '0';
    }
    
    setTimeout(() => {
      setShowSuccess(true);
      
      // Simulate redirect
      setTimeout(() => {
        console.log('Redirecting to dashboard...');
        // window.location.href = '/dashboard';
      }, 2500);
    }, 300);
  };


  // Ambient light effect
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

  // Effects
  useEffect(() => {
    const handleMouseMove = (e) => updateAmbientLight(e);
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="login-container">
      <div className="login-card" ref={cardRef}>
        <div className="login-header">
          <div className="neu-icon">
            <div className="icon-inner">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
          </div>
          <h2>Forgot Password</h2>
          <p>Confirme su correo para el cambio de contraseña</p>
        </div>
        
        {!showSuccess ? (
          <div ref={formRef}>
            <div className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <div className="input-group neu-input">
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={validateEmail}
                    required 
                    autoComplete="email" 
                    placeholder=" " 
                  />
                  <label htmlFor="email">Email address</label>
                  <div className="input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                </div>
                <span className={`error-message ${errors.email ? 'show' : ''}`} id="emailError">
                  {errors.email}
                </span>

                <Link to="/ForgotPassword" className="forgot-link">Ir al cambio de contraseña</Link>

              </div>

              <button 
                type="submit" 
                className={`neu-button login-btn ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
                onClick={handleSubmit}
              >
                <span className="btn-text">Sign In</span>
                <div className="btn-loader">
                  <div className="neu-spinner"></div>
                </div>
              </button>
            </div>

            <div className="signup-link">
              <p>Don't have an account? <Link to="/">Sign up</Link></p>
            </div>
          </div>
        ) : (
          <div className="success-message show" id="successMessage">
            <div className="success-icon neu-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"/>
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

export default RecoverPassword;