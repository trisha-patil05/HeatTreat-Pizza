import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import BannerCarousel from './components/BannerCarousel';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AdminDashboard from './pages/AdminDashboard';
import Contact from "./pages/Contact";
import HomePage from './pages/HomePage';
import LandingPage from "./pages/LandingPage";
import Login from './pages/Login';
import OrderPage from './pages/OrderPage';
import OurStory from "./pages/OurStory";
import PizzaCart from './pages/PizzaCart';
import PizzaDetails from './pages/PizzaDetails';
import ShoppingCart from './pages/ShoppingCart';
import Summary from './pages/Summary';

function App() {
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/')
      .then(res => res.json())
      .then(data => setMsg(data.message))
      .catch(err => console.error("Backend not connected:", err));
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <div className="App">
          {msg && <div>Backend: {msg}</div>}

          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/story" element={<OurStory />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/pizza/:id" element={<PizzaDetails />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/summary" element={<Summary />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/cart" element={<ShoppingCart />} />
            <Route path="/pizza-cart" element={<PizzaCart />} />
            <Route path="/banner" element={<BannerCarousel />} />
          </Routes>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;