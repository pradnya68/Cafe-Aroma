import React from 'react';
import { useCart } from '../context/CartContext';

const MenuCard = ({ item }) => {
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem(item);
  };

  return (
    <article className="menu-card" data-category={item.category}>
      <div className="menu-card__image">
        <img
          src={item.image || '/assets/hero-cafe.jpg'}
          alt={item.name}
          loading="lazy"
        />
        {item.badge && <span className="menu-card__tag">{item.badge}</span>}
        <span className="menu-card__shine"></span>
      </div>
      <div className="menu-card__body">
        <div className="menu-card__heading">
          <h3>{item.name}</h3>
          <span>₹{item.price}</span>
        </div>
        <p>{item.description}</p>
        <button
          className="order-button"
          type="button"
          data-order={item.name}
          onClick={handleAdd}
          disabled={!item.available}
        >
          <span>{item.available ? 'Add to order' : 'Out of stock'}</span>
          <i>
            <svg><use href="#icon-plus"></use></svg>
          </i>
        </button>
      </div>
    </article>
  );
};

export default MenuCard;
