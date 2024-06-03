import React, { useState } from 'react';
import { filterBlack, filterBtn, invoiceBtn, leftArrow, rightArrow } from '../../assets';
import { transaction_data, wallet_data } from '../../constants/data';
import RejectPopup from '../Popups/RejectPopup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TransactionTable from './TransactionTable';
import WithdrawalsTable from './WithdrawalsTable';


export const WalletTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('transactions');
  const [isHovered, setIsHovered] = useState(false);
  const [startDate, setStartDate] = useState(null);
const [endDate, setEndDate] = useState(null);

const [showFilterModal, setShowFilterModal] = useState(false);

  const [rejectPopupOpen, setRejectPopupOpen] = useState(false);

  const handleVerify = () => {
    // Implement PAN card verification logic here
    // Open the KYC verification popup
    setRejectPopupOpen(true);
  }

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const toggleFilterModal = () => {
    setShowFilterModal(!showFilterModal);
  };

  const itemsPerPage = 10; // Number of items to display per page
  const totalTransactions = activeTab === 'transactions' ? transaction_data.length : wallet_data.length; // Total number of transactions
  const totalPages = Math.ceil(totalTransactions / itemsPerPage);

  // Slice data for current page
  const paginatedData = activeTab === 'transactions'
    ? transaction_data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : wallet_data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Pagination handlers
  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset page number when switching tabs
  };

  return (
    <div className="relative">
      {/* Tab Section */}
      <div className="flex md:justify-start justify-start space-x-4 mt-">
        <button
          className={`px-4 py-2 rounded-lg focus:outline-none ${
            activeTab === 'transactions' ? 'bg-white text-black' : 'bg-[transparent] border-solid border-[1px] text-white'
          }`}
          onClick={() => handleTabChange('transactions')}
        >
          Transactions
        </button>
        <button
          className={` px-4 py-2 rounded-lg focus:outline-none ${
            activeTab === 'withdrawals' ? 'bg-white text-black' : 'bg-[transparent] border-solid border-[1px] text-white'
          }`}
          onClick={() => handleTabChange('withdrawals')}
        >
          Withdrawal Request
        </button>
      </div>

      {/* Transaction Data */}
      {activeTab === 'transactions' && (
        <>
           {/* <div className="mt-4 relative overflow-x-auto rounded-[30px] border-[#ffffff3e] border">
            <table className="md:w-full w-[250%] table-fixed">
                <thead className="text-center bg-[#29303F] sticky top-0">
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
                {paginatedData.map((transaction) => (
                  <tr key={transaction.id}>
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
          </div>

          
          {totalTransactions > itemsPerPage && (
            <div className="flex justify-end p-4 items-center">
              <div className="text-white mr-3">
                Page {currentPage} of {totalPages}
              </div>
              <button
                className="bg-transparent text-white px-1 py-3 hover:bg-[#fff4] rounded-[50px] transition duration-300 mb-1 p-2 transform hover:scale-110"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                <img src={rightArrow} alt="Prev" className="inline-block w-[12px]" />
              </button>
              <button
                className="bg-transparent text-white px-1 py-3 hover:bg-[#fff4] rounded-[50px] transition duration-300 mb-1 p-2 transform hover:scale-110"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <img src={leftArrow} alt="Next" className="inline-block w-[12px]" />
              </button>
            </div>
          )} */}
          <TransactionTable />
        </>
      )}

      {/* Withdrawal Data */}
      {activeTab === 'withdrawals' && (
        <div className="mt-4">
          {/* <div className="mt-4 relative overflow-x-auto rounded-[30px] border-[#ffffff3e] border">
            <table className="md:w-full w-[250%] table-fixed">
                <thead className="text-center bg-[#29303F] sticky top-0">
                <tr>
                  <th className="text-center text-[15px]">WALLET ID</th>
                  <th className="text-center text-[15px]">Date</th>
                  <th className="text-center text-[15px]">Bank</th>
                  <th className="text-center text-[15px]">Account Number</th>
                  <th className="text-center text-[15px]">Amount</th>
                  <th className="text-center text-[15px]">Status</th> 
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="text-center">{transaction.transactionId}</td>
                    <td className="text-center">{transaction.date}</td>
                    <td className="text-center">{transaction.bank}</td>
                    <td className="text-center">{transaction.accountNumber}</td>
                    <td className="text-center">{transaction.amount}</td>
                    <td className="text-center text-[#f5b53f] font-semibold">
                      {transaction.status === '' ? (
                        <button
                          className="text-[#fff] bg-red-500 px-3 py-1 rounded-lg focus:outline-none"
                          onClick={handleVerify}
                        >
                          Reject
                        </button>
                      ) : (
                        transaction.status 
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div> */}

          {/* Pagination */}
          {/* {totalTransactions > itemsPerPage && (
            <div className="flex justify-end p-4 items-center">
              <div className="text-white mr-3">
                Page {currentPage} of {totalPages}
              </div>
              <button
                className="bg-transparent text-white px-1 py-3 hover:bg-[#fff4] rounded-[50px] transition duration-300 mb-1 p-2 transform hover:scale-110"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                <img src={rightArrow} alt="Prev" className="inline-block w-[12px]" />
              </button>
              <button
                className="bg-transparent text-white px-1 py-3 hover:bg-[#fff4] rounded-[50px] transition duration-300 mb-1 p-2 transform hover:scale-110"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <img src={leftArrow} alt="Next" className="inline-block w-[12px]" />
              </button>
            </div>
          )} */}

          <WithdrawalsTable />
        </div>
      )}

      {/* Reject Popup */}
      {rejectPopupOpen && (
        <RejectPopup onClose={() => setRejectPopupOpen(false)} />
      )}
    </div>
  );
};

export default WalletTable;
