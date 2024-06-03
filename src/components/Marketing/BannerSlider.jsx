import React, { useRef, useState } from 'react';
import './BannerSlider.css';
import { banner2 } from '../../assets';

const BannerSlider = () => {
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const sliderRef = useRef(null);

  const handleMouseDown = (e) => {
    setDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 3; // Adjust scroll speed
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  return (
    <div
      className="banner-slider"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      ref={sliderRef}
    >
      <div className="banner-slider__container">
        <img src={banner2} alt="1" className="banner-slider__item" />
        <img src={banner2} alt="2" className="banner-slider__item" />
        <img src={banner2} alt="3" className="banner-slider__item" />
        <img src={banner2} alt="3" className="banner-slider__item" />
        <img src={banner2} alt="3" className="banner-slider__item" />
        <img src={banner2} alt="3" className="banner-slider__item" />

        {/* Add more images as needed */}
      </div>
    </div>
  );
};

export default BannerSlider;
