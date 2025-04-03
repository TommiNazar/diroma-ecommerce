import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import ProductCard from '../../components/ProductCard/ProductCard';
import productsData from '../../data/products.json';
import './Home.scss';
import imagendiroma from '../../assets/images/diroma.png';



 
const Home = () => {
  // Seleccionar los primeros 4 productos como destacados
  const featuredProducts = productsData.slice(0, 4);

  return (
    <div className="home">
      <Navbar />
      
      <main>
        <section className="hero">
          <img src={imagendiroma} alt='diroma' className="hero-image" />
        </section>
        
        <section className="about">
          <h2>Sobre Nosotros</h2>
          <p>
            Diroma es una distribuidora de alimentos comprometida con la calidad y el servicio. 
            Ofrecemos los mejores productos a precios competitivos para satisfacer las necesidades 
            de nuestros clientes.
          </p>
        </section>
        
        <section className="featured">
          <h2>Productos Destacados</h2>
          <div className="products-grid">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;