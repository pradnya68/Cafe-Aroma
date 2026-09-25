import React, { useState, useEffect } from 'react';
import { menuAPI } from '../services/api';
import MenuCard from './MenuCard';

const initialMenuItems = [
  {
    name: 'Espresso',
    price: 120,
    category: 'coffee',
    description: 'Double shot · rich crema · balanced finish',
    image: '/assets/barista-pour.jpg',
    badge: 'Classic',
    available: true,
  },
  {
    name: 'Cappuccino',
    price: 160,
    category: 'coffee',
    description: 'Velvety microfoam · cocoa · house blend',
    image: '/assets/hero-cafe.jpg',
    badge: 'Guest favourite',
    available: true,
  },
  {
    name: 'Café Latte',
    price: 180,
    category: 'coffee',
    description: 'Slow espresso · steamed milk · soft sweetness',
    image: '/assets/special-latte.jpg',
    badge: 'Silky',
    available: true,
  },
  {
    name: 'Mocha',
    price: 190,
    category: 'coffee',
    description: 'Dark chocolate · espresso · cloud of cream',
    image: '/assets/coffee-beans.jpg',
    badge: 'Indulgent',
    available: true,
  },
  {
    name: 'Cold Brew',
    price: 200,
    category: 'coffee',
    description: '18-hour steep · chilled · clean & bright',
    image: '/assets/barista-pour.jpg',
    badge: 'Slow steeped',
    available: true,
  },
  {
    name: 'Caramel Macchiato',
    price: 220,
    category: 'specials',
    description: 'Vanilla · caramel · espresso · warm spice',
    image: '/assets/special-latte.jpg',
    badge: 'Aroma special',
    available: true,
  },
  {
    name: 'Almond Croissant',
    price: 140,
    category: 'breakfast',
    description: 'Buttery layers · toasted almond · flaky finish',
    image: '/assets/pastry-breakfast.jpg',
    badge: 'Baked today',
    available: true,
  },
  {
    name: 'Chocolate Cake',
    price: 180,
    category: 'desserts',
    description: '70% cocoa · sea salt · soft ganache centre',
    image: '/assets/pastry-breakfast.jpg',
    badge: 'Made in-house',
    available: true,
  },
  {
    name: 'Jasmine Green Tea',
    price: 150,
    category: 'tea',
    description: 'Whole leaf · jasmine bloom · delicate finish',
    image: '/assets/cafe-interior.jpg',
    badge: 'Garden notes',
    available: true,
  },
  {
    name: 'Avocado Toast',
    price: 240,
    category: 'breakfast',
    description: 'Sourdough · lemon · chilli · soft poached egg',
    image: '/assets/pastry-breakfast.jpg',
    badge: 'All day',
    available: true,
  },
];

const categoriesList = [
  { filter: 'all', label: 'All menu' },
  { filter: 'coffee', label: 'Coffee' },
  { filter: 'tea', label: 'Tea' },
  { filter: 'breakfast', label: 'Breakfast' },
  { filter: 'desserts', label: 'Desserts' },
  { filter: 'specials', label: 'Specials' },
];

const MenuSection = () => {
  const [items, setItems] = useState(initialMenuItems);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await menuAPI.getAll();
        if (res.data.success && res.data.data.length > 0) {
          setItems(res.data.data);
        }
      } catch (e) {
        console.error('Using default menu items:', e);
      }
    };
    fetchMenu();
  }, []);

  const filteredItems = items.filter(
    (item) => activeFilter === 'all' || item.category?.toLowerCase() === activeFilter
  );

  return (
    <section className="section menu-section" id="menu" aria-labelledby="menu-title">
      <div className="container">
        <div className="section-heading section-heading--split reveal">
          <div>
            <p className="eyebrow">Our menu <span></span></p>
            <h2 id="menu-title" className="section-title">Made fresh.<br /><em>Served warm.</em></h2>
          </div>
          <p className="section-heading__description">
            From first pour to last crumb, every plate is made to make your pause a little more delicious.
          </p>
        </div>

        <div className="menu-filters reveal" role="tablist" aria-label="Filter menu by category">
          {categoriesList.map((cat) => (
            <button
              key={cat.filter}
              className={`filter-button ${activeFilter === cat.filter ? 'is-active' : ''}`}
              type="button"
              role="tab"
              aria-selected={activeFilter === cat.filter}
              onClick={() => setActiveFilter(cat.filter)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="menu-grid" id="menuGrid">
          {filteredItems.map((item, idx) => (
            <MenuCard key={item._id || idx} item={item} />
          ))}
        </div>

        <div className="menu-note reveal">
          <span>
            <svg><use href="#icon-leaf"></use></svg> Seasonal ingredients can make the menu a little different each morning.
          </span>
          <a className="text-link" href="#reservations">
            Reserve your table <svg><use href="#icon-arrow"></use></svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
