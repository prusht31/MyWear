import React from 'react';
import './Card.css';
import { useNavigate } from 'react-router-dom';

export default function Card({ id, title, brand, price, stock, img }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="product-card-dark" onClick={handleClick}>
      <img src={img} alt={title} />
      <h3>{title}</h3>
      <p className="brand">{brand}</p>
      <div className="price-stock">
        <strong>{price}</strong>
        <span className={stock === 'In Stock' ? 'in-stock' : 'out-of-stock'}>{stock}</span>
      </div>
    </div>
  );
}
