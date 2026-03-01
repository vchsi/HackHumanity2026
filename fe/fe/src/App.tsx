import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './components/AuthContext'
import Home from './pages/Home'
import Auth from './pages/Auth'
import Analyze from './pages/Analyze'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/analyze" element={<Analyze />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
