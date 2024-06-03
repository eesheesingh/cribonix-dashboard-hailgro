import React, { useState } from 'react';
import axios from 'axios';
import { close } from '../../assets';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AddBankPopup = ({ onClose, addBankDetails }) => {
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    bankName: '',
    accountHolderName: '',
  });

  const [acknowledged, setAcknowledged] = useState(false); // State to track acknowledgment
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setBankDetails({ ...bankDetails, [id]: value });
  };

  const handleAcknowledgmentChange = () => {
    setAcknowledged(!acknowledged); // Toggle acknowledgment state
  };

  const handleSubmit = async () => {
    // Check if acknowledgment is given
    if (!acknowledged) {
      setError('Please acknowledge that the bank/payment details provided are accurate.');
      return;
    }
    // Check if any field is empty
    const { accountNumber, confirmAccountNumber, ifscCode, bankName, accountHolderName } = bankDetails;
    if (!accountNumber || !confirmAccountNumber || !ifscCode || !bankName || !accountHolderName) {
      setError('All fields are required to be filled.');
      return;
    }

    // Check if account numbers match
    if (accountNumber !== confirmAccountNumber) {
      setError('Account numbers do not match.');
      return;
    }

    try {
      const affiliatePartnerData = localStorage.getItem('stackIdData');
      if (!affiliatePartnerData) {
        setError('Affiliate Partner data not found in localStorage');
        return;
      }

      const parsedData = JSON.parse(affiliatePartnerData);
      const affiliatePartnerId = parsedData.id;

      // Prepare data for API request
      const data = {
        paymentMode: 'bank',
        affiliatePartnerId,
        accountHolderName,
        accountNumber,
        ifscCode,
        bankName,
        upI_ID: '', // Assuming upI_ID is not used in this case
      };

      const response = await axios.post('https://copartners.in:5135/api/Withdrawal/PostBankUPIDetails', data);

      if (response.data.isSuccess) {
        addBankDetails({ ...bankDetails });
        onClose();
        toast.success('Bank Added Successfully', {
          position: "top-right"
        });
      } else {
        setError(response.data.displayMessage || 'Failed to add bank details.');
      }
    } catch (err) {
      setError('An error occurred while adding bank details. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#2E374B] md:p-8 p-3 rounded-[20px] shadow-lg relative md:w-[720px] w-[350px]">
        <div className="absolute top-2 right-2">
          <button onClick={onClose}>
            <img src={close} alt="Close" className="w-10 h-10" />
          </button>
        </div>
        <h2 className="md:text-[40px] text-[30px] subheading-color font-semibold mb-4">Add Bank Details</h2>
        <div className='grid grid-cols-2 md:gap-4 gap-2'>
          <div className="relative">
            <input type="number" inputMode='numeric' id="accountNumber" required className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-[15px] border-1 border-[1px] appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#ffffff46] focus:outline-none focus:ring-0 focus:border-[#ffffff41] peer" placeholder=" " onChange={handleChange} />
            <label htmlFor="accountNumber" className="absolute md:text-sm text-[12px] text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-transparent dark:bg-[#2E374B] px-2 peer-focus:bg-[#282F3E] peer-focus:px-2 peer-focus:text-[#fff] peer-focus:dark:text-[#fff]  peer-focus:rounded-md peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Account Number</label>
          </div>
          <div className="relative">
            <input type="number" inputMode='numeric' id="confirmAccountNumber" required className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-[15px] border-1 border-[1px] appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#ffffff46] focus:outline-none focus:ring-0 focus:border-[#ffffff41] peer" placeholder=" " onChange={handleChange}/>
            <label htmlFor="confirmAccountNumber" className="absolute md:text-sm text-[10px] text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-transparent dark:bg-[#2E374B] px-2 peer-focus:bg-[#282F3E] peer-focus:px-2 peer-focus:text-[#fff] peer-focus:dark:text-[#fff]  peer-focus:rounded-md peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Confirm Account Number</label>
          </div>
          <div className="relative">
            <input type="text" id="ifscCode" required className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-[15px] border-1 border-[1px] appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#ffffff46] focus:outline-none focus:ring-0 focus:border-[#ffffff41] peer" placeholder=" " onChange={handleChange}/>
            <label htmlFor="ifscCode" className="absolute md:text-sm text-[12px] text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-transparent dark:bg-[#2E374B] px-2 peer-focus:bg-[#282F3E] peer-focus:px-2 peer-focus:text-[#fff] peer-focus:dark:text-[#fff]  peer-focus:rounded-md peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">IFSC Code</label>
          </div>
          <div className="relative">
            <input type="text" id="bankName" required className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-[15px] border-1 border-[1px] appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#ffffff46] focus:outline-none focus:ring-0 focus:border-[#ffffff41] peer" placeholder=" " onChange={handleChange} />
            <label htmlFor="bankName" className="absolute md:text-sm text-[12px] text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-transparent dark:bg-[#2E374B] px-2 peer-focus:bg-[#282F3E] peer-focus:px-2 peer-focus:text-[#fff] peer-focus:dark:text-[#fff]  peer-focus:rounded-md peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Bank Name</label>
          </div>
          <div className="relative">
            <input type="text" id="accountHolderName" required className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-[15px] border-1 border-[1px] appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#ffffff46] focus:outline-none focus:ring-0 focus:border-[#ffffff41] peer" placeholder=" " onChange={handleChange}/>
            <label htmlFor="accountHolderName" className="absolute md:text-sm text-[12px] text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-transparent dark:bg-[#2E374B] px-2 peer-focus:bg-[#282F3E] peer-focus:px-2 peer-focus:text-[#fff] peer-focus:dark:text-[#fff]  peer-focus:rounded-md peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Account Holder Name</label>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {/* Acknowledgment checklist */}
        <div className="flex items-start mt-4">
          <input
            type="checkbox"
            id="acknowledgment"
            checked={acknowledged}
            onChange={handleAcknowledgmentChange}
            className="mr-2 mt-2"
          />
          <label htmlFor="acknowledgment" className="text-gray-400 md:text-md text-sm text-left">
            I acknowledge that the bank/payment details provided are accurate and authorize Hailgro Tech Solutions Pvt. Ltd. to process transactions accordingly.
          </label>
        </div>
        <div className="flex justify-center mt-1">
         {/* Submit button */}
        <div className="flex justify-center mt-8">
          <button onClick={handleSubmit} className="px-10 py-2 bg-[#fff] hover:bg-[#000] text-[#000] hover:text-[#FFF] transition duration-300 rounded-md hover:[#000] focus:outline-none focus:bg-[#000]">
            Add
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AddBankPopup;
