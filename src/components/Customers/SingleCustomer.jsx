import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { filterBlack, filterBtn, leftArrow } from '../../assets';

const SingleCustomer = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [customerData, setCustomerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams(); // Get the customer ID from the URL
  const navigate = useNavigate();
  const affiliateId = '705716b5-a1e8-411a-5e97-08dc770b4aef';

  useEffect(() => {
    // Fetch customer data using the ID from the URL
    const fetchCustomerData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://copartners.in:5133/api/APDashboard/GetDashboardAPListingData/${affiliateId}?page=1&pageSize=1000`);
        const result = await response.json();
        const customerDetails = result.data.filter(customer => customer.id === id);
        setCustomerData(customerDetails);
      } catch (error) {
        console.error('Error fetching customer data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [id]);

  const handleHoverFocused = () => {
    setIsFocused(true);
  }

  const handleHoverLeave = () => {
    setIsFocused(false);
  }

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = () => {
    navigate(-1); // Go back to the last page
  };

  return (
    <div className="xl:p-4 md:h-[100vh] xl:h-[100vh] md:p-4 sm:ml-[8rem] text-white">
      <div className="p-4 border-gray-200 border-dashed rounded-lg dark:border-gray-700 md:mt-3 mt-[6rem]">
        <div className="relative">
          <div className="flex justify-between mt-10 items-center">
            <div className='flex flex-row items-center justify-center ml-3'>
              <img
                src={leftArrow}
                alt=""
                className={`w-9 h-10 mr-2 border-[1px] border-[#ffffff35] rounded-lg p-3 ${isFocused ? 'scale-110' : ''} transition duration-300 cursor-pointer`}
                onMouseEnter={handleHoverFocused}
                onMouseLeave={handleHoverLeave}
                onClick={handleClick} // Add onClick handler to go back
              />
              <h2 className="text-left md:text-[22px] xl:text-[40px] font-semibold">{customerData[0]?.apName || 'Customer'}</h2>
            </div>
            <div className="flex items-center">
              <button
                className="bg-transparent border-[1px] text-white px-5 py-3 rounded-lg transition duration-300 hover:bg-[#fff] hover:text-[#000]"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {isHovered ? (
                  <>
                    <img src={filterBlack} alt="" className="inline-block w-[12px] mr-[8px]" />
                    Filter
                  </>
                ) : (
                  <>
                    <img src={filterBtn} alt="" className="inline-block w-4 mr-1" />
                    Filter
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-4 relative overflow-x-auto rounded-[30px] border-[#ffffff3e] border">
            {loading ? (
              <div className="text-center p-4">Loading...</div>
            ) : (
              <table className="md:w-full w-[200%] table-fixed">
                <thead className="text-center bg-[#29303F] sticky top-0">
                  <tr>
                    <th className="text-center text-[15px]">DATE</th>
                    <th className="text-center text-[15px]">SUBSCRIPTION</th>
                    <th className="text-center text-[15px]">EXPERTISE</th>
                    <th className="text-center text-[15px]">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {customerData.map((customer, index) => (
                    <tr key={index}>
                      <td className="text-center">{customer.date}</td>
                      <td className="text-center">{customer.subscription}</td>
                      <td className="text-center">{customer.expertise}</td>
                      <td className="text-center">₹{customer.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCustomer;
