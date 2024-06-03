import React, { useEffect, useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import WalletTable from './WalletTable';
import WalletChart from './WalletChart';
import WalletChartMob from './WalletChartMob';
import BankListingPopup from '../Popups/BankListingPopup';

const WalletPage = () => {
  const [activeButtonFirstSection, setActiveButtonFirstSection] = useState('weekly');
  const [isBankListingPopupOpen, setIsBankListingPopupOpen] = useState(false);
  const [withdrawalBalance, setWithdrawalBalance] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);
  const [isCustomPickerVisible, setIsCustomPickerVisible] = useState(false);

  const customPickerRef = useRef(null);

  const fetchWalletBalance = async () => {
    try {
      const storedStackIdData = localStorage.getItem("stackIdData");
      if (storedStackIdData) {
        const data = JSON.parse(storedStackIdData);
        const stackId = data.id; // Assuming the stackId is stored in data.id
        const response = await fetch(`https://copartners.in:5135/api/Wallet/GetWalletWithdrawalBalance/${stackId}?userType=AP`);
        const result = await response.json();
        if (result.isSuccess) {
          setWalletBalance(result.data.walletBalance);
          setWithdrawalBalance(result.data.withdrawalBalance);
        } else {
          console.error('Error fetching wallet balance:', result.displayMessage);
        }
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    }
  };

  useEffect(() => {
    fetchWalletBalance();
  }, []);

  const toggleBankListingPopup = () => {
    setIsBankListingPopupOpen(!isBankListingPopupOpen);
  };

  const formatBalance = (balance) => {
    return balance % 1 === 0 ? balance.toFixed(0) : balance.toFixed(2);
  };

  const handleCustomButtonClick = () => {
    setActiveButtonFirstSection("custom");
    setIsCustomPickerVisible(!isCustomPickerVisible);
  };

  const handleDateChange = (start, end) => {
    setCustomStartDate(start);
    setCustomEndDate(end);
    setIsCustomPickerVisible(false);
  };

  const handleClearDates = () => {
    setCustomStartDate(null);
    setCustomEndDate(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (customPickerRef.current && !customPickerRef.current.contains(event.target)) {
        setIsCustomPickerVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [customPickerRef]);

  return (
    <div className="xl:pt-3 md:p-4 sm:ml-[10rem] text-white">
      <div className="md:p-1 p-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 xl:mt-[70px] md:mt-14 mt-[70px]">
        <div className="text-white text-center">
          <div className="flex md:flex-row flex-col justify-between mt-2">
            <h2 className="md:text-left text-left md:text-[22px] text-[30px] xl:text-[40px] font-semibold w-full">Earning Analysis</h2>
            <div className="space-x-4 md:mr-1 xl:mr-[20px] flex w-full md:justify-end md:items-center xl:items-center justify-start">
              <div>
                <button
                  className={`button ${activeButtonFirstSection === 'weekly' ? 'bg-[#fff] text-[#000]' : 'bg-transparent'} border-[1px] hover:bg-[#fff] hover:text-[#000] transition duration-300 py-2 px-2 md:px-6 rounded`}
                  onClick={() => setActiveButtonFirstSection('weekly')}
                >
                  Weekly
                </button>
              </div>
              <div>
                <button
                  className={`button ${activeButtonFirstSection === 'monthly' ? 'bg-[#fff] text-[#000]' : 'bg-transparent'} border-[1px] hover:bg-[#fff] hover:text-[#000] transition duration-300 py-2 px-2 md:px-6 rounded`}
                  onClick={() => setActiveButtonFirstSection('monthly')}
                >
                  Monthly
                </button>
              </div>
              <div className="relative inline-block">
                <button
                  className={`button ${activeButtonFirstSection === "custom" ? "bg-[#fff] text-[#000]" : "bg-transparent"} border-[1px] hover:bg-[#fff] hover:text-[#000] transition duration-300 py-2 px-2 md:px-6 rounded flex items-center`}
                  onClick={handleCustomButtonClick}
                >
                  Custom
                </button>
                {isCustomPickerVisible && (
                  <div ref={customPickerRef} className="absolute top-full right-0 mt-2 z-10 bg-[#2b2d42] p-4 rounded-lg shadow-lg flex flex-col gap-3">
                    <DatePicker
                      selected={customStartDate}
                      onChange={(date) => setCustomStartDate(date)}
                      selectsStart
                      startDate={customStartDate}
                      endDate={customEndDate}
                      placeholderText="Start Date"
                      className="bg-transparent text-white border-b border-white mb-2"
                      renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
                        <div className="flex justify-between items-center">
                          <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>{'<'}</button>
                          <select value={date.getFullYear()} onChange={({ target: { value } }) => changeYear(parseInt(value))}>
                            {Array.from({ length: 80 }, (_, i) => new Date().getFullYear() - 79 + i).map(year => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                          </select>
                          <select value={date.getMonth()} onChange={({ target: { value } }) => changeMonth(parseInt(value))}>
                            {Array.from({ length: 12 }, (_, i) => i).map(month => (
                              <option key={month} value={month}>{new Date(0, month).toLocaleString(undefined, { month: 'long' })}</option>
                            ))}
                          </select>
                          <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>{'>'}</button>
                        </div>
                      )}
                    />
                    <DatePicker
                      selected={customEndDate}
                      onChange={(date) => handleDateChange(customStartDate, date)}
                      selectsEnd
                      startDate={customStartDate}
                      endDate={customEndDate}
                      minDate={customStartDate}
                      placeholderText="End Date"
                      className="bg-transparent text-white border-b border-white"
                      renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
                        <div className="flex justify-between items-center">
                          <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>{'<'}</button>
                          <select value={date.getFullYear()} onChange={({ target: { value } }) => changeYear(parseInt(value))}>
                            {Array.from({ length: 80 }, (_, i) => new Date().getFullYear() - 79 + i).map(year => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                          </select>
                          <select value={date.getMonth()} onChange={({ target: { value } }) => changeMonth(parseInt(value))}>
                            {Array.from({ length: 12 }, (_, i) => i).map(month => (
                              <option key={month} value={month}>{new Date(0, month).toLocaleString(undefined, { month: 'long' })}</option>
                            ))}
                          </select>
                          <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>{'>'}</button>
                        </div>
                      )}
                    />
                    <button
                      onClick={handleClearDates}
                      className="bg-[#fff] text-[#000] px-4 py-1 rounded-md focus:outline-none"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full flex justify-center md:w-[40%] cursor-pointer md:hidden mt-2">
              <WalletChartMob activeButton={activeButtonFirstSection} customStartDate={customStartDate} customEndDate={customEndDate} />
            </div>
          </div>

          <div className="flex md:flex-row flex-col mt-8 gap-3 md:justify-center">
            <div className="w-full xl:[59%] md:w-2/3 container-bg rounded-[30px]">
              <div className='flex md:flex-row flex-col xl:p-7 md:p-4 justify-between items-center'>
                <h3 className="text-left font-semibold md:text-[30px] text-[28px] xl:text-[50px]">Total Earning</h3>
              </div>
              <div>
                <div className='flex md:flex-row flex-col justify-start gap-3 p-3'>
                  <div className='walletBox border-[1px] xl:w-1/2 md:w-1/2 border-[#ffffff4c] rounded-[30px] p-4'>
                    <div className='flex flex-row justify-between border-b-[1px] border-[#ffffff4c] pb-2'>
                      <span className='md:text-[20px] text-[16px]'>
                        Total Earned
                      </span>
                    </div>
                    <div className='flex flex-col items-start px-2'>
                      <span className='text-gradient xl:text-[100px] md:text-[50px] text-[50px] font-bold text-left'>
                        {walletBalance !== null ? `₹${formatBalance(walletBalance)}` : 'Loading...'}
                      </span>
                      <p className='text-[#c9c9c9] text-left md:text-[18px] text-[15px]'>Congratulations on your Earnings</p>
                    </div>
                  </div>
                  <div className='walletBox border-[1px] border-[#ffffff4c] xl:w-1/2 md:w-1/2 rounded-[30px] p-4'>
                    <div className='flex flex-row justify-between border-b-[1px] border-[#ffffff4c] pb-2'>
                      <div className="flex w-full items-center justify-between gap-5 ">
                        <span className='md:text-[20px] text-[16px]'>
                          Balance:
                        </span>
                        <button className="bg-[#fff] hover:bg-[#000] text-[#000] hover:text-[#fff] transition duration-300 py-1 px-3 rounded" onClick={() => setIsBankListingPopupOpen(true)}>
                          Withdrawal
                        </button>
                      </div>
                    </div>
                    <div className='flex flex-col items-start px-2'>
                      <span className='text-gradient xl:text-[100px] md:text-[50px] text-[50px] font-bold text-left'>
                        {withdrawalBalance !== null ? `₹${formatBalance(withdrawalBalance)}` : 'Loading...'}
                      </span>
                      <p className='text-[#c9c9c9] text-left md:text-[18px] text-[15px]'>Current Balance available in your Wallet</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full justify-center md:w-[40%] cursor-pointer md:flex hidden">
              <WalletChart activeButton={activeButtonFirstSection} customStartDate={customStartDate} customEndDate={customEndDate} />
            </div>
            {isBankListingPopupOpen && <BankListingPopup onClose={toggleBankListingPopup} />}
          </div>
        </div>
        <div className='mt-5'>
          <WalletTable />
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
