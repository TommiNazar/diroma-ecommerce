import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home/Home';  // Cambiado
import Products from './pages/Products/Products';  // Cambiado
import Cart from './pages/Cart/Cart';  // Cambiado

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/carrito" element={<Cart />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;