import React, { useState, useRef, useEffect } from 'react';
import { close } from '../assets';

const EarningPopup = ({ onClose }) => {
  const [sliderValue, setSliderValue] = useState(0);
  const [thumbPosition, setThumbPosition] = useState(0);
  const rangeRef = useRef(null);

  useEffect(() => {
    updateRangeValuePosition();
  }, [sliderValue]);

  const handleSubmit = () => {
    onClose();
  };

  const handleSliderChange = (event) => {
    setSliderValue(event.target.value);
  };

  const updateRangeValuePosition = () => {
    const thumbWidth = 20; // Width of the thumb
    const sliderWidth = rangeRef.current.offsetWidth;
    const calculatedThumbPosition = (sliderValue / 100) * (sliderWidth - thumbWidth);
    setThumbPosition(calculatedThumbPosition);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#2E374B] p-4 rounded-[20px] shadow-lg relative text-[#fff] md:w-[800px] w-[350px]">
        <div className="flex flex-row justify-between items-center mb-4 mt-4">
          <h2 className="text-[35px] font-semibold">Earning Calculator</h2> {/* Adjusted font size */}
          <div className="sm:text-sm md:text-lg"> {/* Adjusted font size */}
          Estimate your potential profits with copartner.
          </div>
          <button onClick={onClose} className="absolute top-3 right-1">
            <img src={close} alt="Close" className="w-8 h-8" /> {/* Adjusted image size */}
          </button>
        </div>

        {/* Range Slider */}
        <div className="relative flex justify-center mt-8"> {/* Adjusted margin top */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderValue}
            onChange={handleSliderChange}
            className="custom-slider" // Apply custom styling class
            ref={rangeRef}
          />
          <div
            className="range-value"
            style={{ left: sliderValue === '0' ? '0' : `${thumbPosition}px` }}
          >
            {sliderValue}
          </div>
        </div>

        <div className="flex flex-wrap items-center mt-6"> {/* Adjusted margin top */}
          <div className="flex flex-col p-2 hover:bg-[#00000047]  rounded-[10px] mb-2 mr-2 justify-start"> {/* Adjusted padding and margin */}
            <span className="md:text-[30px] font-bold subheading-color">1st Year Earning</span> {/* Adjusted font size */}
            <span className="font-bold md:text-[30px] text-[20px] text-[#fff]">1,60,000</span> {/* Adjusted font size */}
            <p className="text-sm">Total Amount Earned</p> {/* Adjusted font size */}
          </div>

          <div className="flex flex-col p-2 hover:bg-[#00000047]  rounded-[10px] mb-2 mr-2 justify-start"> {/* Adjusted padding and margin */}
            <span className="md:text-[30px] font-bold subheading-color">2nd Year Earning</span> {/* Adjusted font size */}
            <span className="font-bold md:text-[30px] text-[20px] text-[#fff]">2,60,000</span> {/* Adjusted font size */}
            <p className="text-sm">Total Amount Earned</p> {/* Adjusted font size */}
          </div>

          <div className="flex flex-col p-2 hover:bg-[#00000047]  rounded-[10px] justify-start"> {/* Adjusted padding and margin */}
            <span className="md:text-[30px] font-bold subheading-color">3rd Year Earning</span> {/* Adjusted font size */}
            <span className="font-bold md:text-[30px] text-[20px] text-[#fff]">3,60,000</span> {/* Adjusted font size */}
            <p className="text-sm">Total Amount Earned</p> {/* Adjusted font size */}
          </div>
        </div>

        {/* <div className="flex flex-wrap justify-start mt-2">
         
        </div> */}
      </div>
    </div>
  );
};

export default EarningPopup;
