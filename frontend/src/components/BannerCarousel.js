import { useEffect, useState } from 'react';
import './BannerCarousel.css';

const banners = [
  {
    image: 'Banner1.png',
    alt: 'Delicious Pizza Deals',
    text: '🔥 Flat 30% OFF on First Order!',
  },
  {
    image: 'Banner2.png',
    alt: 'Customize Your Pizza',
    text: '🍕 Make Your Own Pizza from Scratch!',
  },
  {
    image: 'Banner3.png',
    alt: 'Order Now',
    text: '⚡ Fast Delivery within 30 Minutes!',
  },
];

const BannerCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000); // Auto slide every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <div className="banner-carousel">
      <button onClick={handlePrev} className="nav-button left">&#8249;</button>

      <div className="banner-slide active">
        <img
          src={banners[currentIndex].image}
          alt={banners[currentIndex].alt}
          className="banner-image"
        />
        <div className="banner-text">{banners[currentIndex].text}</div>
      </div>

      <button onClick={handleNext} className="nav-button right">&#8250;</button>
    </div>
  );
};

export default BannerCarousel;
