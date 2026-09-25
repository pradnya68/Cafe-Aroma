import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

const CartDrawer = () => {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeItem, totalItems, subtotal } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/order');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-dark-coffee/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-line shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-line flex items-center justify-between bg-cream/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-caramel">
                <ShoppingBag size={20} />
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold text-espresso">Your Order</h2>
                <p className="text-xs text-ink-muted">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-ink-muted hover:text-espresso hover:bg-line/20 rounded transition"
              aria-label="Close cart"
            >
              <X size={20} />
            </button>
          </div>

          {/* Items list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center text-caramel/50 mb-4">
                  <ShoppingBag size={32} />
                </div>
                <h3 className="font-display text-lg text-espresso mb-1">Your order is empty</h3>
                <p className="text-sm text-ink-muted mb-6">Explore our freshly brewed coffees and artisan bakes.</p>
                <Link
                  to="/menu"
                  onClick={() => setIsCartOpen(false)}
                  className="btn-cafe btn-primary text-xs"
                >
                  Browse Menu <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-4 p-3.5 bg-cream/30 rounded-lg border border-line/60 hover:border-gold/40 transition group"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded bg-beige flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-espresso truncate text-sm">{item.name}</h4>
                      <button
                        onClick={() => removeItem(item._id)}
                        className="text-ink-muted hover:text-red-600 transition p-1"
                        title="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-caramel mt-0.5">₹{item.price}</p>
                    
                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-line rounded bg-white">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="p-1 text-ink-muted hover:text-espresso transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="px-2 text-xs font-semibold text-espresso">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="p-1 text-ink-muted hover:text-espresso transition"
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <span className="text-xs text-ink-muted ml-auto font-medium">
                        Total: ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-line bg-cream/40 space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-ink-muted">
                  <span>Subtotal</span>
                  <span className="font-medium text-espresso">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-ink-muted">
                  <span>GST & Service</span>
                  <span className="text-emerald-700 font-medium">Included</span>
                </div>
                <div className="border-t border-line/60 pt-2 flex justify-between font-display text-lg font-bold text-espresso">
                  <span>Total Amount</span>
                  <span className="text-caramel">₹{subtotal}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full btn-cafe btn-primary text-xs py-3.5 tracking-wider font-bold shadow-md"
              >
                Proceed to Checkout <ArrowRight size={15} />
              </button>

              <p className="text-[11px] text-center text-ink-muted">
                Freshly prepared upon arrival or takeaway.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
