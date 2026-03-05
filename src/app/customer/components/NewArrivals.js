'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/cartSlice';
import Image from 'next/image';
import { FiShoppingCart, FiChevronRight, FiMaximize2, FiShoppingBag, FiDownload } from 'react-icons/fi';
import DigitalCheckoutModal from './DigitalCheckoutModal';
import { GoStarFill } from 'react-icons/go';

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(10);
  const [loading, setLoading] = useState(true);
  const [isDigitalModalOpen, setIsDigitalModalOpen] = useState(false);
  const [selectedDigitalProduct, setSelectedDigitalProduct] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products/newArrivals');
        const data = (response.data.data || []).map(p => ({
          ...p,
          images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images
        }));
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleProductClick = (slug) => {
    router.push(`/customer/pages/products/${slug}`);
  };

  const handleAddToCart = (product, e) => {
    if (e) e.stopPropagation();
    dispatch(addToCart(product));
  };

  const handleBuyNow = (product, e) => {
    if (e) e.stopPropagation();
    dispatch(addToCart(product));
    router.push('/customer/pages/cart');
  };

  const formatPrice = (price) => {
    return price ? price.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00';
  };

  const calculateSalePrice = (price, discount) => {
    if (typeof price === 'number' && typeof discount === 'number' && discount > 0) {
      return price - (price * discount / 100);
    }
    return price;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <div>
          <h3 className="text-[1.5rem] md:text-[2rem] font-black uppercase tracking-tighter leading-none mb-6">New Arrivals</h3>
          <p className="text-gray-400 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] max-w-lg relative pl-12">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-[2px] bg-orange-500"></span>
            Discover the latest additions to our curated collection
          </p>
        </div>
        <button
          className="flex items-center gap-3 text-xs font-black uppercase tracking-widest group hover:text-orange-600 transition-colors"
          onClick={() => router.push('/customer/pages/allproducts')}
        >
          View More New Stuff <FiChevronRight className="group-hover:translate-x-2 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-6 gap-y-12">
        {products.slice(0, visibleProducts).map((product) => {
          const salePrice = calculateSalePrice(product.price, product.discount);
          return (
            <div
              key={product.id}
              className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => handleProductClick(product.slug)}
            >
              <div
                className="relative aspect-square bg-[#F3F4FB] overflow-hidden transition-all duration-500"
              >
                {/* Badge */}
                <div className="absolute top-3 left-3 z-20 bg-[#1E4C2F] text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tight shadow-md">
                  {product.discount > 0 ? `${product.discount.toFixed(0)}% OFF` : 'New'}
                </div>

                {/* Floating Icons */}
                <div className="absolute top-3 right-3 z-30 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                  <button className="bg-white p-2 rounded-full shadow-lg text-gray-700 hover:bg-orange-500 hover:text-white transition-all transform hover:scale-110">
                    <FiMaximize2 size={14} />
                  </button>
                  <button
                    className={`bg-white p-2 rounded-full shadow-lg text-gray-700 hover:bg-orange-500 hover:text-white transition-all transform hover:scale-110 ${product.productType === 'digital' ? 'text-blue-600' : ''}`}
                    onClick={(e) => {
                      if (product.productType === 'digital') {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedDigitalProduct(product);
                        setIsDigitalModalOpen(true);
                      } else {
                        handleAddToCart(product, e);
                      }
                    }}
                    title={product.productType === 'digital' ? 'Pay to Download' : 'Add to Cart'}
                  >
                    {product.productType === 'digital' ? <FiDownload size={14} /> : <FiShoppingBag size={14} />}
                  </button>
                </div>

                {product.images?.[0] && (
                  <Image
                    fill
                    src={(() => {
                      const img = product.images[0];
                      const url = typeof img === 'string' ? img : img?.url;
                      if (!url) return '/placeholder.png';
                      return (url.startsWith('http') || url.startsWith('data:'))
                        ? url
                        : `${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${url}`;
                    })()}
                    alt={product.name}
                    className="object-contain p-8 mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
                    unoptimized
                    loading="lazy"
                  />
                )}
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest truncate max-w-[60%]">
                    {product.category?.name || 'New Arrival'}
                  </p>
                  <div className="flex items-center gap-1 bg-yellow-50 text-yellow-600 px-1.5 py-0.5 rounded text-[9px] font-bold">
                    <GoStarFill size={10} /> 4.9
                  </div>
                </div>

                <h3
                  className="text-sm font-bold mb-2 line-clamp-2 text-[#2D2D2D] group-hover:text-orange-500 transition-colors leading-snug h-[2.8em] overflow-hidden"
                >
                  {product.name}
                </h3>

                {/* Price */}
                <div className="flex flex-col mt-auto justify-end mb-3">
                  <p className="text-base md:text-xl font-black text-black leading-none">CA${formatPrice(salePrice)}</p>
                  {product.discount > 0 ? (
                    <p className="text-[9px] text-gray-400 line-through mt-1 font-bold">CA${formatPrice(product.price)}</p>
                  ) : (
                    <div className="h-[12px]"></div>
                  )}
                </div>

                {/* Action Buttons */}
                {product.productType === 'digital' ? (
                  <button
                    className="w-full bg-orange-500 text-white text-[9px] font-black uppercase tracking-widest py-2.5 rounded-lg hover:bg-orange-600 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-1.5"
                    onClick={(e) => { e.stopPropagation(); setSelectedDigitalProduct(product); setIsDigitalModalOpen(true); }}
                  >
                    <FiDownload size={12} /> Download
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className="flex items-center justify-center gap-1.5 border border-orange-500 text-orange-500 text-[9px] font-black uppercase tracking-widest py-2.5 rounded-lg hover:bg-orange-500 hover:text-white transition-all"
                      onClick={(e) => handleAddToCart(product, e)}
                    >
                      <FiShoppingCart size={12} /> Add
                    </button>
                    <button
                      className="bg-orange-500 text-white text-[9px] font-black uppercase tracking-widest py-2.5 rounded-lg hover:bg-orange-600 transition-all shadow-lg active:scale-95"
                      onClick={(e) => handleBuyNow(product, e)}
                    >
                      Buy Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Digital Checkout Modal */}
      {selectedDigitalProduct && (
        <DigitalCheckoutModal
          isOpen={isDigitalModalOpen}
          onRequestClose={() => setIsDigitalModalOpen(false)}
          product={selectedDigitalProduct}
          onSuccess={() => {
            setIsDigitalModalOpen(false);
            router.push(`/customer/pages/products/${selectedDigitalProduct.slug}`);
          }}
        />
      )}
    </div>
  );
};

export default NewArrivals;
