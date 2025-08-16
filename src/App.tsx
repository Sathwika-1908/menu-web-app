import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import ViewMenu from './pages/ViewMenu';
import AddEditMenu from './pages/AddEditMenu';
import MenuDetail from './pages/MenuDetail';
import ViewOrders from './pages/ViewOrders';
import AddEditOrder from './pages/AddEditOrder';
import OrderDetail from './pages/OrderDetail';
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
          <Route path="/orders" element={<ViewOrders />} />
          <Route path="/orders/add" element={<AddEditOrder />} />
          <Route path="/orders/edit/:id" element={<AddEditOrder />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 