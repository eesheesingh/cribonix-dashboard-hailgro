import React, { useRef, useState } from "react";
import { graph, graph2, usersPurple, customBtn, tick, clipboard } from "../../assets";
import DashboardTable from "./DashboardTable";
import BankListingPopup from '../Popups/BankListingPopup';
import DashboardChart from './DashboardChart'
import LeaderBoardAnalysisChart from './LeaderBoardAnalysisChart'
import LeaderBoardChartMob from './LeaderBoardChartMob.jsx'
import DashboardChartMob from "./DashboardChartMonb.jsx"


const Dashboard = () => {
  const [activeButtonFirstSection, setActiveButtonFirstSection] = useState("weekly");
  const [activeButtonSecondSection, setActiveButtonSecondSection] = useState("today"); // Change initial state to "today"
  const [copiedReferralLink, setCopiedReferralLink] = useState(false);
  const [copiedReferralCode, setCopiedReferralCode] = useState(false);
  const [isBankListingPopupOpen, setIsBankListingPopupOpen] = useState(false);

  const toggleBankListingPopup = () => {
    setIsBankListingPopupOpen(!isBankListingPopupOpen);
  };

  const referralLinkRef = useRef(null);
  const referralCodeRef = useRef(null);

  const copyReferralLinkToClipboard = () => {
    if (referralLinkRef.current) {
      const fullLink = referralLinkRef.current.innerText;
      navigator.clipboard.writeText(fullLink);
      setCopiedReferralLink(true);
      setTimeout(() => {
        setCopiedReferralLink(false);
      }, 3000);
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

  return (
    
    <div className="xl:p-4 md:p-4 sm:ml-[8rem] text-white">
      <div className="p-4 border-gray-200 border-dashed rounded-lg dark:border-gray-700 md:mt-14 mt-[90px]">
        <div className="text-white text-center5">
          {/* First Section */}
          <div className="flex md:flex-row flex-col justify-between mt-2">
            <h2 className="md:text-left text-center md:text-[22px] text-[30px] xl:text-[40px] font-semibold w-full">Earning Analysis</h2>
            <div className="space-x-4 md:mr-1 xl:mr-[30px] flex w-full md:justify-end justify-center">
              <button
                className={`button ${activeButtonFirstSection === "today" ? "bg-[#fff] text-[#000]" : "bg-transparent"} md:text-[18px] text-[13px] md:border-[1px] hover:bg-[#fff] hover:text-[#000] transition duration-300 py-2 px-6 rounded mb-2 md:mb-0`}
                onClick={() => setActiveButtonFirstSection("today")}
              >
                Today
              </button>
              <button
                className={`button ${activeButtonFirstSection === "weekly" ? "bg-[#fff] text-[#000]" : "bg-transparent"} md:text-[18px] text-[13px] border-[1px] hover:bg-[#fff] hover:text-[#000] transition duration-300 md:py-2 py-1 px-2 md:px-6 rounded mb-2 md:mb-0`}
                onClick={() => setActiveButtonFirstSection("weekly")}
              >
                Weekly
              </button>
              <button
                className={`button ${activeButtonFirstSection === "monthly" ? "bg-[#fff] text-[#000]" : "bg-transparent"} md:text-[18px] text-[13px] border-[1px] hover:bg-[#fff] hover:text-[#000] transition duration-300 md:py-2 py-1 px-2 md:px-6 rounded mb-2 md:mb-0`}
                onClick={() => setActiveButtonFirstSection("monthly")}
              >
                Monthly
              </button>
              <button
                className={`button ${activeButtonFirstSection === "custom" ? "bg-[#fff] text-[#000]" : "bg-transparent"}md:text-[18px] text-[13px] border-[1px] hover:bg-[#fff] hover:text-[#000] transition duration-300 md:py-2 py-1 px-2 md:px-6 rounded mb-2 md:mb-0`}
                onClick={() => setActiveButtonFirstSection("custom")}
              >
                Custom
                <img src={customBtn} alt="" className="inline-block w-5 ml-1" />
              </button>
            </div>
          </div>

          {/* First Section Content */}
          <div className="flex flex-col md:flex-row md:mt-8 md:gap-0 gap-3">
            <div className="w-full md:w-2/3 pr-0 md:pr-8 md:flex hidden">
              <DashboardChart activeButton={activeButtonFirstSection} />
            </div>

            <div className="w-full md:w-2/3 pr-0 md:pr-8 md:hidden">
              <DashboardChartMob activeButton={activeButtonFirstSection}/>
            </div>
            <div className="w-full md:w-1/3 flex flex-col justify-center items-center container-bg rounded-[30px] p-3 md:max-h-full min-h-[100px]">
              <h3 className="text-center font-semibold md:text-[30px] text-[25px] xl:text-[50px]">Total Earning</h3>
              <h1 className="md:text-[75px] text-[60px] xl:text-[85px] text-gradient font-bold">₹100</h1>
              <div className="md:px-[40px] mb-4 xl:text-[20px] md:text-[14px]">
                <p className="text-center text-[#c9c9c9]">
                  With Cobalt, managing your business.{" "}
                  <span className="text-[#fff]">Say no to spreadsheets.</span>
                </p>
              </div>
              {/* Withdrawal Button */}
              <div className="flex justify-center">
                <button className="bg-[#fff] transition duration-300 text-[#000] hover:bg-[#000] hover:text-[#fff] px-6 py-3 rounded" onClick={() => toggleBankListingPopup(true)}>
                  Withdrawal
                </button>
              </div>

              {/* Withdrawal Popup */}
              {isBankListingPopupOpen && <BankListingPopup onClose={toggleBankListingPopup}/>}
            </div>
          </div>

          {/* Referral Link with concatenation for mobile view */}
<div className="flex flex-col md:flex-row justify-between p-3 md:px-[40px] mt-5 bg-[#29303F] rounded-[20px] items-center">
  <div className="flex flex-row md:flex-row items-center gap-3 w-full md:w-auto">
    <span className="md:text-lg text-sm">Referral Link :</span>
    <div className="p-1 px-3 flex rounded-[30px] bg-transparent border-[1px]">
      <span ref={referralLinkRef} className="mr-1 md:block hidden">https://www.example.com/referral</span>
      <span ref={referralLinkRef} className="mr-1 md:hidden md:text-lg text-sm">https://www.example.com/...</span> {/* Render shortened link in mobile view */}
      <button onClick={copyReferralLinkToClipboard} className="flex items-center mt-[2px]">| 
        {copiedReferralLink ? (
          <img src={tick} alt="Copied" className="w-5" />
        ) : (
          <img src={clipboard} alt="Copy" className="w-5" />
        )}
      </button>
    </div>
  </div>
  <div className="flex flex-row md:flex-row items-center gap-3 py-2 w-full md:w-auto mt-2 md:mt-0">
              <span className="md:text-lg text-sm">Referral Code :</span>
              <div className="p-1 px-3 flex rounded-[30px] bg-transparent border-[1px]">
                <span ref={referralCodeRef} className="mr-1 md:text-lg text-sm">REFCODE123</span>
                <button onClick={copyReferralCodeToClipboard}className="flex items-center">| 
                  {copiedReferralCode ? (
                    <img src={tick} alt="Copied" className="w-5" />
                  ) : (
                    <img src={clipboard} alt="Copy" className="w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Second Section */}
          <div className="flex md:flex-row flex-col justify-between mt-10 ">
            <h2 className="md:text-left text-center md:text-[22px] text-[30px] xl:text-[40px] font-semibold w-full">Lead Board Analysis</h2>
            <div className="space-x-4 md:mr-1 xl:mr-[60px] flex w-full md:justify-end justify-center">
              <button
                className={`button ${activeButtonSecondSection === "today" ? "bg-[#fff] text-[#000]" : "bg-transparent"} md:text-[18px] border-[1px] hover:bg-[#fff] hover:text-[#000] transition duration-300 md:py-2 py-1 px-2 md:px-6 rounded mb-2 md:mb-0`}
                onClick={() => setActiveButtonSecondSection("today")} // Change to set activeButtonSecondSection to "today"
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
              <button
                className={`button ${activeButtonSecondSection === "custom" ? "bg-[#fff] text-[#000]" : "bg-transparent"} md:text-[18px] border-[1px] hover:bg-[#fff] hover:text-[#000] transition duration-300 md:py-2 py-1 px-2 md:px-6 rounded mb-2 md:mb-0`}
                onClick={() => setActiveButtonSecondSection("custom")}
              >
                Custom
                <img src={customBtn} alt="" className="inline-block w-5 ml-1" />
              </button>
            </div>
          </div>

          {/* Second Section Content */}
          <div className="flex flex-col md:flex-row md:mt-8">
            <div className="w-full md:w-2/3 pr-0 md:pr-8 md:flex hidden">
              <LeaderBoardAnalysisChart activeButton={activeButtonSecondSection}/> {/* Change activeButton prop to activeButtonSecondSection */}
            </div>
            <div className="w-full md:w-2/3 pr-0 md:pr-8 md:hidden">
            <LeaderBoardChartMob activeButton={activeButtonSecondSection}/> {/* Change activeButton prop to activeButtonSecondSection */}
            </div>
            <div className="w-full md:w-1/3 flex md:flex-col justify-center items-center container-bg rounded-[30px] p-2 md:mt-0 mt-3">
              <img src={usersPurple} alt="" className="md:w-[150px] w-[100px] border-[2px] rounded-full p-4" />
              <div className="px-4">
                <h3 className="text-left md:text-[3rem] text-[2rem] xl:text-[4rem] font-bold text-gradient">Leader Board</h3>
                <div className="flex flex-row justify-between md:text-xl xl:text-2xl">
                  <span>Total Visit:</span>
                  <span className="font-semibold text-[#247673]">100</span>
                </div>
                <div className="flex flex-row justify-between md:text-xl xl:text-2xl">
                  <span>Paid Users:</span>
                  <span className="font-semibold text-[#25A2DE]">+40</span>
                </div>
                <div className="flex flex-row justify-between md:text-xl xl:text-2xl">
                  <span>Not Interested:</span>
                  <span className="font-semibold text-[#D0667A]">60</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div><DashboardTable /></div>
      </div>
    </div>
  );
};

export default Dashboard;
