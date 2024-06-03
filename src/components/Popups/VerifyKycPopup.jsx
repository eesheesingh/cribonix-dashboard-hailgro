import React, { useState, useEffect } from 'react';
import { close } from '../../assets';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TermsPopup = ({ onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-[#2E374B] p-7 rounded-lg shadow-lg relative w-full max-w-md md:max-w-lg lg:max-w-xl md:max-h-[80vh] max-h-[90vh] flex flex-col overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-white subheading-color">Terms and Conditions</h2>
        <button onClick={onClose}>
          <img src={close} alt="Close" className="w-10 h-10" />
        </button>
      </div>
      <div className="flex-grow overflow-y-auto">
        <ol className="text-[#fff] mb-6 space-y-2 text-left">
          <li><strong className='pt-3 md:text-[1.5rem]'>Terms & Conditions for Affiliate Partner Onboarding</strong></li>
          <li>Welcome to the CoPartner Affiliate Program. By registering as an Affiliate Partner and accessing our platform, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.</li>
          <li><strong className='pt-3 md:text-[1.5rem]'>1. Definitions</strong>
            <ol className="pl-2 flex flex-col gap-3">
              <li>1.1 Affiliate Partner: An individual or entity registered to promote the CoPartner platform and earn commissions based on referrals.</li>
              <li>1.2 Affiliate Link: A unique URL provided to the Affiliate Partner for tracking referrals.</li>
              <li>1.3 User: An individual who registers on the CoPartner platform through an Affiliate Link, organically, or via a Research Analyst (RA)’s link.</li>
              <li>1.4 Research Analyst (RA): A SEBI-registered analyst who offers advisory services on the CoPartner platform.</li>
              <li>1.5 Commission: The mutually agreed amount payable to the Affiliate Partner for successful referrals.</li>
            </ol>
          </li>
          <li><strong className='pt-3 md:text-[1.5rem]'>2. Affiliate Partner Obligations</strong>
          <ol className="pl-2 flex flex-col gap-3">
              <li>2.1 Promotion: As an Affiliate Partner, you agree to promote the CoPartner platform using your Affiliate Link through various marketing channels such as social media, email marketing, and websites. All promotional activities must comply with SEBI guidelines and applicable laws.</li>
              <li>2.2 Content Compliance: You must ensure that all marketing content used to promote the platform is compliant with SEBI guidelines. A disclaimer stating that any non-compliance is your responsibility must be included.</li>
              <li>2.3 Prohibited Activities: You must not engage in activities that could harm the reputation of the Company or the Platform. This includes, but is not limited to, false advertising, spamming, and the use of unethical marketing practices.</li>
            </ol>
          </li>
          <li><strong className='pt-3 md:text-[1.5rem]'>3. Tracking and Payment</strong>
          <ol className="pl-2 flex flex-col gap-3">
              <li>3.1 Tracking: The Company will use its backend system to track all registrations and payments made through Affiliate Links.</li>
              <li>3.2 Payment: Commissions will be calculated and paid out as per the mutually agreed payment schedule.</li>
            </ol>
          </li>
          <li><strong className='pt-3 md:text-[1.5rem]'>4. Use of Personal Data</strong>
          <ol className="pl-2 flex flex-col gap-3">
              <li>4.2 Data Collection: The Company will collect personal data from Users as described in our Privacy Policy.</li>
              <li>4.2 Data Usage: The data collected will be used to improve services, contact Users, respond to queries, and for security purposes.</li>
              <li>4.3 Data Sharing: The Company may share personal data with third parties who perform services on our behalf, including vendors, SMS service providers, and payment processing gateways.</li>
              <li>4.4 Data Security: The Company maintains strict physical, electronic, and administrative safeguards to protect personal data. However, the Company cannot guarantee absolute security, and Users accept this risk by using the Platform.</li>
            </ol>
          </li>
          <li><strong className='pt-3 md:text-[1.5rem]'>5.Confidentiality</strong>
          <ol className="pl-2 flex flex-col gap-3">
              <li>5.1 Confidential Information: As an Affiliate Partner, you agree to keep all confidential information disclosed by the Company, including business strategies, user data, and technical specifications, confidential and not to disclose it to any third party without prior written consent.</li>
            </ol>
          </li>
          <li><strong className='pt-3 md:text-[1.5rem]'>6. Term and Termination</strong>
          <ol className="pl-2 flex flex-col gap-3">
              <li>6.1 Term: This agreement shall commence upon your acceptance of these terms and continue until terminated by either party.</li>
              <li>6.2 Termination for Cause: Either party may terminate this agreement immediately upon written notice if the other party breaches any material term or condition of this agreement and fails to cure such breach within thirty (30) days of receipt of notice of such breach.</li>
              <li>6.3 Effect of Termination: Upon termination, you must cease all promotional activities and remove any links to the Platform.</li>
            </ol>
          </li>
          <li><strong className='pt-3 md:text-[1.5rem]'>7. Dispute Resolution</strong>
          <ol className="pl-2 flex flex-col gap-3">
              <li>7.1 Governing Law: These terms shall be governed by and construed in accordance with the laws of India.</li>
              <li>7.2 Jurisdiction: Any disputes arising under these terms shall be resolved exclusively in the courts of Haryana, India.</li>
            </ol>
          </li>
          <li><strong className='pt-3 md:text-[1.5rem]'>8. Miscellaneous</strong>
          <ol className="pl-2 flex flex-col gap-3">
              <li>8.1 Entire Agreement: These terms constitute the entire agreement between you and the Company regarding your participation in the Affiliate Program and supersede all prior agreements and understandings.</li>
              <li>8.2 Amendments: No amendment or modification of these terms shall be valid unless made in writing and signed by both parties.</li>
              <li>8.3 Waiver: No waiver of any term or condition of these terms shall be deemed a waiver of any subsequent breach of the same or any other term or condition.</li>
              <li>8.4 Assignment: You may not assign or transfer any of your rights or obligations under these terms without the prior written consent of the Company.</li>
              <li>8.5 Notices: All notices under these terms shall be in writing and deemed to have been duly given when received, if personally delivered; when receipt is electronically confirmed, if transmitted by email; or upon receipt, if sent by certified or registered mail, return receipt requested.</li>
            </ol>
          </li>
          <li><strong className='pt-3 md:text-[1.5rem]'>7. Severability</strong>
          <ol className="pl-2 flex flex-col gap-3">
              <li>7.1 If any provision of these terms is found to be invalid or unenforceable by a court of competent jurisdiction, such provision shall be severed, and the remaining provisions shall remain in full force and effect.</li>
            </ol>
          </li>
          <li><strong className='pt-3 md:text-[1.5rem]'>8. Grievance Officer</strong>
          <ol className="pl-2 flex flex-col gap-3">
              <li>8.1 In accordance with the Information Technology Act 2000 and rules made thereunder, the name and contact
                <br />Name: Saksham Agrawal (Director)
                <br />Email: saksham@copartner.in
                <br />Address: #546, JMD Megapolis, Sohna Road, Sector 48, Gurugram
              </li>
            </ol>
          </li>
          <li><strong className='pt-3 md:text-[1.5rem]'>9. Acceptance</strong>
          <ol className="pl-2 flex flex-col gap-3">
              <li>9.1 By registering as an Affiliate Partner and clicking "Accept" during the onboarding process, you acknowledge that you have read, understood, and agree to be bound by these terms and conditions.</li>
            </ol>
          </li>
          <li><strong className='pt-3 md:text-[1.5rem]'>10. Responsibilities</strong>
          <ol className="pl-2 flex flex-col gap-3">
              <li>10.1 Marketing: You are responsible for ensuring that all marketing activities are conducted ethically and in compliance with applicable laws and regulations.</li>
              <li>10.2 Support: You will provide accurate and up-to-date information to potential Users about the CoPartner platform and its services.</li>
              <li>10.3 Communication: You must maintain clear and transparent communication with Users and promptly address any questions or concerns they may have.</li>
            </ol>
          </li>
          <li><strong className='pt-3 md:text-[1.5rem]'>11. Intellectual Property</strong>
          <ol className="pl-2 flex flex-col gap-3">
              <li>11.1 License: The Company grants you a non-exclusive, non-transferable, revocable license to use the Company's trademarks, logos, and other intellectual property solely for the purpose of promoting the CoPartner platform.</li>
              <li>11.2 Restrictions: You must not modify, adapt, translate, reverse engineer, decompile, disassemble, or create derivative works based on the Company's intellectual property.</li>
            </ol>
          </li>
          <li><strong className='pt-3 md:text-[1.5rem]'>12. Liability</strong>
          <ol className="pl-2 flex flex-col gap-3">
13.               <li>12.1 Limitation of Liability: To the maximum extent permitted by law, the Company shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from (a) your use or inability to use the platform; (b) any unauthorized access to or use of our servers and/or any personal information stored therein; (c) any interruption or cessation of transmission to or from the platform; (d) any bugs, viruses, trojan horses, or the like that may be transmitted to or through the platform by any third party; (e) any errors or omissions in any content; (f) your promotional activities; or (g) any other matters relating to this agreement or the platform.</li>
              <li>12.2 Indemnification: You agree to indemnify, defend, and hold harmless the Company, its affiliates, and their respective officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including without limitation reasonable legal and accounting fees, arising out of or in any way connected with your access to or use of the platform, your breach of these terms, or your promotional activities.</li>
            </ol>
          </li>
          <li><strong className='pt-3 md:text-[1.5rem]'>13. Governing Law</strong>
          <ol className="pl-2 flex flex-col gap-3">
              <li>13.1 These terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law principles. Any disputes arising under these terms shall be resolved exclusively in the courts of Haryana, India.</li>
            </ol>
          </li>
          <li><strong className='pt-3 md:text-[1.5rem]'>14. Miscellaneous</strong>
          <ol className="pl-2 flex flex-col gap-3">
              <li>14.1 Headings: The headings in these terms are for convenience only and have no legal or contractual effect.</li>
              <li>14.2 Force Majeure: Neither party shall be liable for any delay or failure to perform any obligation under these terms due to events beyond their reasonable control, including but not limited to acts of God, war, terrorism, strikes, and governmental orders.</li>
              <li>14.3 Survival: The provisions of these terms which by their nature should survive termination or expiration shall survive, including but not limited to confidentiality, intellectual property, indemnification, and limitation of liability.</li>
              <li>14.4 Relationship: Nothing in these terms shall be construed as creating a partnership, joint venture, or employment relationship between you and the Company. You shall act solely as an independent contractor.</li>
            </ol>
          </li>
          <li><strong>By clicking "Accept," you confirm that you have read, understood, and agree to be bound by these terms and conditions. If you do not agree with these terms, please do not proceed with the registration.</strong></li>
        </ol>
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={onClose}
          className="bg-[#000] text-white px-4 py-2 rounded-md hover:bg-[#fff] hover:text-[#000] transition duration-300"
        >
          Accept
        </button>
      </div>
    </div>
  </div>
);

const VerifyKycPopup = ({ onClose, onVideoUpload }) => {
  const [userData, setUserData] = useState({});
  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const [videoURL, setVideoURL] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [isTermsPopupOpen, setIsTermsPopupOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const storedStackIdData = localStorage.getItem('stackIdData'); // Get the user data from local storage
      if (!storedStackIdData) {
        alert('User data not found in local storage.');
        return;
      }

      const data = JSON.parse(storedStackIdData);
      const userId = data.id;

      try {
        const response = await fetch(`https://copartners.in:5133/api/AffiliatePartner?Id=${userId}`);
        if (response.ok) {
          const result = await response.json();
          setUserData(result.data[0]);
        } else {
          alert('Failed to fetch user data.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  const handleCheckboxChange1 = () => setIsChecked1(!isChecked1);
  const handleCheckboxChange2 = () => setIsChecked2(!isChecked2);

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoURL(url);
      setVideoFile(file);

      const videoElement = document.createElement('video');
      videoElement.src = url;
      videoElement.onloadedmetadata = () => {
        if (videoElement.duration <= 120) {
          onVideoUpload(true);
        } else {
          alert('Video must be less than 2 minutes.');
          onVideoUpload(false);
          setVideoURL(null);
          setVideoFile(null);
        }
      };
    }
  };

  const handleSubmit = async () => {
    if (videoFile && isChecked1 && isChecked2) {
      if (videoFile.size > 10485760) { // Example: 10MB limit
        alert('File size exceeds the maximum limit of 10MB.');
        return;
      }

      setIsSubmitting(true);

      try {
        const formData = new FormData();
        formData.append("file", videoFile, videoFile.name);

        const uploadResponse = await fetch(
          `https://copartners.in:5134/api/AWSStorage?prefix=${videoFile.name}`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload file");
        }

        const uploadData = await uploadResponse.json();
        const presignedURL = uploadData.data.presignedUrl;
        console.log("File uploaded successfully. Presigned URL:", presignedURL);

        const patchData = [
          {
            path: 'kycVideoPath',
            op: 'replace',
            value: presignedURL,
          },
          {
            path: 'isKyc',
            op: 'replace',
            value: true,
          }
        ];

        const storedStackIdData = localStorage.getItem('stackIdData'); // Get the user data from local storage
        const data = JSON.parse(storedStackIdData);
        const userId = data.id;

        const response = await fetch(`https://copartners.in:5133/api/AffiliatePartner?Id=${userId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json-patch+json', // Make sure the Content-Type is correct
          },
          body: JSON.stringify(patchData),
        });

        if (response.ok) {
          const responseData = await response.json();
          console.log("Server response:", responseData);
          toast.success('Your KYC has been submitted.');
          onClose();
        } else {
          const errorText = await response.text();
          console.error('Failed to update KYC status. Server response:', errorText);
          alert('Failed to update KYC status.');
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        alert('Failed to upload video.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      alert('Please upload a video and check all the declarations.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#2E374B] md:p-8 p-2 rounded-[20px] shadow-lg relative md:w-[716px] w-[350px] max-h-screen overflow-y-auto">
        <div className="absolute top-2 right-2">
          <button onClick={onClose}>
            <img src={close} alt="Close" className="w-10 h-10" />
          </button>
        </div>
        <div className="pb-4 text-left">
          <h2 className="text-[24px] font-semibold">Pan Card Verification</h2>
          <p className="text-[#c9c9c9] mt-2">
            Full access to in any of our products Full access to in any of{' '}
          </p>
        </div>
        <div className="max-w-[643px] min-h-[303px] h-[303px] border border-[#ffffff3c] rounded-xl relative flex items-center justify-center overflow-hidden">
          {videoURL ? (
            <video
              src={videoURL}
              controls
              autoPlay
              className="w-full h-full rounded-xl object-contain"
            />
          ) : (
            <span className="text-[#c9c9c9]">No video uploaded</span>
          )}
        </div>

        <div className="flex justify-center items-center pt-4">
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            className="hidden"
            id="uploadInput"
          />
          <label
            htmlFor="uploadInput"
            className="bg-[#000] text-white hover:text-[#000] px-4 py-2 rounded-md hover:bg-[#fff] transition duration-300 cursor-pointer"
          >
            Upload Video
          </label>
        </div>

        {/* Checklists */}
        <div className="flex flex-col space-y-2 mt-4">
          <label className="flex items-start text-left">
            <input
              type="checkbox"
              checked={isChecked1}
              onChange={handleCheckboxChange1}
              className="mr-2 mt-2"
            />
            I/ We hereby declare, represent and undertake -&gt; The information and the documents
            submitted by me are true, correct and accurate. I am/ we are the rightful owner and/or
            in genuine possession of the said documents/ information.
          </label>
          <label className="flex items-start text-left">
            <input
              type="checkbox"
              checked={isChecked2}
              onChange={handleCheckboxChange2}
              className="mr-2 mt-2"
            />
            I <span className='md:flex hidden pl-1 pr-1'>/ We</span> hereby <span className='md:flex hidden pl-1'>declare</span>, accept the
            <span 
              onClick={() => setIsTermsPopupOpen(true)} 
              className="text-blue-500 underline pl-1 cursor-pointer"
            >
              Terms & Conditions
            </span>.
          </label>
        </div>

        <div className="flex justify-center items-center pt-3">
          <button
            className={`bg-[#000] text-white px-4 py-4 rounded-md hover:bg-[#fff] hover:text-[#000] transition duration-300 ${isSubmitting ? "cursor-not-allowed" : ""}`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "I Agree"}
          </button>
        </div>
      </div>
      {isTermsPopupOpen && <TermsPopup onClose={() => setIsTermsPopupOpen(false)} />}
      <ToastContainer />
    </div>
  );
};

export default VerifyKycPopup;
