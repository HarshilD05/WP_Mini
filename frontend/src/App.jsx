import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import RequestForm from './pages/RequestForm'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/request-form" element={<RequestForm />} />
      </Routes>
    </Router>
  )
}

export default App
