import React from 'react';

const CategoryFilter = ({ categories = [], activeCategory = 'all', onSelectCategory }) => {
  return (
    <div
      role="tablist"
      aria-label="Filter menu by category"
      className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 my-8"
    >
      <button
        type="button"
        role="tab"
        aria-selected={activeCategory === 'all'}
        onClick={() => onSelectCategory('all')}
        className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-300 ${
          activeCategory === 'all'
            ? 'bg-espresso text-white shadow-md border-transparent scale-105'
            : 'bg-white text-ink-muted border border-line hover:border-caramel hover:text-espresso'
        }`}
      >
        All Menu
      </button>

      {categories.map((cat) => {
        const slug = cat.slug || cat.name.toLowerCase();
        const isActive = activeCategory === slug;
        return (
          <button
            key={cat._id || slug}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelectCategory(slug)}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-300 ${
              isActive
                ? 'bg-espresso text-white shadow-md border-transparent scale-105'
                : 'bg-white text-ink-muted border border-line hover:border-caramel hover:text-espresso'
            }`}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
