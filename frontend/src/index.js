
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';

const root = ReactDOM.createRoot(
  document.getElementById('root')
);

root.render(
  <BrowserRouter>
    <ToastProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </ToastProvider>
  </BrowserRouter>
);
