import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Chips1 from '../assets/imgs/products/Chips_1.png';
import Chips2 from '../assets/imgs/products/Chips_2.png';
import Chips3 from '../assets/imgs/products/Chips_3.png';
import Chips4 from '../assets/imgs/products/Chips_4.png';
import Chips5 from '../assets/imgs/products/Chips_5.png';
import CornChips from '../assets/imgs/products/corn-chips.png';

const Products = () => {
  const products = [
    {
      id: 1,
      name: "Classic Corn Chips",
      image: Chips1,
      description: "Traditional crispy corn chips with authentic flavor",
      category: "Corn Snacks"
    },
    {
      id: 2,
      name: "Spicy Nacho Chips",
      image: Chips2,
      description: "Zesty nacho flavor with a perfect crunch",
      category: "Corn Snacks"
    },
    {
      id: 3,
      name: "Cheese Flavored Chips",
      image: Chips3,
      description: "Rich cheese flavor in every crispy bite",
      category: "Corn Snacks"
    },
    {
      id: 4,
      name: "BBQ Flavored Chips",
      image: Chips4,
      description: "Smoky BBQ taste with satisfying crunch",
      category: "Corn Snacks"
    },
    {
      id: 5,
      name: "Sour Cream & Onion",
      image: Chips5,
      description: "Creamy sour cream with tangy onion flavor",
      category: "Corn Snacks"
    },
    {
      id: 6,
      name: "Premium Corn Chips",
      image: CornChips,
      description: "Premium quality corn chips with natural ingredients",
      category: "Premium Line"
    }
  ];

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="pt-16 bg-gradient-to-br from-primary to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-itim mb-6">
            Our Products
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Discover our range of delicious, high-quality snacks made from the finest ingredients
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-itim text-primary mb-4">
              Premium Snack Collection
            </h2>
            <p className="text-lg text-gray-600">
              Each product is crafted with care using traditional recipes and modern techniques
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {product.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {product.description}
                  </p>
                  <button className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-300">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Premium Quality</h3>
              <p className="text-gray-600">Made from the finest Spanish corn with natural ingredients</p>
            </div>
            
            <div className="p-6">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Gluten Free</h3>
              <p className="text-gray-600">100% gluten-free snacks suitable for everyone</p>
            </div>
            
            <div className="p-6">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Non-GMO</h3>
              <p className="text-gray-600">Made with non-genetically modified ingredients</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Products;
