import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './Cart.scss';

const Cart = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice
  } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    paymentMethod: 'efectivo',
    notes: ''
  });

  const [orderSent, setOrderSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://formsubmit.co/ajax/92e0265dda88540398c5bc2330afbbd6', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _template: 'table',
          _subject: `Nuevo Pedido - ${formData.name}`,
          'Cliente': formData.name,
          'Teléfono': formData.phone,
          'Email': formData.email,
          'Dirección': formData.address,
          'Método de Pago': formData.paymentMethod,
          'Productos': cart.map(item => 
            `${item.name} (${item.brand}) - ${item.quantity} x $${item.price}`
          ).join('\n'),
          'Total': `$${totalPrice.toFixed(2)}`,
          'Notas': formData.notes || 'Ninguna'
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Error al enviar');
      
      setOrderSent(true);
      clearCart();

    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Error al procesar el pedido');
    } finally {
      setIsLoading(false);
    }
  };

  if (orderSent) {
    return (
      <div className="cart-page">
        <Navbar />
        <main className="order-confirmation">
          <h1>¡Pedido Confirmado!</h1>
          <p>Recibirás un email con los detalles.</p>
          <button onClick={() => window.location.href = '/'}>
            Volver al inicio
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="cart-page">
      <Navbar />
      
      <main>
        <h1>Carrito ({totalItems})</h1>
        
        {cart.length === 0 ? (
          <div className="empty-cart">
            <p>Tu carrito está vacío</p>
            <a href="/productos">Ver productos</a>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p>{item.brand}</p>
                  </div>
                  <div className="item-quantity">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      +
                    </button>
                  </div>
                  <div className="item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="remove-item"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-total">
              <h2>Total: ${totalPrice.toFixed(2)}</h2>
            </div>

            <form onSubmit={handleSubmit} className="checkout-form">
              <h2>Datos de Entrega</h2>
              
              {error && <div className="error-message">{error}</div>}

              <div className="form-group">
                <label>Nombre Completo *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Repite para otros campos (teléfono, email, etc.) */}

              <button
                type="submit"
                disabled={isLoading}
                className={isLoading ? 'loading' : ''}
              >
                {isLoading ? 'Enviando...' : 'Finalizar Compra'}
              </button>
            </form>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;