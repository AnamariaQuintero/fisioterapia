
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/loginPage/loginPage'
import RegisterPage from './pages/registerPage/registerPage'
import ResetPassword from './pages/resetPasswordPage/resetPassword'
import ForgotPassword from './pages/resetPasswordPage/forgotPassword'
import ProtectedRoute from './pages/components/protectedRoute'
import DashboardPage from './pages/dashboardPage/dashboardPage'
import LeerUsuario from './pages/usuarios/leerUsuario'
import CrearUsuario from './pages/usuarios/crearUsuario'
import EditarUsuario from './pages/usuarios/editarUsuario'
import CitaPage from './pages/citas/citaview'
import CreateCita from './pages/citas/citacreate'
import Login from './pages/vinculación/vinculacion'
import ListaAuditoria from './pages/components/listAuditoria'

// Rutas para los reportes de los usuarios 
import ReporteUsuariosPDF from './pages/components/reporteUsuariosPDF'
import ReporteUsuariosEXCEL from './pages/components/reporteUsuariosEXCEL'

// Rutas para los reportes de las citas
// import CitaExcel from './pages/citas/citaexcel'
// import CitaPdf from './pages/citas/citapdf'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Rutas publicas */}
          <Route path='/' element={<LoginPage />}></Route>
          <Route path='/RegisterPage' element={<RegisterPage />}></Route>
          <Route path='/ResetPassword' element={<ResetPassword />}></Route>
          <Route path='/ForgotPassword' element={<ForgotPassword />}></Route>
          <Route path='/Login' element={<Login />}></Route>

          {/* Rutas protegidas */}
          <Route path='/DashboardPage' element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}></Route>
          <Route path='/LeerUsuario' element={<ProtectedRoute><LeerUsuario /></ProtectedRoute>}></Route>
          <Route path='/CrearUsuario' element={<ProtectedRoute><CrearUsuario /></ProtectedRoute>}></Route>
          <Route path='/EditarUsuario/:id' element={<ProtectedRoute><EditarUsuario /></ProtectedRoute>}></Route>
          <Route path='/CitaPage' element={<ProtectedRoute><CitaPage /></ProtectedRoute>}></Route>
          <Route path='/CreateCita' element={<ProtectedRoute><CreateCita /></ProtectedRoute>}></Route>
          <Route path='/ListaAuditoria' element={<ProtectedRoute><ListaAuditoria /></ProtectedRoute>}></Route>

          {/* Rutas para exportar datos de los usuarios */}
          <Route path='/ReporteUsuariosPDF' element={<ProtectedRoute><ReporteUsuariosPDF /></ProtectedRoute>}></Route>
          <Route path='/ReporteUsuariosEXCEL' element={<ProtectedRoute><ReporteUsuariosEXCEL /></ProtectedRoute>}></Route>

          {/* Rutas para exportar datos de las citas */}
          {/* <Route path='/CitaExcel' element={<ProtectedRoute><CitaExcel /></ProtectedRoute>}></Route> */}
          {/* <Route path='/CitaPdf' element={<ProtectedRoute><CitaPdf /></ProtectedRoute>}></Route> */}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
