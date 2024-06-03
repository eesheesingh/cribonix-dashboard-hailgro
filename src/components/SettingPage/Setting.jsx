import React, { useState, useEffect, useRef } from 'react';
import { call, card, cardHolder, mail, userImg, clipboard, tick, editBtn, editBlack, address, state } from '../../assets';
import DocumentSetting from './DocumentSetting';
import BankSetting from './BankSetting';
import EditProfilePopup from '../Popups/EditProfilePopup';
import ProfileCardMob from './ProfileCardMob';

const Setting = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    mobile: '',
    gst: '',
    pan: '',
    address: '',
    state: '',
    referralCode: '',
    imageURL: ''
  });
  const [relationshipManager, setRelationshipManager] = useState(null);
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showTick, setShowTick] = useState(false);
  const referralLinkRef = useRef(null);
  const referralCodeRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [affiliateData, setAffiliateData] = useState(null);

  useEffect(() => {
    const fetchAffiliateData = async () => {
      try {
        const storedStackIdData = localStorage.getItem("stackIdData");
        if (storedStackIdData) {
          const data = JSON.parse(storedStackIdData);
          setAffiliateData(data);
          setProfile({
            name: data.name || '',
            email: data.email || '',
            mobile: data.mobileNumber || '',
            gst: data.gst || '',
            pan: data.pan || '',
            address: data.address || "",
            state: data.state || "",
            referralCode: data.referralCode || '',
            imageURL: data.affiliatePartnerImagePath || ''
          });

          if (data.relationshipManagerId) {
            await fetchRelationshipManagerData(data.relationshipManagerId);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchRelationshipManagerData = async (id) => {
      try {
        const response = await fetch(`https://copartners.in:5134/api/RelationshipManager/${id}`);
        if (response.ok) {
          const managerData = await response.json();
          setRelationshipManager(managerData);
        } else {
          console.error('Failed to fetch relationship manager data');
        }
      } catch (error) {
        console.error('Error fetching relationship manager data:', error);
      }
    };

    fetchAffiliateData();
  }, []);

  const handleEditProfileClick = () => {
    setIsEditProfileOpen(true);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const copyToClipboard = () => {
    if (referralLinkRef.current) {
      const fullLink = referralLinkRef.current.innerText;
      navigator.clipboard.writeText(fullLink);
      setCopied(true);
      setShowTick(true);
      setTimeout(() => {
        setShowTick(false);
      }, 1500);
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    }
  };

  const copyCodeToClipboard = () => {
    if (referralCodeRef.current) {
      const fullCode = referralCodeRef.current.innerText;
      navigator.clipboard.writeText(fullCode);
      setCopiedCode(true);
      setShowTick(true);
      setTimeout(() => {
        setShowTick(false);
      }, 1500);
      setTimeout(() => {
        setCopiedCode(false);
      }, 3000);
    }
  };

  const updateProfile = (updatedProfile) => {
    setProfile({ ...profile, ...updatedProfile });
    localStorage.setItem("stackIdData", JSON.stringify(updatedProfile));
  };

  return (
    <div className="xl:px-1 md:p-4 sm:ml-[10rem] text-white">
      <div className="p-1 border-gray-200 border-dashed rounded-lg dark:border-gray-700 md:mt-[5rem] mt-[5rem]">
        <div className="text-white text-left">
          <div className='container-bg rounded-[20px] p-3 px-10 md:block hidden'>
            <div className='profileCard w-[100%] flex items-center justify-between'>
              <div className='w-2/3'>
                <span className='text-gradient text-[70px] font-bold'>{profile.name}</span>
                <div className='flex flex-col md:w-full xl:w-[80%] gap-5'>
                  <div className='flex flex-row justify-start gap-28'>
                    <div className='flex flex-col gap-3'>
                      <div className='flex flex-row'>
                        <span className='flex items-center gap-3 text-[#c9c9c9]'>
                          <img src={mail} alt="" className='w-5'/>
                          {profile.email}
                        </span>
                      </div>
                      <div className='flex flex-row'>
                        <span className='flex items-center gap-3 text-[#c9c9c9]'>
                          <img src={cardHolder} alt="" className='w-5'/>
                          {profile.gst || 'GST Number'}
                        </span>
                      </div>
                    </div>
                    <div className='flex flex-col gap-3'>
                      <span className='flex items-center gap-3 text-[#c9c9c9]'>
                        <img src={call} alt="" className='w-5'/>
                        {profile.mobile}
                      </span>
                      <div className='flex flex-row flex-nowrap'>
                        <span className='flex items-center gap-3 text-[#c9c9c9] flex-nowrap'>
                          <img src={card} alt="" className='w-5'/>
                          {profile.pan || 'PAN Card Number'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='flex flex-row items-start gap-8'>
                      <span className='flex w-[250px] items-start gap-3 text-[#c9c9c9]'>
                        <img src={address} alt="" className='w-5 mt-1'/>
                        {profile.address || 'Address'}
                      </span>
                      <div className='flex flex-row flex-nowrap'>
                        <span className='flex items-center gap-3 text-[#c9c9c9] flex-nowrap'>
                          <img src={state} alt="" className='w-5'/>
                          {profile.state || 'State'}
                          </span>
                      </div>
                    </div>

                  <div className='referralLink flex flex-row gap-3 items-center'>
                    <span className='whitespace-nowrap overflow-ellipsis text-[#c9c9c9] text-lg'>
                      Referral Code:
                    </span>
                    <div className='border-[#fff] border-[1px] flex flex-row gap-2 rounded-[50px] px-3 py-1'>
                      <span ref={referralCodeRef} className='overflow-hidden whitespace-nowrap overflow-ellipsis text-[#c9c9c9]'>{profile.referralCode}</span>|
                      <button onClick={copyCodeToClipboard}>
                        {copiedCode ? (showTick ? <img src={tick} alt="Copied" className='w-5' /> : <img src={clipboard} alt="Copy" className='w-5'/>) : <img src={clipboard} alt="Copy" className='w-5'/>}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className='rightImgCol flex justify-end w-[1/3] relative userBack'>
                <img 
                  src={profile.imageURL || userImg} 
                  alt="" 
                  className='w-[300px] h-[300px] object-cover maskImage' 
                />
                <button className="absolute flex bottom-0 right-0 bg-[#ffffff43] hover:bg-[#fff] items-center text-white hover:text-[#000] px-5 py-1 border-[1px] rounded-[50px] transition duration-300"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={handleEditProfileClick}
                >
                  {isHovered ? (
                    <>
                      <img src={editBlack} alt="" className="inline-block w-3 mr-2" />
                      Edit
                    </>
                  ) : (
                    <>
                      <img src={editBtn} alt="" className="inline-block w-3 mr-2" />
                      Edit
                    </>
                  )}
                </button>
              </div>
            </div>

            {relationshipManager && relationshipManager.data && (
              <div className='Manager py-2 text-nowrap'>
                <div className='text-[30px]'>Your Relationship Manager</div>
                <div className='flex flex-row flex-wrap pt-3 justify-between'>
                  <div className='flex flex-row items-center justify-center gap-3'>
                    <span className='text-lg'>Name :</span>
                    <span className='text-[18px] p-3 bg-[#22262F] rounded-[50px] px-8'>{relationshipManager.data.name}</span>
                  </div>
                  <div className='flex flex-row items-center justify-center gap-3'>
                    <span className='text-lg'>Mobile Number :</span>
                    <span className='text-[18px] p-3 bg-[#22262F] rounded-[50px] px-8'>{relationshipManager.data.mobile}</span>
                  </div>
                  <div className='flex md:pt-3 flex-row items-center justify-center gap-3'>
                    <span className='text-lg '>Mail ID :</span>
                    <span className='text-[18px] p-3 bg-[#22262F] rounded-[50px] px-8'>{relationshipManager.data.email}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className='md:hidden'>
            <ProfileCardMob />
          </div>

          <div className='my-5'>
            <DocumentSetting />
          </div>

          <div className='my-5'>
            <BankSetting />
          </div>
        </div>
      </div>
      <EditProfilePopup 
        isOpen={isEditProfileOpen} 
        onClose={() => setIsEditProfileOpen(false)} 
        onUpdateProfile={updateProfile}
        initialProfile={{ name: profile.name, email: profile.email, mobile: profile.mobile, file: profile.file, imageURL: profile.imageURL, pan: profile.pan, address:profile.address, state: profile.state, gst: profile.gst }}
      />
    </div>
  );
};

export default Setting;
