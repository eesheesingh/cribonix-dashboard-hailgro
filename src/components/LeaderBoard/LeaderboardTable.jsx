import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { filterBlack, filterBtn, leftArrow, rightArrow } from '../../assets';

const LeaderboardTable = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isFilterClicked, setIsFilterClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleFilterButtonClick = () => {
    setIsFilterClicked(!isFilterClicked);
    setCurrentPage(1); // Reset current page when filter button is clicked
  };

  const handleFilterChange = ({ startDate, endDate }) => {
    setStartDate(startDate);
    setEndDate(endDate);
    setCurrentPage(1); // Reset current page when filter criteria change
  };

  const handleClearDates = () => {
    setStartDate(null);
    setEndDate(null);
    setCurrentPage(1); // Reset current page when dates are cleared
  };

  const fetchData = async (page) => {
    setLoading(true);
    try {
      const storedStackIdData = localStorage.getItem("stackIdData");
      if (storedStackIdData) {
        const data = JSON.parse(storedStackIdData);
        const affiliateId = data.id; // Use the ID from stackIdData
        const response = await fetch(`https://copartners.in:5133/api/APDashboard/GetDashboardAPListingData/${affiliateId}?page=${page}&pageSize=10`);
        const result = await response.json();
        setCustomers(result.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const filteredData = customers.filter((item) => {
    const itemDate = new Date(item.userJoiningDate.split('T')[0]);
    if (startDate && endDate) {
      return itemDate >= startDate && itemDate <= endDate;
    } else if (startDate) {
      return itemDate >= startDate;
    } else if (endDate) {
      return itemDate <= endDate;
    }
    return true; // If neither start nor end date is specified, show all data
  });

  // Sort data by date in descending order
  filteredData.sort((a, b) => new Date(b.userJoiningDate) - new Date(a.userJoiningDate));

  // Pagination
  const dataPerPage = 10;
  const totalPages = Math.ceil(filteredData.length / dataPerPage);
  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getSubscriptionName = (subscriptionId) => {
    switch (subscriptionId) {
      case '1':
        return "Commodity";
      case '2':
        return "Equity";
      case '3':
        return "Options";
      default:
        return "N/A";
    }
  };

  return (
    <div className="table-responsive mt-5 relative">
      <div className='flex justify-between items-center'>
        <span className='md:text-[30px] text-[20px] font-semibold'>Customers Listing</span>
        <button
          className="bg-transparent border-[1px] text-white px-5 py-3 rounded-lg transition duration-300 hover:bg-[#fff] hover:text-[#000]"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleFilterButtonClick}
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
      {isFilterClicked && (
        <div className="absolute right-0 mt-5 mr-4 z-10">
          <div className="bg-[#000] rounded-[30px] p-4 flex flex-col gap-3">
            <DatePicker
              selected={startDate}
              onChange={(date) => handleFilterChange({ startDate: date, endDate })}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="From Date"
              className="bg-transparent text-white border-b border-white" // Apply custom styles here
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
              onChange={(date) => handleFilterChange({ startDate, endDate: date })}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              placeholderText="To Date"
              className="bg-transparent text-white border-b border-white" // Apply custom styles here
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
        <table className='md:w-full w-[105%]'>
          <thead>
            <tr className='uppercase'>
              <th>Date</th>
              <th>Mobile Number</th>
              <th>Subscription</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="text-center p-4">Loading...</td></tr>
            ) : (
              currentData.map((item, index) => (
                <tr key={index} className='text-center'>
                  <td>{formatDate(item.userJoiningDate)}</td>
                  <td>{item.userMobileNo.replace(/^\d{6}/, '******')}</td>
                  <td>{getSubscriptionName(item.subscription)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-end mt-4">
          <div className="pagination flex items-center">
            <span className="mr-2 text-sm text-gray-500">{`Page ${currentPage} of ${totalPages}`}</span>
            <span className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button onClick={() => paginate(currentPage - 1)} className="page-link border border-[#ffffff4a] p-2 rounded-[50%]">
                <img src={leftArrow} alt="Left Arrow" className="w-4 h-4 " />
              </button>
            </span>
            <span className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button onClick={() => paginate(currentPage + 1)} className="page-link border border-[#ffffff4a] p-2 rounded-[50%]">
                <img src={rightArrow} alt="Right Arrow" className="w-4 h-4" />
              </button>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderboardTable;
