import React, { useRef, useState } from 'react'
import { banner } from '../../assets';

const BannerSliderVideo = () => {
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
        {/* Render images */}
        <img src={banner} alt="Image 1" className="banner-slider__item" />
        <img src={banner} alt="Image 2" className="banner-slider__item" />
        <img src={banner} alt="Image 3" className="banner-slider__item" />
        <img src={banner} alt="Image 3" className="banner-slider__item" />
        <img src={banner} alt="Image 3" className="banner-slider__item" />
        <img src={banner} alt="Image 3" className="banner-slider__item" />

        {/* Add more images as needed */}
      </div>
    </div>
  );
};

export default BannerSliderVideo