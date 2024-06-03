import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { parseISO, format, addMinutes, startOfWeek, addDays, isWithinInterval } from 'date-fns';

const DashboardChartMob = ({ activeButton, customStartDate, customEndDate }) => {
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

            // Group data by day of the week and month
            const dailyData = {};
            const weeklyData = [];
            const monthlyData = Array(12).fill().map((_, index) => ({
              name: format(new Date(2024, index, 1), 'MMMM'), // Generate month names
              earnings: 0,
            }));

            // Initialize dailyData for each day in the month (assuming current month)
            const currentDate = new Date();
            const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
            for (let day = 1; day <= daysInMonth; day++) {
              const dayLabel = format(new Date(currentDate.getFullYear(), currentDate.getMonth(), day), 'yyyy-MM-dd');
              dailyData[dayLabel] = { name: dayLabel, earnings: 0 };
            }

            // Initialize weekly data for the current week
            const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 }); // Assuming week starts on Monday
            for (let day = 0; day < 7; day++) {
              const weekDate = format(addDays(startOfCurrentWeek, day), 'yyyy-MM-dd');
              weeklyData.push({ name: weekDate, earnings: 0 });
            }

            apiData.forEach((item) => {
              // Convert the date to IST (UTC+5:30)
              const date = addMinutes(parseISO(item.userJoiningDate), 330);
              const dayLabel = format(date, 'yyyy-MM-dd');
              const weekIndex = weeklyData.findIndex(d => d.name === dayLabel);
              const month = date.getMonth();

              const earnings = item.amount || 0;

              // Update daily earnings
              if (dailyData[dayLabel]) {
                dailyData[dayLabel].earnings += earnings;
              }

              // Update weekly earnings
              if (weekIndex !== -1) {
                weeklyData[weekIndex].earnings += earnings;
              }

              // Monthly data
              monthlyData[month].earnings += earnings;
            });

            setData({
              daily: Object.values(dailyData),
              weekly: weeklyData,
              monthly: monthlyData,
            });
          } else {
            setError(response.data.displayMessage);
          }
        }
      } catch (error) {
        setError('Error fetching data');
      }
    };

    fetchData();
  }, []);

  const selectData = () => {
    switch (activeButton) {
      case 'today':
        return data.daily?.slice(-1) || [];
      case 'weekly':
        return data.weekly || [];
      case 'monthly':
        return data.monthly || [];
      case 'custom':
        if (customStartDate) {
          const endDate = customEndDate || new Date(); // Use current date if customEndDate is not provided
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
        <LineChart
          data={selectData()}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#3a3e5c" />
          <XAxis dataKey="name" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ color: '#fff' }} />
          <Line type="monotone" dataKey="earnings" stroke="#64dfdf" strokeWidth={4} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardChartMob;
