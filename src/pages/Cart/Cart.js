import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './Cart.scss';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, totalItems, clearCart } = useCart();
  const [orderSent, setOrderSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    paymentMethod: 'efectivo',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // 1. Preparamos los datos para FormSubmit
    const formDataToSend = {
      _template: 'table', // Formato de tabla en el email
      _captcha: 'false', // Desactiva CAPTCHA
      _subject: `Nuevo Pedido Diroma - ${formData.name}`,
      'N° Pedido': `ORD-${Date.now().toString().slice(-6)}`,
      'Nombre': formData.name,
      'Teléfono': formData.phone,
      'Email': formData.email,
      'Dirección': formData.address,
      'Método de Pago': formData.paymentMethod,
      'Productos': cart.map(item => 
        `• ${item.name} (${item.brand}) - ${item.quantity} x $${item.price} = $${item.quantity * item.price}`
      ).join('\n'),
      'Total': `$${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)}`,
      'Notas': formData.notes || 'Ninguna'
    };

    try {
      // 2. Enviamos los datos a FormSubmit
      const response = await fetch('https://formsubmit.co/ajax/92e0265dda88540398c5bc2330afbbd6', { // Reemplaza con TU CÓDIGO
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formDataToSend)
      });

      const data = await response.json();

      // 3. Verificamos la respuesta
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Error al procesar el pedido');
      }

      // 4. Éxito: limpiamos el carrito y mostramos confirmación
      setOrderSent(true);
      clearCart();
      
    } catch (err) {
      console.error('Error al enviar el pedido:', err);
      setError(err.message || 'Ocurrió un error. Por favor intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (orderSent) {
    return (
      <div className="cart-page">
        <Navbar />
        <main className="order-confirmation">
          <h1>¡Gracias por tu compra!</h1>
          <p>Hemos recibido tu pedido correctamente.</p>
          <p>En la brevedad nos estaremos comunicando para coordinar la entrega.</p>
          <p>¡Que tengas un excelente día!</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="cart-page">
      <Navbar />
      
      <main>
        <h1>Tu Carrito ({totalItems} {totalItems === 1 ? 'item' : 'items'})</h1>
        
        {cart.length === 0 ? (
          <p>Tu carrito está vacío</p>
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
                    ${item.price * item.quantity}
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
              <h2>Información de Entrega</h2>
              
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
                <label htmlFor="address">Dirección de Entrega *</label>
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
                <label htmlFor="paymentMethod">Forma de Pago *</label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="transferencia">Transferencia Bancaria</option>
                  <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="notes">Notas adicionales</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Indicaciones especiales para la entrega"
                  disabled={isLoading}
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="submit-order"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span> Enviando...
                  </>
                ) : (
                  'Confirmar Pedido'
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