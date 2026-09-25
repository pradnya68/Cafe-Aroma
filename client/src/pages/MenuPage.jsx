import React, { useState, useEffect } from 'react';
import { menuAPI, categoryAPI } from '../services/api';
import CategoryFilter from '../components/CategoryFilter';
import MenuCard from '../components/MenuCard';
import Loading from '../components/Loading';
import { Search, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const MenuPage = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { totalItems, setIsCartOpen } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [menuRes, catRes] = await Promise.all([
          menuAPI.getAll(),
          categoryAPI.getAll(),
        ]);

        if (menuRes.data.success) {
          setItems(menuRes.data.data);
        }
        if (catRes.data.success) {
          setCategories(catRes.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch menu:', err);
        setError('Unable to load menu. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      activeCategory === 'all' || item.category?.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-24 pb-20 bg-cream min-h-screen">
      {/* Header Banner */}
      <section className="bg-dark-coffee text-white py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-radial from-caramel/15 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <span className="eyebrow eyebrow--light mb-3">Our Menu</span>
          <h1 className="font-display text-4xl sm:text-5xl font-medium mb-4">
            Made fresh. <em className="text-gold">Served warm.</em>
          </h1>
          <p className="text-cream/80 text-sm sm:text-base max-w-lg mx-auto">
            From single-origin pours and artisan lattes to freshly baked breakfast sourdough and velvety desserts.
          </p>

          {/* Search Input */}
          <div className="max-w-md mx-auto mt-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/40" size={18} />
            <input
              type="text"
              placeholder="Search espresso, mocha, toast, cake..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full bg-espresso/80 border border-white/20 text-cream placeholder:text-cream/40 text-sm focus:outline-none focus:border-gold transition shadow-inner"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-8 max-w-6xl py-8">
        {/* Category Filter */}
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        {/* Floating Cart Indicator */}
        {totalItems > 0 && (
          <div className="mb-6 flex justify-end">
            <button
              onClick={() => setIsCartOpen(true)}
              className="inline-flex items-center gap-2 bg-espresso text-gold px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg hover:bg-dark-coffee transition border border-gold/30"
            >
              <ShoppingBag size={15} />
              <span>Review order ({totalItems} items)</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* Menu Grid */}
        {loading ? (
          <Loading message="Brewing menu items..." />
        ) : error ? (
          <div className="p-8 text-center bg-red-50 text-red-700 rounded-lg max-w-md mx-auto">
            <p>{error}</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white/60 rounded-2xl border border-line">
            <p className="font-display text-xl text-espresso mb-2">No matching dishes found</p>
            <p className="text-sm text-ink-muted">Try selecting another category or clearing your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <MenuCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
