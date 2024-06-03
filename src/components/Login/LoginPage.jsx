// import React, { useState, useEffect } from "react";
// import { close, hidePassword, showPassword, signupBg } from "../../assets";
// import { useNavigate } from "react-router-dom";

// const LoginPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPasswordState, setShowPasswordState] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const [logoutTimeout, setLogoutTimeout] = useState(null);

//   const authenticateStackId = async (stackId) => {
//     try {
//       const response = await fetch(`https://copartners.in:5133/api/AffiliatePartner/${stackId}`, {
//         method: "GET",
//         headers: {
//           "Accept": "*/*",
//           "Content-Type": "application/json",
//         },
//       });

//       const data = await response.json();
//       console.log("StackId authentication response:", data);

//       if (response.ok && data.isSuccess) {
//         return data.data;
//       } else {
//         console.error("StackId server response:", data);
//         setError("StackId authentication failed. Please try again.");
//         return null;
//       }
//     } catch (error) {
//       console.error("StackId authentication error:", error);
//       setError("An error occurred during StackId authentication. Please try again.");
//       return null;
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     const payload = {
//       mobile: "",
//       email: email,
//       passwordHash: password,
//       isLoginUsingOtpRequest: false,
//       userIpAddress: "string",
//     };

//     try {
//       const response = await fetch("https://copartners.in:5130/Authentication/authenticate", {
//         method: "POST",
//         headers: {
//           "Accept": "*/*",
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();
//       const authId = data.data.stackholderId;
//       sessionStorage.setItem("authId", authId);

//       if (response.ok && data.isSuccess) {
//         const stackIdData = await authenticateStackId(authId);

//         if (stackIdData) {
//           localStorage.setItem("token", data.data.password);
//           localStorage.setItem("email", data.data.email);
//           localStorage.setItem("stackIdData", JSON.stringify(stackIdData));

//           if (password === "Copartner@1234#") {
//             navigate("/reset-password", { state: { email, password } });
//           } else {
//             navigate("/");
//           }

//           // Set timeout to logout after 24 hours
//           const timeout = setTimeout(() => {
//             handleLogout();
//           }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
//           setLogoutTimeout(timeout);
//         }
//       } else {
//         console.error("Server response:", data.data);
//         setError("Either email or password is wrong.");
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       setError("Either email or password is wrong. Please try again.");
//     }

//     setLoading(false);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("email");
//     localStorage.removeItem("stackIdData");
//     sessionStorage.removeItem("authId");
//     navigate("/login");
//   };

//   useEffect(() => {
//     return () => {
//       if (logoutTimeout) {
//         clearTimeout(logoutTimeout);
//       }
//     };
//   }, [logoutTimeout]);

//   const isFormEmpty = () => !email || !password;

//   const handleClose = () => {
//     navigate("/login");
//   };

//   const scrollToTop = () => {
//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   const toggleShowPassword = () => {
//     setShowPasswordState(!showPasswordState);
//   };

//   return (
//     <>
//       <div
//         className="h-screen"
//         style={{
//           backgroundImage: `url(${signupBg})`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           backgroundRepeat: "no-repeat",
//         }}
//       ></div>
//       <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-50 w-screen h-screen">
//         <div className="bg-gradient border-[1px] border-[#ffffff2a] m-4 p-6 rounded-lg w-96 relative text-center">
//           <div className="absolute top-3 right-0 text-right">
//             <button
//               onClick={() => {
//                 handleClose();
//                 scrollToTop();
//               }}
//               className="text-gray-400 w-8 text-[20px] cursor-pointer hover:text-white"
//             >
//               <img src={close} alt="close" />
//             </button>
//           </div>
//           <div className="mb-4">
//             <h2 className="text-2xl font-semibold text-white">Log In</h2>
//           </div>
//           <form className="flex flex-col gap-4 text-white" onSubmit={handleSubmit}>
//             <input
//               type="email"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="text-left px-4 py-3 border border-[#ffffff34] rounded-xl focus:outline-none focus:border-white-500 bg-transparent"
//             />
//             <div className="relative">
//               <input
//                 type={showPasswordState ? "text" : "password"}
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="text-left px-4 py-3 border border-[#ffffff34] rounded-xl focus:outline-none focus:border-white-500 bg-transparent w-full"
//               />
//               {password.length > 0 && (
//                 <button
//                   type="button"
//                   onClick={toggleShowPassword}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
//                 >
//                   <img src={showPasswordState ? hidePassword : showPassword} className="w-5" alt="Toggle Password Visibility" />
//                 </button>
//               )}
//             </div>
//             {error && <p className="text-red-500 mb-4">{error}</p>}

//             <button
//               type="submit"
//               className={`bg-white hover:bg-black hover:text-white text-black transition duration-300 font-semibold text-[20px] py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                 isFormEmpty() || loading ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//               disabled={isFormEmpty() || loading}
//             >
//               {loading ? "Logging in..." : "Log In"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default LoginPage;
