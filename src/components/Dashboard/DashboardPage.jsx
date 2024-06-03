import React, { useEffect, useRef, useState } from "react";
import {
  usersPurple,
  tick,
  clipboard,
} from "../../assets";
import DashboardTable from "./DashboardTable";
import BankListingPopup from "../Popups/BankListingPopup";
import DashboardChart from "./DashboardChart";
import LeaderBoardAnalysisChart from "./LeaderBoardAnalysisChart";
import LeaderBoardChartMob from "./LeaderBoardChartMob.jsx";
import DashboardChartMob from "./DashboardChartMonb.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DashboardPage = () => {
  const [activeButtonFirstSection, setActiveButtonFirstSection] = useState("weekly");
  const [activeButtonSecondSection, setActiveButtonSecondSection] = useState("today");
  const [copiedReferralLink, setCopiedReferralLink] = useState(false);
  const [copiedReferralCode, setCopiedReferralCode] = useState(false);
  const [isBankListingPopupOpen, setIsBankListingPopupOpen] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [affiliateData, setAffiliateData] = useState(null);
  const [totalVisits, setTotalVisits] = useState(0);
  const [paidUsers, setPaidUsers] = useState(0);
  const [notInterested, setNotInterested] = useState(0);
  const [walletBalance, setWalletBalance] = useState(null);
  const [referralLink, setReferralLink] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchWalletBalance = async (affiliateId) => {
    try {
      const response = await fetch(`https://copartners.in:5135/api/Wallet/GetWalletWithdrawalBalance/${affiliateId}?userType=AP`);
      const result = await response.json();
      if (result.isSuccess) {
        setWalletBalance(result.data.walletBalance);
      } else {
        console.error('Error fetching wallet balance:', result.displayMessage);
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    }
  };

  const generateReferralLink = async (affiliateId) => {
    setLoading(true);
    try {
      const response = await fetch(`https://copartners.in:5133/api/AffiliatePartner/GenerateReferralLink/${affiliateId}`);
      const result = await response.json();
      if (result.isSuccess) {
        setReferralLink(result.data);
      } else {
        console.error('Failed to generate referral link');
      }
    } catch (error) {
      console.error('Error fetching referral link:', error);
    }
    setLoading(false);
  };

  const toggleBankListingPopup = () => {
    setIsBankListingPopupOpen(!isBankListingPopupOpen);
  };

  const referralLinkRef = useRef(null);
  const referralCodeRef = useRef(null);

  useEffect(() => {
    const fetchAffiliateData = async () => {
      try {
        const storedStackIdData = localStorage.getItem("stackIdData");
        if (storedStackIdData) {
          const data = JSON.parse(storedStackIdData);
          setAffiliateData(data);
          setReferralCode(data.referralCode || '');
          fetchWalletBalance(data.id);
          generateReferralLink(data.id);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchAffiliateData();
  }, []);

  const copyReferralLinkToClipboard = () => {
    if (referralLinkRef.current) {
      navigator.clipboard.writeText(referralLinkRef.current.innerText).then(() => {
        setCopiedReferralLink(true);
        setTimeout(() => setCopiedReferralLink(false), 2000);
      });
    }
  };

  const copyReferralCodeToClipboard = () => {
    if (referralCodeRef.current) {
      const fullCode = referralCodeRef.current.innerText;
      navigator.clipboard.writeText(fullCode);
      setCopiedReferralCode(true);
      setTimeout(() => {
        setCopiedReferralCode(false);
      }, 3000);
    }
  };

  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);
  const [isCustomPickerVisible, setIsCustomPickerVisible] = useState(false);

  const handleCustomButtonClick = () => {
    setActiveButtonSecondSection("custom");
    setIsCustomPickerVisible(!isCustomPickerVisible);
  };

  const handleDateChange = (start, end) => {
    setCustomStartDate(start);
    setCustomEndDate(end);
    setIsCustomPickerVisible(false);
  };

  const handleClearDates = () => {
    setCustomStartDate(null);
    setCustomEndDate(null);
    setIsCustomPickerVisible(false); // Close the picker when dates are cleared
  };

  const [customEarnStartDate, setCustomEarnStartDate] = useState(null);
  const [customEarnEndDate, setCustomEarnEndDate] = useState(null);
  const [isCustomEarnPickerVisible, setIsCustomEarnPickerVisible] = useState(false);

  const handleCustomEarnButtonClick = () => {
    setActiveButtonFirstSection("custom");
    setIsCustomEarnPickerVisible(!isCustomEarnPickerVisible);
  };

  const handleEarnDateChange = (start, end) => {
    setCustomEarnStartDate(start);
    setCustomEarnEndDate(end);
    setIsCustomEarnPickerVisible(false);
  };

  const handleEarnClearDates = () => {
    setCustomEarnStartDate(null);
    setCustomEarnEndDate(null);
    setIsCustomEarnPickerVisible(false); // Close the picker when dates are cleared
  };

  const handleDataUpdate = (data) => {
    setTotalVisits(data.totalVisits);
    setPaidUsers(data.paidUsers);
    setNotInterested(data.notInterested);
  };

  return (
    <div className="xl:px-1 md:p-4 sm:ml-[10rem] text-white">
      <div className="p-1 border-gray-200 border-dashed rounded-lg dark:border-gray-700 md:mt-14 mt-[30px]">
        <div className="text-white text-center">
          <div className="flex md:hidden flex-col md:flex-row mt-[4rem] justify-between p-3 md:px-[40px] bg-[#29303F] rounded-[20px] items-start">
          <span className="text-lg text-left font-semibold mb-3">For Signing Up : -</span>
            <div className="flex flex-row md:flex-row items-center gap-3 w-full md:w-auto">
              <span className="md:text-lg text-sm">Referral Link</span>
              <div className="p-1 px-3 flex rounded-[30px] bg-transparent border-[1px]">
                {referralLink ? (
                  <>
                    <span ref={referralLinkRef} className="mr-1 md:block truncate-link">
                      {referralLink}
                    </span>
                    <button
                      onClick={copyReferralLinkToClipboard}
                      className="flex items-center mt-[2px]"
                    >
                      |
                      {copiedReferralLink ? (
                        <img src={tick} alt="Copied" className="w-5" />
                      ) : (
                        <img src={clipboard} alt="Copy" className="w-5" />
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={generateReferralLink}
                    className="flex items-center mt-[2px]"
                    disabled={loading}>
                    {loading ? 'Just a sec...' : 'View Link'}
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="flex md:flex-row flex-col justify-between md:mt-10 mt-[1rem] items-center">
            <h2 className="md:text-left text-left md:text-[27px] text-[30px] xl:text-[40px] font-semibold w-full">
              Earning Analysis
            </h2>
            <div className="space-x-4 md:mr-1 xl:mr-[10px] flex w-full md:justify-end justify-start">
              <button
                className={`button ${
                  activeButtonFirstSection === "weekly"
                    ? "bg-[#fff] text-[#000]"
                    : "bg-transparent"
                } md:text-[18px] text-[13px] border-[1px] hover:bg-[#fff] hover:text-[#000] transition duration-300 md:py-2 py-1 px-2 md:px-6 rounded mb-2 md:mb-0`}
                onClick={() => setActiveButtonFirstSection("weekly")}
              >
                Weekly
              </button>
              <button
                className={`button ${
                  activeButtonFirstSection === "monthly"
                    ? "bg-[#fff] text-[#000]"
                    : "bg-transparent"
                } md:text-[18px] text-[13px] border-[1px] hover:bg-[#fff] hover:text-[#000] transition duration-300 md:py-2 py-1 px-2 md:px-6 rounded mb-2 md:mb-0`}
                onClick={() => setActiveButtonFirstSection("monthly")}
              >
                Monthly
              </button>
              <button
                className={`button ${
                  activeButtonFirstSection === "custom"
                    ? "bg-[#fff] text-[#000]"
                    : "bg-transparent"
                } md:text-[18px] text-[13px] border-[1px] hover:bg-[#fff] hover:text-[#000] transition duration-300 md:py-2 py-1 px-2 md:px-6 rounded mb-2 md:mb-0`}
                onClick={handleCustomEarnButtonClick}
              >
                Custom
              </button>
              {isCustomEarnPickerVisible && (
                <div className="absolute top-[10.5rem] md:right-[3.5rem] mt-2 z-10 bg-[#2b2d42] p-4 rounded-lg shadow-lg flex flex-col gap-3">
                  <DatePicker
                    selected={customEarnStartDate}
                    onChange={(date) => setCustomEarnStartDate(date)}
                    selectsStart
                    startDate={customEarnStartDate}
                    endDate={customEarnEndDate}
                    placeholderText="Start Date"
                    className="bg-transparent text-white border-b border-white mt-2"
                    renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
                      <div className="flex justify-between items-center">
                        <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>{'<'}</button>
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
                        <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>{'>'}</button>
                      </div>
                    )}
                  />
                  <DatePicker
                    selected={customEarnEndDate}
                    onChange={(date) => handleEarnDateChange(customEarnStartDate, date)}
                    selectsEnd
                    startDate={customEarnStartDate}
                    endDate={customEarnEndDate}
                    minDate={customEarnStartDate}
                    placeholderText="End Date"
                    className="bg-transparent text-white border-b border-white"
                    renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
                      <div className="flex justify-between items-center">
                        <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>{'<'}</button>
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
                        <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>{'>'}</button>
                      </div>
                    )}
                  />
                  <button
                    onClick={handleEarnClearDates}
                    className="bg-[#fff] text-[#000] px-4 py-1 rounded-md focus:outline-none"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* First Section Content */}
          <div className="flex flex-col md:flex-row md:mt-8 md:gap-0 gap-3">
            <div className="w-full md:w-2/3 pr-0 md:pr-8 md:flex hidden">
              <DashboardChart activeButton={activeButtonFirstSection} customStartDate={customEarnStartDate} customEndDate={customEarnEndDate} />
            </div>

            <div className="w-full md:w-2/3 pr-0 mt-2 md:hidden">
              <DashboardChartMob activeButton={activeButtonFirstSection} customStartDate={customEarnStartDate} customEndDate={customEarnEndDate} />
            </div>
            <div className="w-full md:w-1/3 flex flex-col justify-center items-center container-bg rounded-[30px] p-3 md:max-h-full min-h-[100px]">
              <h3 className="text-center font-semibold md:text-[30px] text-[25px] xl:text-[50px]">
                Total Earning
              </h3>
              <h1 className="md:text-[60px] text-[60px] xl:text-[85px] text-gradient font-bold">
                {walletBalance !== null ? `₹${walletBalance.toFixed(2)}` : 'Loading...'}
              </h1>
              <div className="md:px-[40px] mb-4 xl:text-[20px] md:text-[14px]">
                <p className="text-center md:text-[1.3rem] text-[#c9c9c9]">
                  Total funds available in your wallet.
                </p>
              </div>
              <div className="flex justify-center">
                <button
                  className="bg-[#fff] transition duration-300 text-[#000] hover:bg-[#000] hover:text-[#fff] px-6 py-3 rounded"
                  onClick={() => toggleBankListingPopup(true)}
                >
                  Withdrawal
                </button>
              </div>
              {isBankListingPopupOpen && (
                <BankListingPopup onClose={() => toggleBankListingPopup(false)} />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="md:flex flex-col hidden md:flex-row justify-between p-3 md:px-[40px] mt-5 bg-[#29303F] rounded-[20px] items-center">
        <div className="flex flex-row md:flex-row items-center gap-3 w-full md:w-auto">
          <span className="md:text-lg text-sm">Referral Link</span>
          <div className="p-1 px-3 flex rounded-[30px] bg-transparent border-[1px]">
            {referralLink ? (
              <>
                <span ref={referralLinkRef} className="mr-1 md:block">
                  {referralLink}
                </span>
                <button
                  onClick={copyReferralLinkToClipboard}
                  className="flex items-center mt-[2px]"
                >
                  |
                  {copiedReferralLink ? (
                    <img src={tick} alt="Copied" className="w-5" />
                  ) : (
                    <img src={clipboard} alt="Copy" className="w-5" />
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={generateReferralLink}
                className="flex items-center mt-[2px]"
                disabled={loading}
              >
                {loading ? 'Just a sec...' : 'View Link'}
              </button>
            )}
          </div>
          (For Signing Up)
        </div>
      </div>

      <div className="flex md:flex-row flex-col justify-between items-center mt-10">
        <h2 className="md:text-left text-left md:text-[27px] text-[30px] xl:text-[40px] font-semibold w-full">
          Lead Board Analysis
        </h2>
        <div className="space-x-4 md:mr-1 xl:mr-[10px] flex w-full md:justify-end justify-start">
          <button
            className={`button ${activeButtonSecondSection === "today" ? "bg-[#fff] text-[#000]" : "bg-transparent"} md:text-[18px] border-[1px] hover:bg-[#fff] hover:text-[#000] transition duration-300 md:py-2 py-1 px-2 md:px-6 rounded mb-2 md:mb-0`}
            onClick={() => setActiveButtonSecondSection("today")}
          >
            Today
          </button>
          <button
            className={`button ${activeButtonSecondSection === "weekly" ? "bg-[#fff] text-[#000]" : "bg-transparent"} md:text-[18px] border-[1px] hover:bg-[#fff] hover:text-[#000] transition duration-300 md:py-2 py-1 px-2 md:px-6 rounded mb-2 md:mb-0`}
            onClick={() => setActiveButtonSecondSection("weekly")}
          >
            Weekly
          </button>
          <button
            className={`button ${activeButtonSecondSection === "monthly" ? "bg-[#fff] text-[#000]" : "bg-transparent"} md:text-[18px] border-[1px] hover:bg-[#fff] hover:text-[#000] transition duration-300 md:py-2 py-1 px-2 md:px-6 rounded mb-2 md:mb-0`}
            onClick={() => setActiveButtonSecondSection("monthly")}
          >
            Monthly
          </button>
          <div className="relative inline-block">
            <button
              className={`button ${activeButtonSecondSection === "custom" ? "bg-[#fff] text-[#000]" : "bg-transparent"} md:text-[18px] border-[1px] hover:bg-[#fff] hover:text-[#000] transition duration-300 md:py-2 py-1 px-2 md:px-6 rounded mb-2 md:mb-0`}
              onClick={handleCustomButtonClick}
            >
              Custom
            </button>
            {isCustomPickerVisible && (
              <div className="absolute top-full right-0 mt-2 z-10 bg-[#2b2d42] p-4 rounded-lg shadow-lg flex flex-col gap-3">
                <DatePicker
                  selected={customStartDate}
                  onChange={(date) => setCustomStartDate(date)}
                  selectsStart
                  startDate={customStartDate}
                  endDate={customEndDate}
                  placeholderText="Start Date"
                  className="bg-transparent text-white border-b border-white mb-2"
                  renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
                    <div className="flex justify-between items-center">
                      <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>{'<'}</button>
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
                      <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>{'>'}</button>
                    </div>
                  )}
                />
                <DatePicker
                  selected={customEndDate}
                  onChange={(date) => handleDateChange(customStartDate, date)}
                  selectsEnd
                  startDate={customStartDate}
                  endDate={customEndDate}
                  minDate={customStartDate}
                  placeholderText="End Date"
                  className="bg-transparent text-white border-b border-white"
                  renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
                    <div className="flex justify-between items-center">
                      <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>{'<'}</button>
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
                      <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>{'>'}</button>
                    </div>
                  )}
                />
                <button
                  onClick={handleClearDates}
                  className="bg-[#fff] text-[#000] px-4 py-1 rounded-md focus:outline-none"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:mt-8">
        <div className="w-full md:w-2/3 pr-0 md:pr-8 md:flex hidden">
          <LeaderBoardAnalysisChart onDataUpdate={handleDataUpdate} activeButton={activeButtonSecondSection} customStartDate={customStartDate} customEndDate={customEndDate} />
        </div>
        <div className="w-full md:w-2/3 pr-0 mt-2 md:hidden">
          <LeaderBoardChartMob onDataUpdate={handleDataUpdate} activeButton={activeButtonSecondSection} customStartDate={customStartDate} customEndDate={customEndDate} />
        </div>
        <div className="w-full md:w-1/3 flex md:flex-col justify-center items-center container-bg rounded-[30px] p-2 md:mt-0 mt-3">
          <img
            src={usersPurple}
            alt=""
            className="md:w-[150px] w-[100px] border-[2px] rounded-full p-4"
          />
          <div className="px-4">
            <h3 className="text-left md:text-[3rem] text-[2rem] xl:text-[4rem] font-bold text-gradient">
              Leader Board
            </h3>
            <div className="flex flex-row justify-between md:text-xl xl:text-2xl">
              <span>Total Visit:</span>
              <span className="font-semibold text-[#247673]">{totalVisits}</span>
            </div>
            <div className="flex flex-row justify-between md:text-xl xl:text-2xl">
              <span>Paid Users:</span>
              <span className="font-semibold text-[#25A2DE]">{paidUsers}</span>
            </div>
            <div className="flex flex-row justify-between md:text-xl xl:text-2xl">
              <span>Not Interested:</span>
              <span className="font-semibold text-[#D0667A]">{notInterested}</span>
            </div>
          </div>
        </div>
      </div>
      <DashboardTable />
    </div>
  );
};

export default DashboardPage;
