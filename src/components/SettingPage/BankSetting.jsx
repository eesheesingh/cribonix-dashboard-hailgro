import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { deleteIcon } from '../../assets'; // Ensure necessary imports
import AddBankPopup from '../Popups/AddBankPopup';
import AddUpiPopup from '../Popups/AddUpiPopup';

const BankSetting = () => {
  const [isAddBankPopupOpen, setIsAddBankPopupOpen] = useState(false);
  const [isAddUpiPopupOpen, setIsAddUpiPopupOpen] = useState(false);
  const [bankDetails, setBankDetails] = useState([]);
  const [upiDetails, setUpiDetails] = useState([]);
  const [error, setError] = useState('');

  const toggleAddBankPopup = () => {
    setIsAddBankPopupOpen(!isAddBankPopupOpen);
  };

  const toggleAddUpiPopup = () => {
    setIsAddUpiPopupOpen(!isAddUpiPopupOpen);
  };

  const addBankDetails = (details) => {
    setBankDetails([...bankDetails, details]);
  };

  const addUpiDetails = (details) => {
    setUpiDetails([...upiDetails, details]);
  };

  const deleteBankDetail = async (id, index) => {
    try {
      const response = await axios.delete(`https://copartners.in:5135/api/Withdrawal/${id}`);
      console.log('Delete response:', response);
      if (response.data.isSuccess) {
        const updatedBankDetails = [...bankDetails];
        updatedBankDetails.splice(index, 1);
        setBankDetails(updatedBankDetails);
      } else {
        setError(`Failed to delete bank detail: ${response.data.displayMessage}`);
      }
    } catch (error) {
      setError(`Error deleting bank detail: ${error.message}`);
    }
  };
  
  const deleteUpiDetail = async (id, index) => {
    try {
      const response = await axios.delete(`https://copartners.in:5135/api/Withdrawal/${id}`);
      if (response.data.isSuccess) {
        const updatedUpiDetails = [...upiDetails];
        updatedUpiDetails.splice(index, 1);
        setUpiDetails(updatedUpiDetails);
      } else {
        setError(`Failed to delete UPI detail: ${response.data.displayMessage}`);
      }
    } catch (error) {
      setError(`Error deleting UPI detail: ${error.message}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const affiliatePartnerData = localStorage.getItem('stackIdData');
      if (!affiliatePartnerData) {
        setError('Affiliate Partner data not found in localStorage');
        return;
      }

      try {
        const parsedData = JSON.parse(affiliatePartnerData);
        const affiliatePartnerId = parsedData.id;
        if (!affiliatePartnerId) {
          setError('Affiliate Partner ID not found in parsed data');
          return;
        }

        const response = await axios.get(`https://copartners.in:5135/api/Withdrawal/BankUPIByUserId/${affiliatePartnerId}?userType=AP&page=1&pageSize=10`);

        if (response.data.isSuccess) {
          const data = response.data.data;
          const bankDetailsArray = [];
          const upiDetailsArray = [];

          data.forEach(item => {
            if (item.affiliatePartnerId === affiliatePartnerId) {
              if (item.paymentMode.toLowerCase() === "bank") {
                bankDetailsArray.push({
                  id: item.id,
                  bankName: item.bankName,
                  accountNumber: item.accountNumber,
                });
              } else if (item.paymentMode.toLowerCase() === "upi") {
                upiDetailsArray.push({
                  id: item.id,
                  UpiID: item.upI_ID,
                });
              }
            }
          });

          setBankDetails(bankDetailsArray);
          setUpiDetails(upiDetailsArray);
        } else {
          setError(`Failed to fetch data: ${response.data.displayMessage}`);
        }
      } catch (error) {
        setError(`Error fetching data: ${error.message}`);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='p-4 border-[1px] border-[#fff3] rounded-xl'>
      {/* Bank Details */}
      <div className='flex justify-between items-center'>
        <h2 className="text-left md:text-[22px] xl:text-[40px] font-semibold">Bank Details</h2>
        <div className="flex items-center">
          <button
            className="flex hover:bg-[#fff] items-center text-white hover:text-[#000] px-5 py-2 border-[1px] rounded-lg transition duration-300"
            onClick={toggleAddBankPopup}
          >
            + Add Bank
          </button>
        </div>
      </div>

      <div className='flex flex-row gap-3 flex-wrap'>
        {bankDetails.map((detail, index) => (
          <div key={index} className='bankDetailsDiv flex flex-row items-center gap-4 flex-wrap mt-5'>
            <div className='sampleBank p-1 w-[310px] flex items-center justify-start flex-row bg-[#0000003d] border-[#ffffff1d] border-[1px] rounded-xl'>
              <div className='flex flex-col p-2'>
                <span className='text-lg'>{detail.bankName}</span>
                <span className='text-[#c9c9c9]'>{detail.accountNumber}</span>
              </div>
              <button
                className="ml-auto hover:bg-[#ffffff21] transition duration-300 rounded-[50px] hover:scale-125 text-white px-1 py-1 mr-2"
                onClick={() => deleteBankDetail(detail.id, index)}
              >
                <img src={deleteIcon} alt="Delete" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* UPI Details */}
      <div className='flex justify-between items-center mt-4 border-t-[1px] border-[#ffffff2a] pt-5'>
        <h2 className="text-left md:text-[22px] xl:text-[40px] font-semibold">UPI Details</h2>
        <div className="flex items-center">
          <button
            className="flex hover:bg-[#fff] items-center text-white hover:text-[#000] px-5 py-2 border-[1px] rounded-lg transition duration-300"
            onClick={toggleAddUpiPopup}
          >
            + Add UPI
          </button>
        </div>
      </div>

      <div className='flex flex-row gap-3 flex-wrap'>
        {upiDetails.map((detail, index) => (
          <div key={index} className='flex flex-row items-center gap-4 flex-wrap mt-5'>
            <div className='p-1 w-[310px] flex items-center justify-start flex-row bg-[#0000003d] border-[#ffffff1d] border-[1px] rounded-xl gap-3'>
              <span className='text-[#c9c9c9]'>{detail.UpiID}</span>
              <button
                className="ml-auto hover:bg-[#ffffff21] transition duration-300 rounded-[50px] hover:scale-125 text-white px-1 py-1 mr-2"
                onClick={() => deleteUpiDetail(detail.id, index)}
              >
                <img src={deleteIcon} alt="Delete" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isAddBankPopupOpen && <AddBankPopup onClose={toggleAddBankPopup} addBankDetails={addBankDetails} />}
      {isAddUpiPopupOpen && <AddUpiPopup onClose={toggleAddUpiPopup} addUpiDetails={addUpiDetails} />}

      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
};

export default BankSetting;
