// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AddPharmacy from './pages/AddPharmacy';
import AddWarehouse from './pages/AddWarehouse';
import AddAdmin from './pages/AddAdmin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/add-pharmacy" element={<AddPharmacy />} />
        <Route path="/add-warehouse" element={<AddWarehouse/>}/>
        <Route path="/add-admin" element={<AddAdmin/>}/>
      </Routes>
    </Router>
  );
}

export default App; // ← مهم جداً
