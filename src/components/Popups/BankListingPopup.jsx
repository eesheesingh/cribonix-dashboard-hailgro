import React, { useEffect, useState } from 'react';
import { close, tick } from '../../assets';
import AddBankPopup from './AddBankPopup';
import AddUpiPopup from './AddUpiPopup';
import VerifyKycPopup from './VerifyKycPopup';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BankListingPopup = ({ onClose }) => {
  const [verifyPopupOpen, setVerifyPopupOpen] = useState(false);
  const [isAddBankPopupOpen, setIsAddBankPopupOpen] = useState(false);
  const [isAddUpiPopupOpen, setIsAddUpiPopupOpen] = useState(false);
  const [bankDetails, setBankDetails] = useState([]);
  const [upiDetails, setUpiDetails] = useState([]);
  const [withdrawalBalance, setWithdrawalBalance] = useState(null);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [amount, setAmount] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [isKycVerified, setIsKycVerified] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedStackIdData = localStorage.getItem("stackIdData");
        if (storedStackIdData) {
          const data = JSON.parse(storedStackIdData);
          const affiliateId = data.id;

          const response = await fetch(`https://copartners.in:5133/api/AffiliatePartner/${affiliateId}`);
          if (response.ok) {
            const result = await response.json();
            setIsKycVerified(result.data.isKyc);
          } else {
            console.error('Failed to fetch KYC status.');
          }
        }
      } catch (error) {
        console.error('Error fetching KYC status:', error);
      }
    };

    fetchData();
    fetchWalletBalance();
    fetchBankAndUpiData();
  }, []);

  const fetchWalletBalance = async () => {
    try {
      const storedStackIdData = localStorage.getItem("stackIdData");
      if (storedStackIdData) {
        const data = JSON.parse(storedStackIdData);
        const affiliateId = data.id;

        const response = await fetch(`https://copartners.in:5135/api/Wallet/GetWalletWithdrawalBalance/${affiliateId}?userType=AP`);
        const result = await response.json();
        if (result.isSuccess) {
          setWithdrawalBalance(result.data.withdrawalBalance);
        } else {
          console.error('Error fetching wallet balance:', result.displayMessage);
        }
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    }
  };

  const fetchBankAndUpiData = async () => {
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
                bankName: item.bankName,
                accountNumber: item.accountNumber,
                id: item.id,
              });
            } else if (item.paymentMode.toLowerCase() === "upi") {
              upiDetailsArray.push({
                UpiID: item.upI_ID,
                id: item.id,
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

  const handleVerify = async () => {
    setError('');

    const amountValue = parseFloat(amount);

    if (!amount || isNaN(amountValue) || amountValue <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    if (amountValue < 100) {
      setError('The minimum withdrawal amount is 100.');
      return;
    }

    if (amountValue > 100000) {
      setError('The maximum withdrawal amount is 100,000.');
      return;
    }

    if (!selectedItem) {
      setError('Please select a bank or UPI.');
      return;
    }

    if (amountValue > withdrawalBalance) {
      setError('Insufficient balance.');
      return;
    }

    if (!isKycVerified) {
      setVerifyPopupOpen(true);
      return;
    }

    try {
      const response = await axios.post('https://copartners.in:5135/api/Withdrawal', {
        withdrawalBy: "AP",
        amount: amountValue,
        withdrawalModeId: selectedItem.id,
        withdrawalRequestDate: new Date().toISOString(), // Add the current date as withdrawalRequestDate
      });

      if (response.data.isSuccess) {
        toast.success('Withdrawal request created successfully.');
        setNotifications([...notifications, 'Withdrawal request created successfully.']);
        onClose(); // Close the popup
        window.location.reload(); // Refresh the page
      } else {
        setError(`Failed to create withdrawal request: ${response.data.displayMessage}`);
      }
    } catch (error) {
      setError(`Error creating withdrawal request: ${error.message}`);
    }
  };

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

  const deleteBankDetail = (index) => {
    const updatedBankDetails = [...bankDetails];
    updatedBankDetails.splice(index, 1);
    setBankDetails(updatedBankDetails);
  };

  const deleteUpiDetail = (index) => {
    const updatedUpiDetails = [...upiDetails];
    updatedUpiDetails.splice(index, 1);
    setUpiDetails(updatedUpiDetails);
  };

  const handleSelectItem = (type, index) => {
    if (type === 'bank') {
      setSelectedItem({ type, index, id: bankDetails[index].id });
    } else if (type === 'upi') {
      setSelectedItem({ type, index, id: upiDetails[index].id });
    }
  };

  const handleVideoUpload = (uploaded) => {
    setIsKycVerified(uploaded);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#2E374B] p-4 rounded-[20px] shadow-lg relative md:w-[1000px] xl:w-[1084px] w-[350px] xl:max-w-[800px]">
        <div className="absolute top-1 right-2">
          <button onClick={onClose}>
            <img src={close} alt="Close" className="w-10 h-10" />
          </button>
        </div>
        <h2 className="text-[40px] subheading-color font-semibold mb-4 text-left">Withdrawal</h2>

        <div className="">
          <div className="flex flex-row justify-between items-center">
            <span className="text-left md:text-[22px] xl:text-[40px] font-semibold">Select Bank</span>
            <button
              className="flex hover:bg-[#fff] items-center text-white hover:text-[#000] px-5 py-2 border-[1px] rounded-lg transition duration-300"
              onClick={toggleAddBankPopup}
            >
              + Add Bank
            </button>
          </div>
          <div className="flex flex-row gap-3 md:justify-start justify-start flex-wrap mt-2">
            {bankDetails.map((detail, index) => (
              <div
                key={index}
                onClick={() => handleSelectItem('bank', index)}
                className={`sampleBank md:p-1 md:pr-0 pr-4 p-3 md:px-0 px-4 md:w-[310px] flex items-center md:justify-start flex-row bg-[#0000003d] border-[#ffffff1d] border-[1px] rounded-xl cursor-pointer relative ${
                  selectedItem?.type === 'bank' && selectedItem.index === index ? 'border-[#48fe8e] border-[2px]' : ''
                }`}
              >
                {selectedItem?.type === 'bank' && selectedItem.index === index && (
                  <img src={tick} alt="Selected" className="absolute bg-black rounded-[20px] top-[-8px] right-0 w-4 h-4" />
                )}
                <div className="flex flex-col md:p-2 pr-2 text-left">
                  <span className="md:text-lg text-[12px]">{detail.bankName}</span>
                  <span className="text-[#c9c9c9] md:text-[15px] text-[10px]">{detail.accountNumber}</span>
                </div>
                <button
                  className="ml-auto hover:bg-[#ffffff21] transition duration-300 rounded-[50px] hover:scale-125 text-white px-1 py-1 mr-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteBankDetail(index);
                  }}
                >
                </button>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4 border-t-[1px] border-[#ffffff2a] pt-5">
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
          <div className="flex flex-row md:justify-start justify-start gap-3 flex-wrap mt-2">
            {upiDetails.map((detail, index) => (
              <div
                key={index}
                onClick={() => handleSelectItem('upi', index)}
                className={`sampleBank md:p-1 md:pr-0 pr-4 p-3 md:px-0 px-4 md:w-[310px] flex items-center md:justify-start flex-row bg-[#0000003d] border-[#ffffff1d] border-[1px] rounded-xl cursor-pointer relative ${
                  selectedItem?.type === 'upi' && selectedItem.index === index ? 'border-[#48fe8e] border-[2px]' : ''
                }`}
              >
                {selectedItem?.type === 'upi' && selectedItem.index === index && (
                  <img src={tick} alt="Selected" className="absolute bg-black rounded-[20px] top-[-8px] right-0 w-4 h-4" />
                )}
                <div className="flex flex-col md:p-2 pr-2 text-left">
                  <span className="md:text-lg text-[12px]">{detail.UpiID}</span>
                </div>
                <button
                  className="ml-auto hover:bg-[#ffffff21] transition duration-300 rounded-[50px] hover:scale-125 text-white px-1 py-1 mr-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteUpiDetail(index);
                  }}
                >
                </button>
              </div>
            ))}
          </div>
          <div className="flex flex-row justify-center items-center mb-6 gap-3 mt-6">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="amount">
              Withdrawal Amount
            </label>
            <input
              type="text"
              name="amount"
              id="amount"
              placeholder={`${withdrawalBalance !== null ? `₹${withdrawalBalance.toFixed(2)}` : 'Loading...'}`}
              className="text-[#fff] border bg-transparent rounded-md md:px-3 px-3 md:py-2 py-1 text-center"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={withdrawalBalance === 0}
            />
          </div>
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        </div>

        <div className="mt-4 flex justify-center">
          <button
            className="bg-[#fff] text-[#000] hover:bg-[#000] hover:text-[#fff] transition duration-300 font-bold py-2 px-7 rounded focus:outline-none focus:shadow-outline"
            onClick={handleVerify}
            disabled={withdrawalBalance === 0}
          >
            Withdrawal
          </button>
        </div>

        {isAddBankPopupOpen && <AddBankPopup onClose={toggleAddBankPopup} addBankDetails={addBankDetails} />}
        {isAddUpiPopupOpen && <AddUpiPopup onClose={toggleAddUpiPopup} addUpiDetails={addUpiDetails} />}
        {verifyPopupOpen && <VerifyKycPopup onClose={() => setVerifyPopupOpen(false)} onVideoUpload={handleVideoUpload} />}
      </div>
      <ToastContainer />
    </div>
  );
};

export default BankListingPopup;
