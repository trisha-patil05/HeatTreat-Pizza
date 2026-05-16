import { Route, Routes } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import BannerCarousel from './components/BannerCarousel';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import './global.css';
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
  return (
    <AuthProvider>
      <CartProvider>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/story" element={<OurStory />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/banner" element={<BannerCarousel />} />

          {/* Protected Routes — Login zaroori */}
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/pizza/:id" element={<ProtectedRoute><PizzaDetails /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><ShoppingCart /></ProtectedRoute>} />
          <Route path="/pizza-cart" element={<ProtectedRoute><PizzaCart /></ProtectedRoute>} />
          <Route path="/order" element={<ProtectedRoute><OrderPage /></ProtectedRoute>} />
          <Route path="/summary" element={<ProtectedRoute><Summary /></ProtectedRoute>} />
          <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;