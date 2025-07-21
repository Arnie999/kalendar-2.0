import { Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Layout } from './components/Layout';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/events" element={<div>Events Management</div>} />
        <Route path="/users" element={<div>User Management</div>} />
        <Route path="/settings" element={<div>Settings</div>} />
      </Routes>
    </Layout>
  );
}

export default App; 