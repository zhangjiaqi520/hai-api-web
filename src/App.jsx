import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'

function App() {
  const isAuthenticated = () => {
    return !!localStorage.getItem('token')
  }

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" replace />
    }
    return children
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="channels" element={<div className="text-2xl font-bold">渠道管理</div>} />
          <Route path="tokens" element={<div className="text-2xl font-bold">令牌管理</div>} />
          <Route path="statistics" element={<div className="text-2xl font-bold">使用统计</div>} />
          <Route path="logs" element={<div className="text-2xl font-bold">日志管理</div>} />
          <Route path="users" element={<div className="text-2xl font-bold">用户管理</div>} />
          <Route path="settings" element={<div className="text-2xl font-bold">系统设置</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
