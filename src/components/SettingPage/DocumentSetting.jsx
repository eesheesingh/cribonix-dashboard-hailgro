import React, { useState, useEffect } from 'react';
import { document, deleteIcon } from '../../assets';

const DocumentSetting = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [kycVideoPath, setKycVideoPath] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedStackIdData = localStorage.getItem("stackIdData");
        if (storedStackIdData) {
          const data = JSON.parse(storedStackIdData);
          const affiliateId = data.id;

          const response = await fetch(`https://copartners.in:5133/api/AffiliatePartner/${affiliateId}`);
          if (response.ok) {
            const result = await response.json();
            setKycVideoPath(result.data.kycVideoPath);
          } else {
            console.error('Failed to fetch user data.');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles([...selectedFiles, ...files]);

    await Promise.all(files.map(file => uploadFile(file)));
    window.location.reload(); // Refresh the page after upload
  };

  const uploadFile = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file, file.name);

      const uploadResponse = await fetch(`https://copartners.in:5134/api/AWSStorage?prefix=${file.name}`, {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file");
      }

      const uploadData = await uploadResponse.json();
      const presignedURL = uploadData.data.presignedUrl;

      const storedStackIdData = localStorage.getItem("stackIdData");
      if (storedStackIdData) {
        const data = JSON.parse(storedStackIdData);
        const affiliateId = data.id;

        const patchData = [
          {
            path: 'documentPath',
            op: 'add',
            value: presignedURL,
          }
        ];

        const response = await fetch(`https://copartners.in:5133/api/AffiliatePartner?Id=${affiliateId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json-patch+json',
          },
          body: JSON.stringify(patchData),
        });

        if (!response.ok) {
          throw new Error('Failed to update document path');
        }
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert('Failed to upload document.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  const truncateFileName = (fileName, maxLength) => {
    if (fileName.length <= maxLength) return fileName;
    return fileName.substring(0, maxLength - 3) + '...';
  };

  return (
    <div className='p-4 border-[1px] border-[#fff3] rounded-xl '>
      <h2 className="md:text-left text-center md:text-[22px] xl:text-[40px] text-[25px] font-semibold">Document</h2>
      <div className='flex flex-row pt-3 md:items-center md:justify-start items-center justify-center flex-wrap'>
        {kycVideoPath && (
          <div className="flex flex-col justify-center items-center mx-2">
            <video src={kycVideoPath} controls className="mt-2 w-40 h-40 object-cover" />
            <h3 className="text-lg font-semibold">KYC Video</h3>
          </div>
        )}
        {selectedFiles.map((file, index) => (
          <div key={index} className="flex flex-col justify-center items-center mx-2">
            <img src={URL.createObjectURL(file)} alt="Preview" className="mt-2 w-40 h-40 object-cover" />
            <h3 className="text-lg font-semibold">{truncateFileName(file.name, 20)}</h3>
            <button onClick={() => handleDelete(index)} className="mt-2 flex items-center justify-center p-1 hover:bg-[#ffffff21] transition duration-300 rounded-[50px] hover:scale-125">
              <img src={deleteIcon} alt="Delete" className="w-4 h-4 " />
            </button>
          </div>
        ))}
        {/* <label htmlFor="file-upload" className='py-[50px] px-5 text-[#c9c9c9] rounded-xl flex flex-col items-center justify-center cursor-pointer'>
          <img src={document} alt="" className='w-[60%] justify-center items-center' />
          {uploading ? "Uploading..." : "Upload Documents"}
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            multiple
          />
        </label> */}
      </div>
    </div>
  );
};

export default DocumentSetting;
