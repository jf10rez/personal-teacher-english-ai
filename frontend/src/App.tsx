import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/layout/Layout'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Plan from './pages/Plan'
import Coach from './pages/Coach'
import Thinking from './pages/Thinking'
import Conversation from './pages/Conversation'
import Naturalness from './pages/Naturalness'
import Vocabulary from './pages/Vocabulary'
import Grammar from './pages/Grammar'
import Pronunciation from './pages/Pronunciation'
import Immersion from './pages/Immersion'
import Simulation from './pages/Simulation'
import Mistakes from './pages/Mistakes'

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/*"
        element={
          isAuthenticated ? (
            <Layout>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/plan" element={<Plan />} />
                <Route path="/coach" element={<Coach />} />
                <Route path="/thinking" element={<Thinking />} />
                <Route path="/conversation" element={<Conversation />} />
                <Route path="/naturalness" element={<Naturalness />} />
                <Route path="/vocabulary" element={<Vocabulary />} />
                <Route path="/grammar" element={<Grammar />} />
                <Route path="/pronunciation" element={<Pronunciation />} />
                <Route path="/immersion" element={<Immersion />} />
                <Route path="/simulation" element={<Simulation />} />
                <Route path="/mistakes" element={<Mistakes />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Layout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  )
}

export default App
