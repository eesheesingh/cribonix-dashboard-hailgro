import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { transaction_data } from '../../constants/data';
import { invoiceBtn } from '../../assets';

const TransactionTable = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Change this value as needed
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = transaction_data.slice(indexOfFirstItem, indexOfLastItem);

  const handleFilterChange = ({ startDate, endDate }) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const filteredData = currentItems.filter((item) => {
    const itemDate = new Date(item.date.split('/').reverse().join('-'));
    if (startDate && endDate) {
      return itemDate >= startDate && itemDate <= endDate;
    } else if (startDate) {
      return itemDate >= startDate;
    } else if (endDate) {
      return itemDate <= endDate;
    }
    return true; // If neither start nor end date is specified, show all data
  });

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <DatePicker
        selected={startDate}
        onChange={(date) => handleFilterChange({ startDate: date, endDate })}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        placeholderText="Start Date"
      />
      <DatePicker
        selected={endDate}
        onChange={(date) => handleFilterChange({ startDate, endDate: date })}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        placeholderText="End Date"
      />
      <table>
        <thead>
          <tr>
            <th className="text-center text-[15px]">TRANSACTION ID</th>
            <th className="text-center text-[15px]">Date</th>
            <th className="text-center text-[15px]">Bank</th>
            <th className="text-center text-[15px]">Account Number</th>
            <th className="text-center text-[15px]">Amount</th>
            <th className="text-center text-[15px]">Invoice</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((transaction, index) => (
            <tr key={index}>
              <td className="text-center">{transaction.transactionId}</td>
              <td className="text-center">{transaction.date}</td>
              <td className="text-center">{transaction.bank}</td>
              <td className="text-center">{transaction.accountNumber}</td>
              <td className="text-center">{transaction.amount}</td>
              <td className="text-center flex justify-center">
                <img src={invoiceBtn} alt="" className="w-5" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <button onClick={() => paginate(currentPage + 1)} disabled={currentItems.length < itemsPerPage}>
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionTable;
