import React, { useState, useEffect } from 'react';
import { leftArrow, rightArrow } from '../../assets';

const DashboardTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const dataPerPage = 10;

  const fetchData = async (page) => {
    setLoading(true);
    try {
      const storedStackIdData = localStorage.getItem("stackIdData");
      if (storedStackIdData) {
        const data = JSON.parse(storedStackIdData);
        const affiliateId = data.id; // Use the ID from stackIdData
        const response = await fetch(`https://copartners.in:5133/api/APDashboard/GetDashboardAPListingData/${affiliateId}?page=${page}&pageSize=${dataPerPage}`);
        const result = await response.json();
        const filteredData = result.data.filter(item => item.subscription !== '0');
        // Sort data by date in descending order
        filteredData.sort((a, b) => new Date(b.subscribeDate) - new Date(a.subscribeDate));
        setData(filteredData);
        setTotalPages(Math.ceil(result.totalCount / dataPerPage));
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

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
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
    <div className="relative">
      {/* Heading */}
      <div className="flex justify-between mt-10">
        <h2 className="md:text-left text-left md:text-[26px] text-[30px] xl:text-[40px] font-semibold w-full">Paid User Listing</h2>
      </div>

      {/* Table */}
      <div className="mt-4 relative">
        <div className="mt-4 relative overflow-x-auto rounded-[30px] border-[#ffffff3e] border">
          {loading ? (
            <div className="text-center p-4">Loading...</div>
          ) : (
            <table className='md:w-full w-[150%]'>
              <thead className='text-center bg-[#29303F] sticky top-0'>
                <tr className='uppercase'>
                  <th className='text-center text-[15px]'>Date</th>
                  <th className='text-center text-[15px]'>Mobile Number</th>
                  <th className='text-center text-[15px]'>Subscription</th>
                  <th className='text-center text-[15px]'>Experts</th>
                  <th className='text-center text-[15px]'>Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.map((customer, index) => (
                  <tr key={index}>
                    <td className='text-center'>{formatDate(customer.subscribeDate)}</td>
                    <td className='text-center'>{customer.userMobileNo || 'N/A'}</td>
                    <td className='text-center'>{getSubscriptionName(customer.subscription)}</td>
                    <td className='text-center'>{customer.raName || 'N/A'}</td>
                    <td className='text-center'>₹{customer.amount !== null ? customer.amount : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end mt-4">
          <div className="flex justify-end items-center gap-2 mt-4">
            <span className='mr-2 text-sm text-gray-500'>{`Page ${currentPage} of ${totalPages}`}</span>
            <button onClick={goToPreviousPage} className="page-link border border-[#ffffff4a] p-2 rounded-[50%]" disabled={currentPage === 1}>
              <img src={leftArrow} alt="Previous" className="w-5 h-6" />
            </button>
            <button onClick={goToNextPage} className="page-link border border-[#ffffff4a] p-2 rounded-[50%]" disabled={currentPage === totalPages}>
              <img src={rightArrow} alt="Next" className="w-5 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardTable;
