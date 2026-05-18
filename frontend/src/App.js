import { Route, Routes, useLocation } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import BannerCarousel from './components/BannerCarousel';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import './global.css';
import Contact from "./pages/Contact";
import HomePage from './pages/HomePage';
import LandingPage from "./pages/LandingPage";
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import OrderHistory from './pages/OrderHistory';
import OrderPage from './pages/OrderPage';
import OurStory from "./pages/OurStory";
import PizzaCart from './pages/PizzaCart';
import PizzaDetails from './pages/PizzaDetails';
import ProfilePage from './pages/ProfilePage';
import ShoppingCart from './pages/ShoppingCart';
import Summary from './pages/Summary';

// ✅ Har page pe fade + slide-up animation
function AnimatedPage({ children }) {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-animate">
      {children}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <Navbar />
          <AnimatedPage>
            <Routes>
              {/* Public */}
              <Route path="/"        element={<LandingPage />} />
              <Route path="/login"   element={<Login />} />
              <Route path="/story"   element={<OurStory />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/banner"  element={<BannerCarousel />} />

              {/* Protected */}
              <Route path="/home"          element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
              <Route path="/pizza/:id"     element={<ProtectedRoute><PizzaDetails /></ProtectedRoute>} />
              <Route path="/cart"          element={<ProtectedRoute><ShoppingCart /></ProtectedRoute>} />
              <Route path="/pizza-cart"    element={<ProtectedRoute><PizzaCart /></ProtectedRoute>} />
              <Route path="/order"         element={<ProtectedRoute><OrderPage /></ProtectedRoute>} />
              <Route path="/summary"       element={<ProtectedRoute><Summary /></ProtectedRoute>} />
              <Route path="/order-history" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
              <Route path="/my-orders"     element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
              <Route path="/profile"       element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

              {/* Admin Only */}
              <Route path="/admin-dashboard" element={
                <ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>
              } />

              {/* ✅ 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatedPage>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;