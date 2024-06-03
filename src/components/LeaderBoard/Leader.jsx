import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { customBtn, graph, graph2, usersPurple } from "../../assets";
import LeaderboardTable from "./LeaderboardTable";
import LeaderBoardAnalysisChart from "../Dashboard/LeaderBoardAnalysisChart";
import LeaderBoardChartMob from '../Dashboard/LeaderBoardChartMob';
import DataSampleFilter from "./DataSampleFilter";

const Leader = () => {
  const [activeButtonSecondSection, setActiveButtonSecondSection] = useState("today");
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);
  const [isCustomPickerVisible, setIsCustomPickerVisible] = useState(false);
  const [totalVisits, setTotalVisits] = useState(0);
  const [paidUsers, setPaidUsers] = useState(0);
  const [notInterested, setNotInterested] = useState(0);

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
  };

  const handleDataUpdate = (data) => {
    setTotalVisits(data.totalVisits);
    setPaidUsers(data.paidUsers);
    setNotInterested(data.notInterested);
  };

  useEffect(() => {
    console.log("Total Visits: ", totalVisits);
    console.log("Paid Users: ", paidUsers);
    console.log("Not Interested: ", notInterested);
  }, [totalVisits, paidUsers, notInterested]);

  return (
    <div className="xl:px-1 md:p-4 sm:ml-[10rem] text-white">
      <div className="p-1 border-gray-200 border-dashed rounded-lg dark:border-gray-700 md:mt-14 mt-[30px]">
        <div className="text-white text-center">
          {/* Second Section */}
          <div className="flex md:flex-row flex-col justify-between mt-10 md:flex-nowrap flex-wrap">
            <h2 className="md:text-left text-left md:text-[27px] text-[30px] xl:text-[40px] font-semibold w-full">Lead Board Analysis</h2>
            <div className="space-x-4 md:mr-1 xl:mr-[10px] flex w-full md:justify-end justify-start md:flex-nowrap flex-wrap">
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

          <div className="flex flex-col md:flex-row md:mt-8 mt-4">
            <div className="w-full md:w-2/3 pr-0 md:pr-8 md:flex hidden">
              <LeaderBoardAnalysisChart
                activeButton={activeButtonSecondSection}
                customStartDate={customStartDate}
                customEndDate={customEndDate}
                onDataUpdate={handleDataUpdate}
              />
            </div>
            <div className="w-full md:w-2/3 pr-0 md:pr-8 md:hidden">
              <LeaderBoardChartMob
                activeButton={activeButtonSecondSection}
                customStartDate={customStartDate}
                customEndDate={customEndDate}
                onDataUpdate={handleDataUpdate}
              />
            </div>
            <div className="leaderDiv w-full md:w-1/3 flex md:flex-col justify-center items-center container-bg rounded-[30px] p-2 md:mt-0 mt-3">
              <img src={usersPurple} alt="" className="md:w-[150px] w-[100px] border-[2px] rounded-full p-4" />
              <div className="px-4">
                <h3 className="text-left md:text-[3rem] text-[1.7rem] xl:text-[4rem] font-bold text-gradient">Leader Board</h3>
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
        </div>

        <LeaderboardTable />
        {/* <DataSampleFilter /> */}
      </div>
    </div>
  );
};

export default Leader;
