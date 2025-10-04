import { Link, useNavigate } from 'react-router-dom';
import './registerPage.css';
import React, { useState, useEffect, useRef } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Await } from 'react-router-dom';
import { setDoc, doc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import { auth, db } from '../../firebase';
import { FaEye, FaEyeSlash} from 'react-icons/fa';

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    names: '', lastName: '', documentNumber: '', phone: '', email: '', password: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const cardRef = useRef(null);
  const formRef = useRef(null);

  // Handle input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };
  
  //validacion de la funcion nombre
  const validateNames = () => {
    const names = formData.names;
    const nameRegex = /^[^\d]+$/;

    if (!names) {
      showError('names', 'Name is required');
      return false;
    }

    if (!nameRegex.test(names)) {
      showError('names', 'El nombre no puede contener números');
      return false;
    }
      
    clearError('names');
    return true;
  };
  
  //validacion de la funcion apellido
    const validateLastName = () => {
    const lastName = formData.lastName;
    const lastNameRegex = /^[^\d]+$/;

    if (!lastName) {
      showError('lastName', 'Lastname is required');
      return false;
    }

    if (!lastNameRegex.test(lastName)) {
      showError('lastName', 'El lastname no puede contener números');
      return false;
    }
      
    clearError('lastName');
    return true;
  };
  //validacion de la funcion cc
  const validateDocumentNumber = () => {
    const documentNumber = formData.documentNumber;
    const documentNumberRegex = /^[0-9]+$/;
    
    if (!documentNumber) {
      showError('documentNumber', 'Document number is required');
      return false;
    }
    
    if (!documentNumberRegex.test(documentNumber)) {
      showError('documentNumber', 'Document number no puede contener letras');
      return false;
    }

    if (documentNumber.length != 10) {
      showError('documentNumber', 'Document number debe tener 10 digitos');
      return false;
    }
    
    clearError('documentNumber');
    return true;
  };

  //validacion de la funcion numero telefonico
  const validatePhone = () => {
    const phone = formData.phone;
    const phoneRegex = /^[0-9]+$/;
    
    if (!phone) {
      showError('phone', 'phone number is required');
      return false;
    }
    
    if (!phoneRegex.test(phone)) {
      showError('phone', 'Phone number no puede contener letras');
      return false;
    }

    if (phone.length != 10) {
      showError('phone', 'phone number debe tener 10 digitos');
      return false;
    }
    
    clearError('phone');
    return true;
  };

  // Validacion de la funcion email
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

  //validación de la funcion contraseña
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

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const {
      names, lastName, documentNumber, phone, email, password
    } = formData;

    // Validaciones 
    if(
      !names || !lastName || !documentNumber || !phone || !email || !password
    ){
      return Swal.fire("Todos los campos son obligarotios")
    }
    try{
      const emaillower = email.toLocaleLowerCase();

      // Crea usuario para el servivio de autenticación de firebase
      const userMethod = await createUserWithEmailAndPassword(auth, emaillower, password);
      const user = userMethod.user;

      // Guardar datos en firestore"
      await setDoc (doc(db, "usuario", user.uid), {
        uid: user.uid,
        names, lastName, documentNumber, phone, email, password, estado: "pendiente",
        rol: "visitante", creado: new Date(), metodo: "password"
      });

      Swal.fire("Registrado", "Usuario creado con éxito", "exito");
      navigate("/")
    } catch (error){
      console.error("Error de registro: ", error);

      if(error.code === "auth/email-alrwady-in-use"){
        Swal.fire("Correo en uso","Debe ingresar otro correo", "error");
      }
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

  // Social login
  const handleSocialLogin = async (provider) => {
    console.log(`Initiating ${provider} login...`);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log(`Redirecting to ${provider} authentication...`);
      // window.location.href = `/auth/${provider.toLowerCase()}`;
    } catch (error) {
      console.error(`${provider} authentication failed: ${error.message}`);
    }
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
          <h2>Register</h2>
          <p>Create your account</p>
        </div>
        
        {!showSuccess ? (
          <div ref={formRef}>
            <div className="login-form" onSubmit={handleSubmit}>
              
              <div className="form-group">
                <div className="input-group neu-input">
                  <input 
                    type="names" 
                    id="names" 
                    name="names" 
                    value={formData.names}
                    onChange={handleInputChange}
                    onBlur={validateNames}
                    required 
                    autoComplete="names" 
                    placeholder=" " 
                  />
                  <label htmlFor="names">Your Names</label>
                  <div className="input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                </div>
                <span className={`error-message ${errors.names ? 'show' : ''}`} id="namesError">
                  {errors.names}
                </span>
              </div>
              
              <div className="form-group">
                <div className="input-group neu-input">
                  <input 
                    type="lastName" 
                    id="lastName" 
                    name="lastName" 
                    value={formData.lastName}
                    onChange={handleInputChange}
                    onBlur={validateLastName}
                    required 
                    autoComplete="lastName" 
                    placeholder=" " 
                  />
                  <label htmlFor="lastName">Your Lastname</label>
                  <div className="input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                </div>
                <span className={`error-message ${errors.lastName ? 'show' : ''}`} id="lastNameError">
                  {errors.lastName}
                </span>
              </div>

              <div className="form-group">
                <div className="input-group neu-input">
                  <input 
                    type="documentNumber" 
                    id="documentNumber" 
                    name="documentNumber" 
                    value={formData.documentNumber}
                    onChange={handleInputChange}
                    onBlur={validateDocumentNumber}
                    required 
                    autoComplete="documentNumber" 
                    placeholder=" " 
                  />
                  <label htmlFor="documentNumber">Document Number</label>
                  <div className="input-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
                      <circle cx="8" cy="12" r="3" />
                      <path d="M5 17c0-2 1.5-3 3-3s3 1 3 3" />
                      <line x1="14" y1="9" x2="20" y2="9" />
                      <line x1="14" y1="13" x2="20" y2="13" />
                      <line x1="14" y1="17" x2="20" y2="17" />
                    </svg>
                  </div>
                </div>
                <span className={`error-message ${errors.documentNumber ? 'show' : ''}`} id="documentNumberError">
                  {errors.documentNumber}
                </span>
              </div>

              <div className="form-group">
                <div className="input-group neu-input">
                  <input 
                    type="phone" 
                    id="phone" 
                    name="phone" 
                    value={formData.phone}
                    onChange={handleInputChange}
                    onBlur={validatePhone}
                    required 
                    autoComplete="phone" 
                    placeholder=" " 
                  />
                  <label htmlFor="documentNumber">Phone Number</label>
                  <div className="input-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="6" y="2" width="12" height="20" rx="2" ry="2" />
                      <line x1="9" y1="6" x2="15" y2="6" />
                      <line x1="10" y1="18" x2="14" y2="18" />
                    </svg>
                  </div>
                </div>
                <span className={`error-message ${errors.phone ? 'show' : ''}`} id="phoneError">
                  {errors.phone}
                </span>
              </div>

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
              </div>

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
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                    onChange={handlePasswordToggle}
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

            <div className="divider">
              <div className="divider-line"></div>
              <span>or continue with</span>
              <div className="divider-line"></div>
            </div>

            <div className="signup-link">
              <p>Do you already have an account?<Link to="/"> Log In</Link></p>
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

export default RegisterPage;