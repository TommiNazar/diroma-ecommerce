import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import ProductCard from '../../components/ProductCard/ProductCard';
import productsData from '../../data/products.json';
import './Products.scss';

const Products = () => {
  const [selectedBrand, setSelectedBrand] = useState('todos');
  
  const brands = ['todos', ...new Set(productsData.map(product => product.brand))];
  
  const filteredProducts = selectedBrand === 'todos' 
    ? productsData 
    : productsData.filter(product => product.brand === selectedBrand);

  return (
    <div className="products-page">
      <Navbar />
      
      <main>
        <h1>Nuestros Productos</h1>
        
        <div className="brand-filters">
          {brands.map(brand => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={selectedBrand === brand ? 'active' : ''}
            >
              {brand.charAt(0).toUpperCase() + brand.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="products-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Products;