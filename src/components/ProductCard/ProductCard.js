import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import './ProductCard.scss';


const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const importImage = async (imageName) => {
    try {
      const image = await import(`../../assets/images/${imageName}`);
      return image.default;
    } catch (err) {
      console.error("Error loading image:", err);
      return null;
    }
  };

  const [productImage, setProductImage] = useState(null);

  useEffect(() => {
    importImage(product.image).then(setProductImage);
  }, [product.image]);


 

  return (
    <div className="product-card">
      <div className="product-image">
        {productImage ? (
          <img src={productImage} alt={product.name} />
        ) : (
          <div className="image-placeholder">Imagen no disponible</div>
        )}
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-brand">{product.brand}</p>
        <p className="product-price">${product.price}</p>
        <button 
          onClick={() => addToCart(product)}
          className="add-to-cart"
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
};

export default ProductCard;