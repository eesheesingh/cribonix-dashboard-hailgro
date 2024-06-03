import React, { useEffect, useState } from 'react';
import { close } from '../../assets';
import VerifyKycPopup from './VerifyKycPopup';

const WithdrawalPopup = ({ isOpen, onClose }) => {
  const [panCard, setPanCard] = useState('');
  const [verifyPopupOpen, setVerifyPopupOpen] = useState(false); // State to manage the KYC verification popup


  useEffect(() => {
    // Function to disable scrolling when the popup is open
    const disableScroll = () => {
      if (isOpen) {
        document.documentElement.style.overflow = 'hidden';
      } else {
        document.documentElement.style.overflow = 'auto';
      }
    };

    // Call the function when the component mounts or isOpen changes
    disableScroll();

    // Cleanup function to enable scrolling when the component unmounts
    return () => {
      document.documentElement.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleChange = (e) => {
    const value = e.target.value;
    // Ensure only numbers are entered
    if (/^\d*$/.test(value)) {
      // Limit input to 10 digits
      if (value.length <= 10) {
        setPanCard(value);
      }
    }
  };

  const handleVerify = () => {
    // Implement PAN card verification logic here
    console.log('PAN Card:', panCard);
    // Open the KYC verification popup
    setVerifyPopupOpen(true);
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-[#2E374B] p-8 rounded-[20px] shadow-lg relative w-[400px]">
            <div className="absolute top-2 right-2">
              <button onClick={onClose}>
                <img src={close} alt="Close" className="w-10 h-10" />
              </button>
            </div>
            <div className='p-5'>
              <h2 className="text-[24px] font-semibold">Pan Card Verification</h2>
              <p className="text-[#c9c9c9] mt-2">Full access to in any of our products Full access to in any of </p>
            </div>
            <input
              type="text"
              className="border border-[#ffffff4d] bg-transparent rounded-md px-3 py-2 mt-2 w-full"
              placeholder="PAN Card Number"
              value={panCard}
              onChange={handleChange}
            />
            <div className="mt-4">
              <button
                className="bg-[#000] text-white hover:text-[#000] px-4 py-4 rounded-md w-full hover:bg-[#fff] transition duration-300"
                onClick={handleVerify}
              >
                Verify
              </button>
            </div>
          </div>
          
        </div>
      )}
      {verifyPopupOpen && <VerifyKycPopup onClose={() => setVerifyPopupOpen(false)} />}
    </>
  );
};

export default WithdrawalPopup;
