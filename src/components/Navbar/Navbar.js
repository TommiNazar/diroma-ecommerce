import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.scss';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Diroma
        </Link>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">Home</Link>
          </li>
          <li className="navbar-item">
            <Link to="/productos" className="navbar-link">Productos</Link>
          </li>
          <li className="navbar-item">
            <Link to="/carrito" className="navbar-link">Carrito</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
