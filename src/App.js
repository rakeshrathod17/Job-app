import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Login from './Components/Login/Login'
import Home from './Components/Home/Home'
import Jobs from './Components/Jobs/Jobs'
import JobItemDetails from './Components/JobItemDetails/JobItemDetails'
import NotFound from './Components/NotFound/NotFound'
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute'

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/jobs" element={<ProtectedRoute element={<Jobs />} />} />
        <Route path="/jobs/:id" element={<ProtectedRoute element={<JobItemDetails />} />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/not-found" />} />
      </Routes>
    </>
  )
}
export default App