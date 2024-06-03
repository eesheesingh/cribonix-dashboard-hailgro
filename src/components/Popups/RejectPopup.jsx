import React from 'react';
import { close } from '../../assets';

const RejectPopup = ({ onClose, reason }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#2E374B] p-3 rounded-[20px] shadow-lg relative md:w-[400px] w-[350px]">
        <div className="absolute top-2 right-2">
          <button onClick={onClose}>
            <img src={close} alt="Close" className="w-10 h-10" />
          </button>
        </div>
        <div className='p-5'>
          <h2 className="text-[24px] font-semibold">Reason</h2>
          <p className="text-[#c9c9c9] mt-2">{reason || "No reason provided"}</p>
        </div>
      </div>
    </div>
  );
};

export default RejectPopup;
