import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Chips1 from '../assets/imgs/products/Chips_1.png';
import Chips2 from '../assets/imgs/products/Chips_2.png';
import Chips3 from '../assets/imgs/products/Chips_3.png';
import Chips4 from '../assets/imgs/products/Chips_4.png';
import Chips5 from '../assets/imgs/products/Chips_5.png';
import CornChips from '../assets/imgs/products/corn-chips.png';

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'products', name: 'Products' },
    { id: 'facilities', name: 'Facilities' },
    { id: 'process', name: 'Production Process' }
  ];

  const galleryItems = [
    {
      id: 1,
      title: 'Classic Corn Chips',
      category: 'products',
      image: Chips1,
      description: 'Our signature classic corn chips'
    },
    {
      id: 2,
      title: 'Spicy Nacho Chips',
      category: 'products',
      image: Chips2,
      description: 'Zesty nacho flavor chips'
    },
    {
      id: 3,
      title: 'Cheese Flavored Chips',
      category: 'products',
      image: Chips3,
      description: 'Rich cheese flavor chips'
    },
    {
      id: 4,
      title: 'BBQ Flavored Chips',
      category: 'products',
      image: Chips4,
      description: 'Smoky BBQ taste chips'
    },
    {
      id: 5,
      title: 'Sour Cream & Onion',
      category: 'products',
      image: Chips5,
      description: 'Creamy sour cream chips'
    },
    {
      id: 6,
      title: 'Premium Corn Chips',
      category: 'products',
      image: CornChips,
      description: 'Premium quality corn chips'
    }
  ];

  const filteredItems = activeCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="pt-16 bg-gradient-to-br from-primary to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-itim mb-6">
            Our Gallery
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Explore our products, facilities, and production process through our visual gallery
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative group">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-sm">{item.description}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {item.description}
                  </p>
                  <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                    {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No items found</h3>
              <p className="text-gray-500">Try selecting a different category</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-4xl font-itim mb-6">
            Want to See More?
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Contact us to arrange a visit to our facilities or learn more about our products
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300">
              Contact Us
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors duration-300">
              Request Quotation
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Gallery;
