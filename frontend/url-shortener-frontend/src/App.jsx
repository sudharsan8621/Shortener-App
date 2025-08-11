import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UrlForm from './components/UrlForm';
import AdminPage from './components/AdminPage';

function App() {
  return (
    <Router>
      <nav style={{ margin: 20 }}>
        <Link to="/">Home</Link> |{' '}
        <Link to="/admin">Admin</Link>
      </nav>
      <Routes>
        <Route path="/" element={<UrlForm />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
