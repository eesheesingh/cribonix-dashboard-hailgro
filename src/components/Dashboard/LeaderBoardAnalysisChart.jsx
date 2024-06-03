import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { parseISO, format, addDays, startOfWeek, isWithinInterval } from 'date-fns';

const LeaderBoardAnalysisChart = ({ activeButton, customStartDate, customEndDate, onDataUpdate }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedStackIdData = localStorage.getItem("stackIdData");
        if (storedStackIdData) {
          const stackIdData = JSON.parse(storedStackIdData);
          const affiliateId = stackIdData.id;

          const response = await axios.get(
            `https://copartners.in:5133/api/APDashboard/GetDashboardAPListingData/${affiliateId}?page=1&pageSize=10`
          );

          if (response.data.isSuccess) {
            const apiData = response.data.data;
            const dailyData = {};
            const weeklyData = [];
            const monthlyData = Array(12).fill().map((_, index) => ({
              name: format(new Date(2024, index, 1), 'MMMM'),
              totalVisit: 0,
              paidUsers: 0,
              usersLeft: 0,
            }));

            const currentDate = new Date();
            const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
            for (let day = 1; day <= daysInMonth; day++) {
              const dayLabel = format(new Date(currentDate.getFullYear(), currentDate.getMonth(), day), 'yyyy-MM-dd');
              dailyData[dayLabel] = { name: dayLabel, totalVisit: 0, paidUsers: 0, usersLeft: 0 };
            }

            const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 }); // Assuming week starts on Monday
            for (let day = 0; day < 7; day++) {
              const weekDate = format(addDays(startOfCurrentWeek, day), 'yyyy-MM-dd');
              weeklyData.push({ name: weekDate, totalVisit: 0, paidUsers: 0, usersLeft: 0 });
            }

            apiData.forEach((item) => {
              const date = parseISO(item.userJoiningDate);
              const dayLabel = format(date, 'yyyy-MM-dd');
              const weekIndex = weeklyData.findIndex(d => d.name === dayLabel);
              const month = date.getMonth();

              const totalVisit = 1;
              const paidUser = item.subscription !== '0' ? 1 : 0;
              const notInterested = item.subscription === '0' ? 1 : 0;

              if (dailyData[dayLabel]) {
                dailyData[dayLabel].totalVisit += totalVisit;
                dailyData[dayLabel].paidUsers += paidUser;
                dailyData[dayLabel].usersLeft += notInterested;
              }

              if (weekIndex !== -1) {
                weeklyData[weekIndex].totalVisit += totalVisit;
                weeklyData[weekIndex].paidUsers += paidUser;
                weeklyData[weekIndex].usersLeft += notInterested;
              }

              monthlyData[month].totalVisit += totalVisit;
              monthlyData[month].paidUsers += paidUser;
              monthlyData[month].usersLeft += notInterested;
            });

            console.log("Processed Data: ", { daily: Object.values(dailyData), weekly: weeklyData, monthly: monthlyData });

            setData({
              daily: Object.values(dailyData),
              weekly: weeklyData,
              monthly: monthlyData,
            });
          } else {
            setError(response.data.displayMessage || 'Unknown error occurred');
          }
        } else {
          setError('No stackIdData found in local storage');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const selectedData = selectData();
    const totalVisits = selectedData.reduce((sum, item) => sum + item.totalVisit, 0);
    const paidUsers = selectedData.reduce((sum, item) => sum + item.paidUsers, 0);
    const notInterested = selectedData.reduce((sum, item) => sum + item.usersLeft, 0);
    console.log("Selected Data: ", selectedData);
    onDataUpdate({ totalVisits, paidUsers, notInterested });
  }, [data, activeButton, customStartDate, customEndDate]);

  const selectData = () => {
    const currentDate = format(new Date(), 'yyyy-MM-dd');

    switch (activeButton) {
      case 'today':
        const todayData = data.daily?.find(d => d.name === currentDate) || { name: currentDate, totalVisit: 0, paidUsers: 0, usersLeft: 0 };
        return [todayData];
      case 'weekly':
        return data.weekly || [];
      case 'monthly':
        return data.monthly || [];
      case 'custom':
        if (customStartDate) {
          const endDate = customEndDate || customStartDate;
          return data.daily?.filter(d => isWithinInterval(parseISO(d.name), { start: customStartDate, end: endDate })) || [];
        }
        return [];
      default:
        return [];
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip rounded-[10px] p-2 bg-gradient border border-[#ffffff31]">
          {payload.map((entry, index) => (
            <p key={`tooltip-${index}`} style={{ color: entry.color }}>
              {`${entry.name} : ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div style={{ width: '100%', height: '400px', backgroundColor: '#2b2d42', borderRadius: '30px', padding: '15px' }}>
      {error && <div className="text-red-500">{error}</div>}
      <ResponsiveContainer>
        <BarChart
          data={selectData()}
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#3a3e5c" />
          <XAxis dataKey="name" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ color: '#fff' }} />
          <Bar dataKey="totalVisit" fill="#247673" name="Total Visit" />
          <Bar dataKey="paidUsers" fill="#25A2DE" name="Paid Users" />
          <Bar dataKey="usersLeft" fill="#D0667A" name="Not Interested (Left)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LeaderBoardAnalysisChart;
