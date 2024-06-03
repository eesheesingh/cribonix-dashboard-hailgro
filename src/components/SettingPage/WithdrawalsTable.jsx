import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { filterBlack, filterBtn, leftArrow, rightArrow } from '../../assets';
import RejectPopup from '../Popups/RejectPopup';

const WithdrawalsTable = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [withdrawals, setWithdrawals] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const filterRef = useRef(null);
  const [rejectPopupOpen, setRejectPopupOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const fetchWithdrawals = async (page) => {
    setLoading(true);
    try {
      const storedStackIdData = localStorage.getItem("stackIdData");
      if (storedStackIdData) {
        const data = JSON.parse(storedStackIdData);
        const affiliateId = data.id;
        const response = await axios.get(`https://copartners.in:5135/api/Withdrawal/GetWithdrawalByUserId/${affiliateId}?userType=AP&page=${page}&pageSize=${itemsPerPage}`);
        if (response.data.isSuccess) {
          const sortedData = response.data.data
            .filter(withdrawal => withdrawal.requestAction !== 'A')
            .sort((a, b) => new Date(b.withdrawalRequestDate) - new Date(a.withdrawalRequestDate));
          const withdrawalsWithDetails = await Promise.all(sortedData.map(async (withdrawal) => {
            const detailsResponse = await axios.get(`https://copartners.in:5135/api/Withdrawal/GetBankUPIById/${withdrawal.withdrawalModeId}`);
            const details = detailsResponse.data.data || {};
            return {
              ...withdrawal,
              bankName: details.bankName || 'N/A',
              accountNumber: details.accountNumber || details.upI_ID || 'N/A',
            };
          }));
          setWithdrawals(withdrawalsWithDetails);
          setTotalPages(Math.ceil(withdrawalsWithDetails.length / itemsPerPage));
        }
      }
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals(currentPage);
  }, [currentPage]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleReject = (reason) => {
    setRejectReason(reason);
    setRejectPopupOpen(true);
  };

  const handleFilterChange = ({ startDate, endDate }) => {
    setStartDate(startDate);
    setEndDate(endDate);
    setCurrentPage(1);
    closeFilterModal();
  };

  const openFilterModal = () => {
    setIsFilterOpen(true);
  };

  const closeFilterModal = () => {
    setIsFilterOpen(false);
  };

  const handleClearDates = () => {
    setStartDate(null);
    setEndDate(null);
    setCurrentPage(1);
  };

  const handleClickOutside = (event) => {
    if (filterRef.current && !filterRef.current.contains(event.target)) {
      closeFilterModal();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredData = withdrawals.filter((item) => {
    const itemDate = new Date(item.withdrawalRequestDate);
    if (startDate && endDate) {
      return itemDate >= startDate && itemDate <= endDate;
    } else if (startDate) {
      return itemDate >= startDate;
    } else if (endDate) {
      return itemDate <= endDate;
    }
    return true;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div>
      <div className='flex justify-between items-center'>
        <span className='md:text-[30px] text-[20px] font-semibold'>Withdrawals Listing</span>
        <button
          className="bg-transparent border-[1px] text-white px-5 py-3 rounded-lg transition duration-300 hover:bg-[#fff] hover:text-[#000]"
          onClick={openFilterModal}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {isHovered ? (
            <>
              <img src={filterBlack} alt="" className="inline-block w-[12px] mr-[8px]" />
              Filter
            </>
          ) : (
            <>
              <img src={filterBtn} alt="" className="inline-block w-4 mr-1" />
              Filter
            </>
          )}
        </button>
      </div>
      {isFilterOpen && (
        <div ref={filterRef} className="absolute right-0 mt-5 mr-4 z-10">
          <div className="bg-[#000] rounded-[30px] p-4 flex flex-col gap-3">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Start Date"
              className="bg-transparent text-white border-b border-white"
              renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
                <div className="flex justify-center">
                  <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>&lt;</button>
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
                  <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>&gt;</button>
                </div>
              )}
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              placeholderText="End Date"
              className="bg-transparent text-white border-b border-white"
              renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
                <div className="flex justify-center">
                  <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>&lt;</button>
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
                  <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>&gt;</button>
                </div>
              )}
            />
            <div className='flex items-center justify-center'>
              <button onClick={handleClearDates} className="bg-[#fff] text-[#000] px-4 py-1 rounded-md focus:outline-none">Clear Dates</button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 overflow-x-auto rounded-[30px] border-[#ffffff3e] border">
        <table className='md:w-full w-[200%]'>
          <thead>
            <tr className='uppercase'>
              <th className="text-center text-[15px]">Date</th>
              <th className="text-center text-[15px]">Status</th>
              <th className="text-center text-[15px]">Amount</th>
              <th className="text-center text-[15px]">WITHDRAWAL Request ID</th>
              <th className="text-center text-[15px]">Account Number</th>
              <th className="text-center text-[15px]">Bank</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center p-4">Loading...</td>
              </tr>
            ) : (
              currentItems.map((withdrawal, index) => (
                <tr key={index}>
                  <td className="text-center">{withdrawal.withdrawalRequestDate ? new Date(withdrawal.withdrawalRequestDate).toLocaleDateString() : 'N/A'}</td>
                  <td className="text-center text-[#f5b53f] font-semibold">
                    {withdrawal.requestAction === 'P' ? (
                      'Pending'
                    ) : (
                      <button
                        className="text-[#fff] bg-red-500 px-3 py-1 rounded-lg focus:outline-none"
                        onClick={() => handleReject(withdrawal.rejectReason)}
                      >
                        Reject
                      </button>
                    )}
                  </td>
                  <td className="text-center">{withdrawal.amount}</td>
                  <td className="text-center">{withdrawal.id ? withdrawal.id.substring(0, 5) : 'N/A'}</td>
                  <td className="text-center">{withdrawal.accountNumber || 'N/A'}</td>
                  <td className="text-center">{withdrawal.bankName || 'N/A'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end items-center gap-2 mt-4">
        <span className='mr-2 text-sm text-gray-500'>{`Page ${currentPage} of ${totalPages}`}</span>
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="page-link border border-[#ffffff4a] p-2 rounded-[50%]">
          <img src={leftArrow} alt="Previous" className="w-5 h-6" />
        </button>
        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="page-link border border-[#ffffff4a] p-2 rounded-[50%]">
          <img src={rightArrow} alt="Next" className="w-5 h-6" />
        </button>
      </div>

      {rejectPopupOpen && (
        <RejectPopup onClose={() => setRejectPopupOpen(false)} reason={rejectReason} />
      )}
    </div>
  );
};

export default WithdrawalsTable;
