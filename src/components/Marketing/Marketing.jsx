import React, { useState, useEffect } from 'react';
import { comingSoon, download } from '../../assets';

const Marketing = () => {
  const [activeTab, setActiveTab] = useState('images');
  const [imageList, setImageList] = useState([]);
  const [videoList, setVideoList] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://copartners.in:5134/api/MarketingContent');
        const data = await response.json();
        if (data.isSuccess) {
          const images = data.data.filter(item => item.contentType.toLowerCase() === 'banner' || item.contentType.toLowerCase() === 'image');
          const videos = data.data.filter(item => item.contentType.toLowerCase() === 'videos');
          setImageList(images);
          setVideoList(videos);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="xl:p-4 md:p-4 sm:ml-[8rem] text-white">
      <div className="md:p-4 p-1 border-gray-200 border-dashed rounded-lg dark:border-gray-700 md:mt-14 mt-[80px]">
        <h2 className="md:text-left text-left md:text-[22px] text-[30px] xl:text-[40px] font-semibold w-full">Marketing Partner</h2>

        {/* Tab buttons */}
        <div className="flex mt-6 flex-wrap md:justify-start justify-start">
          <button
            onClick={() => handleTabChange('images')}
            className={`py-2 px-4 rounded-tl-md rounded-bl-md transition duration-300 ${
              activeTab === 'images' ? 'bg-gray-200 text-gray-800' : 'bg-[transparent] border-solid border-[1px] text-white'
            } hover:bg-gray-300 hover:text-gray-900 mb-2 md:mb-0`}
          >
            Banners
          </button>
          <button
            onClick={() => handleTabChange('videos')}
            className={`py-2 px-4 rounded-tr-md rounded-br-md transition duration-300 ${
              activeTab === 'videos' ? 'bg-gray-200 text-gray-800' : 'bg-[transparent] border-solid border-[1px] text-white'
            } hover:bg-gray-300 hover:text-gray-900 mb-2 md:mb-0`}
          >
            Videos
          </button>
        </div>

        {/* Tab content */}
        <div className="mt-8">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
              {activeTab === 'images' && (
                <div className={`tab-content ${activeTab === 'images' ? 'active' : 'inactive'}`}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {imageList.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image.imagePath}
                          alt={`banner ${index + 1}`}
                          className="w-full h-[300px] object-cover rounded"
                        />
                        <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center text-white text-sm p-2 bg-gray-900 bg-opacity-50 rounded-b">
                          <span>{image.bannerName}</span>
                          <a href={image.imagePath} download={`banner_${index + 1}.jpg`}>
                            <img src={download} className="w-5" alt="Download" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === 'videos' && (
                <div className={`tab-content ${activeTab === 'videos' ? 'active' : 'inactive'}`}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {videoList.map((video, index) => (
                      <div key={index} className="relative">
                        <img
                          src={video.imagePath}
                          alt={`video ${index + 1}`}
                          className="w-full h-[300px] object-cover rounded"
                        />
                        <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center text-white text-sm p-2 bg-gray-900 bg-opacity-50 rounded-b">
                          <span>{video.bannerName}</span>
                          <a href={video.imagePath} download={`video_${index + 1}.jpg`}>
                            <img src={download} className="w-5" alt="Download" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="mt-10">
          <h2 className="md:text-left text-center md:text-[22px] text-[25px] xl:text-[40px] font-semibold w-full">Marketing Partner Listing</h2>
          <div className="py-3">
            <img src={comingSoon} alt="Coming Soon" className="w-full mb-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketing;
