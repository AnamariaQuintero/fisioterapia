import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/loginPage/loginPage'
import RegisterPage from './pages/registerPage/registerPage'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Vista Principal */}
          <Route path='/' element={<LoginPage/>}></Route>
          <Route path='/RegisterPage' element={<RegisterPage/>}></Route>
          
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
