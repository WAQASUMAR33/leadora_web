'use client';
import React, { useEffect, useState, useCallback } from 'react';

function Slider() {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [companyName, setcompanyName] = useState('');

  useEffect(() => {
    async function fetchSlides() {
      try {
        const response = await fetch('/api/slider');
        if (!response.ok) throw new Error('Failed to fetch slides');
        const data = await response.json();
        const formatted = data.map(slide => ({
          image: slide.imgurl?.startsWith('http') || slide.imgurl?.startsWith('data:')
            ? slide.imgurl
            : `${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${slide.imgurl}`,
          link: slide.link,
        }));
        setSlides(formatted);
      } catch (error) {
        console.error('Error fetching slides:', error);
      }
    }
    fetchSlides();
  }, []);

  useEffect(() => {
    async function fetchCompanyDetails() {
      try {
        const response = await fetch('/api/companydetails');
        const data = await response.json();
        if (data) setcompanyName(data.name);
      } catch (error) {
        console.error('Error fetching company details:', error);
      }
    }
    fetchCompanyDetails();
  }, []);

  const next = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-advance
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, 3000);
    return () => clearInterval(timer);
  }, [slides.length, next]);

  if (slides.length === 0) {
    return (
      <div className="relative w-full h-[350px] md:h-[450px] lg:h-[600px] bg-gray-100" />
    );
  }

  return (
    <div className="relative w-full h-[350px] md:h-[450px] lg:h-[600px] overflow-hidden bg-gray-100">
      {slides.map((slide, index) => (
        <div
          key={index}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: index === currentIndex ? 1 : 0, zIndex: index === currentIndex ? 1 : 0 }}
        >
          <a href={slide.link || '#'} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.image}
              alt={`Slide ${index + 1}`}
              className="w-full h-[350px] md:h-[450px] lg:h-[600px] object-cover"
            />
          </a>
        </div>
      ))}

      {/* Overlay text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none bg-gradient-to-t from-orange-900/40 to-transparent">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white pb-3 text-center px-2">
          Welcome to Our {companyName}
        </h1>
        <p className="w-[90%] md:w-[680px] lg:w-[800px] mx-auto pb-10 text-center text-white px-4">
          Discover a variety of products at unbeatable prices. Shop now and enjoy a seamless online shopping experience with us!
        </p>
      </div>

      {/* Prev / Next arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full w-9 h-9 flex items-center justify-center"
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full w-9 h-9 flex items-center justify-center"
            aria-label="Next slide"
          >
            ›
          </button>
        </>
      )}

      {/* Dot indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? 'bg-white' : 'bg-white/50'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Slider;
