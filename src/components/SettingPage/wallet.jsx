import React, { useState } from 'react';
import { customBtn } from '../../assets';
import WalletTable from './WalletTable';
import WithdrawalPopup from '../Popups/WithdrawalPopup';
import WalletChart from './WalletChart';

const Wallet = () => {
  const [activeButtonFirstSection, setActiveButtonFirstSection] = useState('weekly');
  const [isWithdrawalPopupOpen, setIsWithdrawalPopupOpen] = useState(false);

  return (
    <div className="xl:py-1 md:p-4 sm:ml-[10rem] text-white">
    <div className="md:p-4 p-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 md:mt-14 mt-20">
      <div className="text-white text-center">
          {/* First Section */}
          <div className="flex md:flex-row flex-col justify-between mt-2">
            <h2 className="text-left md:text-[22px] xl:text-[40px] font-semibold">Earning Analysis</h2>
            <div className="flex items-center space-x-4 md:mr-1 xl:mr-[60px]">
            <button
                className={`button ${activeButtonFirstSection === 'today' ? 'bg-[#fff] text-[#000]' : 'bg-transparent'} border-[1px] hover:bg-[#fff] hover:text-[#000] transition duration-300 py-2 px-6 rounded`}
                onClick={() => setActiveButtonFirstSection('today')}
              >
                Today
              </button>
              <button
                className={`button ${activeButtonFirstSection === 'weekly' ? 'bg-[#fff] text-[#000]' : 'bg-transparent'} border-[1px] hover:bg-[#fff] hover:text-[#000] transition duration-300 py-2 px-6 rounded`}
                onClick={() => setActiveButtonFirstSection('weekly')}
              >
                Weekly
              </button>
              <button
                className={`button ${activeButtonFirstSection === 'monthly' ? 'bg-[#fff] text-[#000]' : 'bg-transparent'} border-[1px] hover:bg-[#fff] hover:text-[#000] transition duration-300 py-2 px-6 rounded`}
                onClick={() => setActiveButtonFirstSection('monthly')}
              >
                Monthly
              </button>
              <button
                className={`button ${activeButtonFirstSection === 'custom' ? 'bg-[#fff] text-[#000]' : 'bg-transparent'} border-[1px] hover:bg-[#fff] hover:text-[#000] transition duration-300 py-2 px-6 rounded flex items-center`}
                onClick={() => setActiveButtonFirstSection('custom')}
              >
                Custom
                <img src={customBtn} alt="" className="inline-block w-5 ml-1" />
              </button>
            </div>
          </div>
          <div className="flex md:flex-row flex-col mt-8 gap-3 justify-center">
            <div className="w-full xl:w-[59%] md:w-2/3 justify-center items-center container-bg rounded-[30px]">
              <div className='flex flex-row xl:p-7 md:p-4 justify-between items-center'>
                <h3 className="text-center font-semibold md:text-[30px] xl:text-[50px]">Total Earning</h3>
                <div className="flex flex-row items-center justify-between mt-2 gap-5 ">
                  <span className='text-[20px]'>
                    Withdrawal Balance: 200
                  </span>
                  <div className='p-2 items-center'>
                    <button className="bg-[#fff] hover:bg-[#000] text-[#000] hover:text-[#fff] transition duration-300 py-2 px-6 rounded" onClick={() => setIsWithdrawalPopupOpen(true)}>
                      Withdrawal
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <div className='flex flex-row justify-center gap-3 p-3'>
                  <div className='walletBox border-[1px] xl:w-1/2 md:w-1/2 border-[#ffffff4c] rounded-[30px] p-4'>
                    <div className='flex flex-row justify-between border-b-[1px] border-[#ffffff4c] pb-2'>
                      <div className='flex flex-col'>
                        <span className='text-[#c9c9c9] text-[20px]'>Level</span>
                        <span className='text-gradient text-[25px] font-bold text-left'>1</span>
                      </div>
                      <div className='flex flex-col'>
                        <span className='text-[#c9c9c9] text-[20px]'>Commission</span>
                        <span className='text-gradient text-[25px] font-bold text-right'>70%</span>
                      </div>
                    </div>
                    <div className='flex flex-col items-start px-2'>
                      <span className='text-gradient xl:text-[100px] md:text-[95px] font-bold text-left'>
                        ₹100
                      </span>
                      <p className='text-[#c9c9c9] text-left text-[18px]'>With Cobalt, managing your business. <span className='text-[#fff]'>Say no to spreadsheets.</span></p>
                    </div>
                  </div>
                  <div className='walletBox border-[1px] border-[#ffffff4c] xl:w-1/2 md:w-1/2 rounded-[30px] p-4'>
                    <div className='flex flex-row justify-between border-b-[1px] border-[#ffffff4c] pb-2'>
                      <div className='flex flex-col'>
                        <span className='text-[#c9c9c9] text-[20px]'>Level</span>
                        <span className='text-gradient text-[25px] font-bold text-left'>2</span>
                      </div>
                      <div className='flex flex-col'>
                        <span className='text-[#c9c9c9] text-[20px]'>Commission</span>
                        <span className='text-gradient text-[25px] font-bold text-right'>40%</span>
                      </div>
                    </div>
                    <div className='flex flex-col items-start px-2'>
                      <span className='text-gradient xl:text-[100px] md:text-[95px] font-bold text-left'>
                        ₹100
                      </span>
                      <p className='text-[#c9c9c9] text-left text-[18px]'>With Cobalt, managing your business. <span className='text-[#fff]'>Say no to spreadsheets.</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex justify-center md:w-[40%] cursor-pointer" >
              <WalletChart activeButton={activeButtonFirstSection}/>
            </div>
            {/* Withdrawal Popup */}
            <WithdrawalPopup isOpen={isWithdrawalPopupOpen} onClose={() => setIsWithdrawalPopupOpen(false)} />
          </div>
        </div>
        {/* <WalletTable /> */}
      </div>
    </div>
  );
};

export default Wallet;
