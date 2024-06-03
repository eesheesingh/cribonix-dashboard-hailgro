import React, { useState } from 'react';
import { filterBlack, filterBtn, leftArrow, rightArrow } from '../../assets';
import { Link } from 'react-router-dom';
import { customers_data } from '../../constants/data';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Customers = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const itemsPerPage = 15;
  const totalData = 5;
  const totalPages = Math.ceil(totalData / itemsPerPage);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const toggleFilterModal = () => {
    setShowFilterModal(!showFilterModal);
  };

  return (
    <div className="xl:p-4 md:p-4 sm:ml-[8rem] text-white">
      <div className="p-4 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
        <div className="text-white text-center">
        <div className="flex items-center justify-between mt-10">
        <h2 className="text-left md:text-[22px] text-[30px] xl:text-[40px] font-semibold w-full">Customer Listing</h2>
        <div className="flex items-center">
            <button
              className="bg-transparent border-[1px] flex justify-center items-center text-white px-5 py-3 rounded-lg transition duration-300 hover:bg-[#fff] hover:text-[#000]"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={toggleFilterModal}
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
      </div>

        {showFilterModal && (
            <div className="absolute top-0 right-0 bg-white p-4 shadow-md rounded-lg">
            <div className="flex items-center">
              <div className="relative">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholderText="Select date start"
                />
              </div>
              <span className="mx-4 text-gray-500">to</span>
              <div className="relative">
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholderText="Select date end"
                />
              </div>
            </div>
          </div>
        )}

<div className="overflow-x-auto mt-4 scroll-container shadow-md sm:rounded-[30px] rounded-lg border border-[#ffffff3f]">
            <table className="md:w-full w-[200%]">
              <thead className="text-center bg-[#29303F] sticky top-0">
                <tr>
                  <th className="text-center text-[15px]">NAME</th>
                  <th className="text-center text-[15px]">MOBILE NUMBER</th>
                  <th className="text-center text-[15px]">SERVICE</th>
                  <th className="text-center text-[15px]">COURSE</th>
                  <th className="text-center text-[15px]">WEBINAR</th>
                  <th className="text-center text-[15px]">PRIVATE CALL</th>
                  <th className="text-center text-[15px]">EARN AMOUNT</th>
                </tr>
                </thead>
                <tbody>
  {customers_data
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    .map((customer, index) => (
      <tr key={index}>
        <td className="text-center">{customer.name}</td>
        <td className="text-center">
          {/* Replace the first 6 digits of the mobile number with "*" */}
          {customer.mobileNumber.replace(/^\d{6}/, '******')}
        </td>
        <td className="text-center">{customer.service}</td>
        <td className="text-center">{customer.course}</td>
        <td className="text-center">{customer.webinar}</td>
        <td className="text-center">{customer.privateCall}</td>
        <td className="text-center">
          <Link to="/customers/singleCustomer">
            <button className="border-transparent bg-transparent">
              {customer.earnAmount}
              <img src={leftArrow} alt="" className="inline-block md:w-[7px] ml-10" />
            </button>
          </Link>
        </td>
      </tr>
    ))}
</tbody>

            </table>
          </div>

          <div className="flex justify-between p-4 items-center">
            <div className="text-white">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex">
              <button
                className="bg-transparent text-white px-1 py-3 hover:bg-[#fff4] rounded-[50px] transition duration-300 mr-2"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                <img src={rightArrow} alt="Prev" className="w-[12px]" />
              </button>
              <button
                className="bg-transparent text-white px-1 py-3 hover:bg-[#fff4] rounded-[50px] transition duration-300"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <img src={leftArrow} alt="Next" className="w-[12px]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;
