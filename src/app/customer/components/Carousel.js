'use client';
import React, { useEffect, useState } from 'react';
import { Zoom } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

function Slider() {
  const [slides, setSlides] = useState([]);

  const fetchSlides = async () => {
    try {
      const response = await fetch('/api/slider');
      if (!response.ok) {
        throw new Error('Failed to fetch slides');
      }
      const data = await response.json();
      const formattedSlides = data.map(slide => ({
        image: slide.imgurl?.startsWith('http') || slide.imgurl?.startsWith('data:')
          ? slide.imgurl
          : `${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${slide.imgurl}`,
        link: slide.link,
      }));
      setSlides(formattedSlides);
    } catch (error) {
      console.error('Error fetching slides:', error);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const [companyName, setcompanyName] = useState('');
  const [companyHeaderImage, setcompanyHeaderImage] = useState('');
  const [companyicon, setcompanyicon] = useState('');
  useEffect(() => {
    async function fetchCompanyDetails() {
      console.log("Fetching company details...");
      try {
        const response = await fetch('/api/companydetails');
        const data = await response.json();
        console.log("Fetched data:", data);
        if (data) {
          console.log("data is : ", data);
          setcompanyName(data.name);
          setcompanyHeaderImage(data.headerImage);
          setcompanyicon(data.favIcon);
          console.log("Company data is ", data);
        }
      } catch (error) {
        console.error('Error fetching company details:', error);
      }
    }
    fetchCompanyDetails();
  }, []);



  return (
    <div className="relative slide-container bg-white text-black h-[350px] md:h-[450px] lg:h-[600px]">
      <Zoom scale={0.4} duration={2000} autoPlay={true}>
        {slides.map((slide, index) => (
          <div key={index} className="relative h-full">
            <a href={slide.link} target="_blank" rel="noopener noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.image}
                className="w-full h-[350px] md:h-[450px] lg:h-[600px] object-cover"
                alt={`Slide ${index}`}
                loading="eager"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none bg-gradient-to-t from-orange-900/40 to-transparent">
                <h1 className='text-2xl md:text-4xl lg:text-5xl font-bold text-white pb-3 text-center px-2'>
                  Welcome to Our {companyName}
                </h1>
                <p className='w-[90%] md:w-[680px] lg:w-[800px] mx-auto pb-10 text-center text-white px-4'>
                  Discover a variety of products at unbeatable prices. Shop now and enjoy a seamless online shopping experience with us!
                </p>
              </div>
            </a>
          </div>
        ))}
      </Zoom>
    </div>
  );
}

export default Slider;
