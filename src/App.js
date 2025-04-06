import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthRoutes from './routes/AuthRoutes';  // Your new AuthRoutes file

function App() {
  return (
    <Router>
      <Routes>
        {/* Wrap routes that require authentication */}
        <Route path="/*" element={<AuthRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
