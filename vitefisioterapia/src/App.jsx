import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/loginPage/loginPage'
import RegisterPage from './pages/registerPage/registerPage'
import ResetPassword from './pages/resetPasswordPage/resetPassword'
import ForgotPassword from './pages/resetPasswordPage/forgotPassword'
import DashboardPage from './pages/dashboardPage/dashboardPage'
import LeerUsuario from './pages/usuarios/leerUsuario'
import CrearUsuario from './pages/usuarios/crearUsuario'
import EditarUsuario from './pages/usuarios/editarUsuario'
// import CitaPage from './pages/citas/citaview'
// import CreateCita from './pages/citas/citacreate'
// import EditCita from './pages/citas/citaedit'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Vista Principal */}
          <Route path='/' element={<LoginPage/>}></Route>
          <Route path='/RegisterPage' element={<RegisterPage/>}></Route>
          <Route path='/ResetPassword' element={<ResetPassword/>}></Route>
          <Route path='/ForgotPassword' element={<ForgotPassword/>}></Route>
          <Route path='/DashboardPage' element={<DashboardPage/>}></Route>
          <Route path='/LeerUsuario' element={<LeerUsuario/>}></Route>
          <Route path='/CrearUsuario' element={<CrearUsuario/>}></Route>
          <Route path='/EditarUsuario/:id' element={<EditarUsuario/>}></Route>
          {/* <Route path='/CitaPage' element={<CitaPage/>}></Route>
          <Route path='/CreateCita' element={<CreateCita/>}></Route>
          <Route path='/EditCita/:id' element={<EditCita/>}></Route> */}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
