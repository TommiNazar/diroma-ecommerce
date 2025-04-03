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

    // Validación básica
    if (!formData.name || !formData.phone || !formData.email || !formData.address) {
      setError('Por favor complete todos los campos requeridos');
      setIsLoading(false);
      return;
    }

    try {
      const formPayload = {
        _template: 'table',
        _captcha: 'false',
        _subject: `Nuevo Pedido Diroma - ${formData.name}`,
        'Nombre': formData.name,
        'Teléfono': formData.phone,
        'Email': formData.email,
        'Dirección': formData.address,
        'Método de Pago': formData.paymentMethod,
        'Productos': cart.map(item => 
          `${item.name} (${item.brand}) - ${item.quantity} x $${item.price.toFixed(2)}`
        ).join('\n'),
        'Total': `$${totalPrice.toFixed(2)}`,
        'Notas': formData.notes || 'Ninguna'
      };

      const response = await fetch('https://formsubmit.co/ajax/92e0265dda88540398c5bc2330afbbd6', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formPayload),
        mode: 'cors'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setOrderSent(true);
        clearCart();
      } else {
        throw new Error(data.message || 'Error en la respuesta del servidor');
      }

    } catch (error) {
      console.error('Error al enviar el pedido:', error);
      setError('Error al procesar el pedido. Por favor intente nuevamente o contáctenos por teléfono.');
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
          <p>Hemos recibido tu pedido correctamente.</p>
          <p>Te enviaremos un email con los detalles de compra.</p>
          <a href="/" className="home-link">Volver al inicio</a>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="cart-page">
      <Navbar />
      
      <main>
        <h1>Tu Carrito ({totalItems})</h1>
        
        {cart.length === 0 ? (
          <div className="empty-cart">
            <p>No hay productos en tu carrito</p>
            <a href="/productos">Ver productos</a>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p className="brand">{item.brand}</p>
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
                    aria-label="Eliminar producto"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-total">
              <h2>Total: <span>${totalPrice.toFixed(2)}</span></h2>
            </div>

            <form onSubmit={handleSubmit} className="checkout-form" noValidate>
              <h2>Información de Envío</h2>
              
              {error && <div className="error-message">{error}</div>}

              <div className="form-group">
                <label htmlFor="name">Nombre Completo *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Teléfono *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Dirección *</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="3"
                  disabled={isLoading}
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="paymentMethod">Método de Pago *</label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="tarjeta">Tarjeta</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="notes">Notas</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Indicaciones adicionales"
                  disabled={isLoading}
                ></textarea>
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={isLoading || cart.length === 0}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span> Procesando...
                  </>
                ) : (
                  'Finalizar Compra'
                )}
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