import { Link } from 'react-router-dom';
import './recoverPassword.css';
import React, { useState, useEffect, useRef } from 'react';


function ForgotPassword() {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
  const validatePassword = () => {
    const password = formData.password;
    
    if (!password) {
      showError('password', 'Password is required');
      return false;
    }
    
    if (password.length < 6) {
      showError('password', 'Password must be at least 6 characters');
      return false;
    }
    
    clearError('password');
    return true;
  };


  const validateConfirmPassword = () => {
    const confirmPassword = formData.password;
    
    if (!confirmPassword) {
      showError('password', 'Password is required');
      return false;
    }
    
    if (confirmPassword.length < 6) {
      showError('password', 'Password must be at least 6 characters');
      return false;
    }
    
    clearError('confirmPassword');
    return true;
  };
  // Confirmar que las contraseñas son iguales
  // if(password !== confirmPassword){
  //   return Swal.fire("Las contraseñas no son iguales")
  // }

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

  // Password toggle
  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleConfirmPasswordToggle = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
          <p>Cambie su ocntraseña</p>
        </div>
        
        {!showSuccess ? (
          <div ref={formRef}>
            <div className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <div className="input-group neu-input password-group">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    id="password" 
                    name="password" 
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={validatePassword}
                    required 
                    autoComplete="current-password" 
                    placeholder=" " 
                  />
                  <label htmlFor="password">Password</label>
                  <div className="input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                  </div>
                  <button 
                    type="button" 
                    className={`password-toggle neu-toggle ${showPassword ? 'show-password' : ''}`}
                    onClick={handlePasswordToggle}
                    aria-label="Toggle password visibility"
                  >
                    <svg className="eye-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    <svg className="eye-closed" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  </button>
                </div>
                <span className={`error-message ${errors.password ? 'show' : ''}`} id="passwordError">
                  {errors.password}
                </span>
              </div>

              <div className="form-group">
                <div className="input-group neu-input password-group">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onBlur={validateConfirmPassword}
                    required 
                    autoComplete="current-password" 
                    placeholder=" " 
                  />
                  <label htmlFor="password">Confirm Password</label>
                  <div className="input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                  </div>
                  <button 
                    type="button" 
                    className={`password-toggle neu-toggle ${showConfirmPassword ? 'show-password' : ''}`}
                    onClick={handleConfirmPasswordToggle}
                    aria-label="Toggle password visibility"
                  >
                    <svg className="eye-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    <svg className="eye-closed" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  </button>
                </div>
                <span className={`error-message ${errors.password ? 'show' : ''}`} id="passwordError">
                  {errors.password}
                </span>
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

export default ForgotPassword;