import React, { useState, useEffect } from 'react';
import { close } from '../../assets';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditProfilePopup = ({ isOpen, onClose, initialProfile, onUpdateProfile }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [gst, setGst] = useState('');
  const [pancard, setPancard] = useState('');
  const [address, setAddress] = useState('');
  const [state, setState] = useState('');
  const [file, setFile] = useState(null);
  const [imageURL, setImageURL] = useState(null);

  useEffect(() => {
    if (initialProfile) {
      setName(initialProfile.name);
      setEmail(initialProfile.email);
      setMobile(initialProfile.mobile);
      setAddress(initialProfile.address);
      setState(initialProfile.state);
      setGst(initialProfile.gst);
      setPancard(initialProfile.pan);
      if (initialProfile.imageURL) {
        setImageURL(initialProfile.imageURL);
      }
    }
  }, [initialProfile]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setImageURL(URL.createObjectURL(selectedFile));
  };

  const uploadImage = async () => {
    if (!file) return null;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://copartners.in:5134/api/AWSStorage?prefix=affiliatePartnerImagePath', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok && data.isSuccess) {
        return data.data.presignedUrl;
      } else {
        console.error('Error uploading image:', data.displayMessage);
        return null;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleSave = async () => {
    if (mobile.length > 10) {
      alert('Mobile number should not be more than 10 digits');
      return;
    }

    try {
      const storedStackIdData = localStorage.getItem("stackIdData");
      if (storedStackIdData) {
        const data = JSON.parse(storedStackIdData);
        const affiliateId = data.id;

        const imageUrl = await uploadImage();
        const patchOperations = [];

        if (name !== initialProfile.name) {
          patchOperations.push({ op: 'replace', path: '/name', value: name });
        }
        if (email !== initialProfile.email) {
          patchOperations.push({ op: 'replace', path: '/email', value: email });
        }
        if (mobile !== initialProfile.mobile) {
          patchOperations.push({ op: 'replace', path: '/mobileNumber', value: mobile });
        }
        if (address !== initialProfile.address) {
          patchOperations.push({ op: 'replace', path: '/address', value: address });
        }
        if (state !== initialProfile.state) {
          patchOperations.push({ op: 'replace', path: '/state', value: state });
        }
        if (imageUrl) {
          patchOperations.push({ op: 'replace', path: '/affiliatePartnerImagePath', value: imageUrl });
        }

        if (patchOperations.length > 0) {
          const response = await fetch(`https://copartners.in:5133/api/AffiliatePartner?Id=${affiliateId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json', 'X-HTTP-Method-Override': 'PATCH'
            },
            body: JSON.stringify(patchOperations)
          });

          if (response.ok) {
            const result = await response.json();
            localStorage.setItem("stackIdData", JSON.stringify(result.data));
            onUpdateProfile(result.data);
            toast.success('Your profile has been updated');
          } else {
            console.error('Error updating profile:', response.statusText);
          }
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-[#2E374B] p-8 rounded-[20px] shadow-lg relative md:w-[1084px] w-[350px]">
            <div className="absolute top-2 right-2">
              <button onClick={onClose}>
                <img src={close} alt="Close" className="w-10 h-10" />
              </button>
            </div>
            <h2 className="md:text-[40px] text-[30px] subheading-color font-semibold mb-4">Profile Edit</h2>
            {/* File Upload */}
            <div className="mb-4 md:w-1/2 w-full text-white">
              <div className='md:text-lg text-md mb-2'>Upload Profile Image</div>
              <label htmlFor="fileUpload" className="cursor-pointer block bg-transparent border-[2px] border-dashed border-[#ffffff66] text-[#c9c9c9] px-[2rem] py-[4rem] rounded-md text-center mb-2">
                Select
                <input type="file" id="fileUpload" className="hidden" onChange={handleFileChange} />
              </label>
              {file && <p className="text-gray-400">{file.name}</p>}
            </div>
            <div className='grid grid-cols-2 gap-4 text-white'>
              <div className="relative text-white">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} id="name" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-[15px] border-1 border-[1px] appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#ffffff46] focus:outline-none focus:ring-0 focus:border-[#ffffff41] peer" placeholder=" " />
                <label htmlFor="name" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-transparent dark:bg-[#2E374B] px-2 peer-focus:bg-[#282F3E] peer-focus:px-2 peer-focus:text-[#fff] peer-focus:dark:text-[#fff]  peer-focus:rounded-md peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Name</label>
              </div>
              <div className="relative text-white">
                <input type="text" value={email} disabled onChange={(e) => setEmail(e.target.value)} id="mailID" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-[15px] border-1 border-[1px] appearance-none dark:text-[#ffffffb6] dark:border-gray-600 dark:focus:border-[#ffffff46] focus:outline-none focus:ring-0 focus:border-[#ffffff41] peer" placeholder=" " />
                <label htmlFor="mailID" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-transparent dark:bg-[#2E374B] px-2 peer-focus:bg-[#282F3E] peer-focus:px-2 peer-focus:text-[#fff] peer-focus:dark:text-[#fff]  peer-focus:rounded-md peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Mail ID</label>
              </div>
              <div className="relative ">
                <input type="number" inputMode='numeric' pattern="\d*" maxLength="10" value={mobile} onChange={(e) => {
                  if (e.target.value.length <= 10) {
                    setMobile(e.target.value);
                  }
                }} id="mobileNumber" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-white bg-transparent rounded-[15px] border-1 border-[1px] appearance-none dark:text:white dark:border-gray-600 dark:focus:border-[#ffffff46] focus:outline-none focus:ring-0 focus:border-[#ffffff41] peer" placeholder=" " />
                <label htmlFor="mobileNumber" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-transparent dark:bg-[#2E374B] px-2 peer-focus:bg-[#282F3E] peer-focus:px-2 peer-focus:text-[#fff] peer-focus:dark:text-[#fff]  peer-focus:rounded-md peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Mobile Number</label>
              </div>
              <div className="relative">
                <input type="text" inputMode='gstNumber' disabled value={gst} onChange={(e) => setGst(e.target.value)} id="gstNumber" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-[15px] border-1 border-[1px] appearance-none dark:text-[#ffffffb6] dark:border-gray-600 dark:focus:border-[#ffffff46] focus:outline-none focus:ring-0 focus:border-[#ffffff41] peer" placeholder=" " />
                <label htmlFor="gstNumber" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-transparent dark:bg-[#2E374B] px-2 peer-focus:bg-[#282F3E] peer-focus:px-2 peer-focus:text-[#fff] peer-focus:dark:text-[#fff]  peer-focus:rounded-md peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">GST Number</label>
              </div>
              <div className="relative">
                <input type="text" inputMode='panCard' disabled value={pancard} onChange={(e) => setPancard(e.target.value)} id="panCard" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-[15px] border-1 border-[1px] appearance-none dark:text-[#ffffffb6] dark:border-gray-600 dark:focus:border-[#ffffff46] focus:outline-none focus:ring-0 focus:border-[#ffffff41] peer" placeholder=" " />
                <label htmlFor="panCard" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-transparent dark:bg-[#2E374B] px-2 peer-focus:bg-[#282F3E] peer-focus:px-2 peer-focus:text-[#fff] peer-focus:dark:text-[#fff]  peer-focus:rounded-md peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">PAN Card</label>
              </div>
              <div className="relative">
                <input type="text" inputMode='address' value={address} onChange={(e) => setAddress(e.target.value)} id="address" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-white bg-transparent rounded-[15px] border-1 border-[1px] appearance-none dark:text:white dark:border-gray-600 dark:focus:border-[#ffffff46] focus:outline-none focus:ring-0 focus:border-[#ffffff41] peer" placeholder=" " />
                <label htmlFor="address" className="absolute text-sm text-white dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-transparent dark:bg-[#2E374B] px-2 peer-focus:bg-[#282F3E] peer-focus:px-2 peer-focus:text-[#fff] peer-focus:dark:text-[#fff] peer-focus:rounded-md peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Address</label>
              </div>
              <div className="relative">
                <input type="text" inputMode='state' value={state} onChange={(e) => setState(e.target.value)} id="state" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-white bg-transparent rounded-[15px] border-1 border-[1px] appearance-none dark:text:white dark:border-gray-600 dark:focus:border-[#ffffff46] focus:outline-none focus:ring-0 focus:border-[#ffffff41] peer" placeholder=" " />
                <label htmlFor="state" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-transparent dark:bg-[#2E374B] px-2 peer-focus:bg-[#282F3E] peer-focus:px-2 peer-focus:text-[#fff] peer-focus:dark:text-[#fff] peer-focus:rounded-md peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">State</label>
              </div>
            </div>
            <div className='flex justify-center mt-5'>
              <button onClick={handleSave} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Save</button>
            </div>
          </div>
        </div>
      )}
                <ToastContainer />

    </>
  );
};

export default EditProfilePopup;
