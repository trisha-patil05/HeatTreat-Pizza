import { Route, Routes, useLocation } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import BannerCarousel from './components/BannerCarousel';
import Navbar from './components/Navbar';
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

function NavbarWrapper() {
  const location = useLocation();
  const hideOn = ["/", "/login", "/admin-dashboard"];
  if (hideOn.includes(location.pathname)) return null;
  return <Navbar />;
}

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
    <>
      <NavbarWrapper />
      <AnimatedPage>
        <Routes>
          {/* Public */}
          <Route path="/"                element={<LandingPage />} />
          <Route path="/login"           element={<Login />} />
          <Route path="/story"           element={<OurStory />} />
          <Route path="/contact"         element={<Contact />} />
          <Route path="/banner"          element={<BannerCarousel />} />

          {/* Protected */}
          <Route path="/home"            element={<HomePage />} />
          <Route path="/pizza/:id"       element={<PizzaDetails />} />
          <Route path="/cart"            element={<ShoppingCart />} />
          <Route path="/pizza-cart"      element={<PizzaCart />} />
          <Route path="/order"           element={<OrderPage />} />
          <Route path="/summary"         element={<Summary />} />

          {/* Admin */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />

          {/* Fallback — unknown URL pe home */}
          <Route path="*"                element={<HomePage />} />
        </Routes>
      </AnimatedPage>
    </>
  );
}

export default App;