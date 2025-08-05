import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import ViewMenu from './pages/ViewMenu';
import AddEditMenu from './pages/AddEditMenu';
import MenuDetail from './pages/MenuDetail';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<ViewMenu />} />
          <Route path="/add" element={<AddEditMenu />} />
          <Route path="/menu/:id" element={<MenuDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 