import React from 'react';

const Notification = ({ notifications }) => {
  return (
    <div className='bg-gradient text-[#fff] p-4 rounded-lg'>
      <h3 className='text-lg font-bold mb-2'>Notifications</h3>
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul>
          {notifications.map((notification, index) => (
            <li key={index} className='mb-2'>
              {notification}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notification;
