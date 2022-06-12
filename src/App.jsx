import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate replace to="/home"/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
