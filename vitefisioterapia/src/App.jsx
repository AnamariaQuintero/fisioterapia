import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/loginPage/loginPage'
import RegisterPage from './pages/registerPage/registerPage'
import RecoverPassword from './pages/recoverPasswordPage/recoverPassword'
// import DashboardPage from './pages/dashboardPage/dashboardPage'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Vista Principal */}
          <Route path='/' element={<LoginPage/>}></Route>
          <Route path='/RegisterPage' element={<RegisterPage/>}></Route>
          <Route path='/RecoverPassword' element={<RecoverPassword/>}></Route>
          {/* <Route path='/DashboardPage' element={<DashboardPage/>}></Route> */}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
