import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { filterBlack, filterBtn, invoiceBtn, leftArrow, rightArrow } from '../../assets';

const TransactionTable = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const filterRef = useRef(null);

  const fetchTransactions = async (page) => {
    setLoading(true);
    try {
      const storedStackIdData = localStorage.getItem("stackIdData");
      if (storedStackIdData) {
        const data = JSON.parse(storedStackIdData);
        const affiliateId = data.id;
        const response = await axios.get(`https://copartners.in:5135/api/Withdrawal/GetWithdrawalByUserId/${affiliateId}?userType=AP&page=${page}&pageSize=${itemsPerPage}`);
        if (response.data.isSuccess) {
          const filteredData = response.data.data.filter((item) => item.requestAction === 'A');
          const transactionsWithDetails = await Promise.all(filteredData.map(async (transaction) => {
            const detailsResponse = await axios.get(`https://copartners.in:5135/api/Withdrawal/GetBankUPIById/${transaction.withdrawalModeId}`);
            const details = detailsResponse.data.data || {};
            return {
              ...transaction,
              bankName: details.bankName || 'N/A',
              accountNumber: details.accountNumber || details.upI_ID || 'N/A',
            };
          }));
          setTransactions(transactionsWithDetails);
          setTotalPages(Math.ceil(response.data.totalCount / itemsPerPage));
        }
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
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

  const filteredData = transactions.filter((item) => {
    const itemDate = new Date(item.transactionDate);
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
    <div className='mt-4'>
      <div className='flex justify-between items-center'>
        <span className='md:text-[30px] text-[20px] font-semibold'>Transaction History</span>
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
            <tr>
              <th className="text-center text-[15px]">TRANSACTION ID</th>
              <th className="text-center text-[15px]">Date</th>
              <th className="text-center text-[15px]">Bank</th>
              <th className="text-center text-[15px]">Account Number</th>
              <th className="text-center text-[15px]">Amount</th>
              {/* <th className="text-center text-[15px]">Invoice</th> */}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center p-4">Loading...</td>
              </tr>
            ) : (
              currentItems.map((transaction, index) => (
                <tr key={index}>
                  <td className="text-center">{transaction.transactionId}</td>
                  <td className="text-center">{transaction.transactionDate ? new Date(transaction.transactionDate).toLocaleDateString() : 'N/A'}</td>
                  <td className="text-center">{transaction.bankName}</td>
                  <td className="text-center">{transaction.accountNumber}</td>
                  <td className="text-center">{transaction.amount}</td>
                  {/* <td className="text-center flex justify-center">
                    <img src={invoiceBtn} alt="" className="w-5" />
                  </td> */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end items-center gap-2 mt-4">
        <span className='mr-2 text-sm text-gray-500'>{`Page ${currentPage} of ${totalPages}`}</span>
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="page-link border border-[#ffffff4a] p-2 rounded-[50%]">
          <img src={leftArrow} alt="Previous" className="w-4 h-4" />
        </button>
        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="page-link border border-[#ffffff4a] p-2 rounded-[50%]">
          <img src={rightArrow} alt="Next" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TransactionTable;
