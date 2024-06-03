import React, { useState, useEffect } from "react";
import { close, hidePassword, showPassword, signupBg } from "../../assets";
import { useNavigate, useLocation } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { email, password: oldPassword } = location.state || {};

  useEffect(() => {
    if (!email || !oldPassword) {
      navigate("/login"); // Redirect to login if email or oldPassword is not present
    }
  }, [email, oldPassword, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      // Check if email is present in the database
      const emailCheckResponse = await fetch("https://copartners.in:5130/api/Users?userType=AP&page=1&pageSize=10", {
        method: "GET",
        headers: {
          "Accept": "*/*",
          "Content-Type": "application/json",
        },
      });

      const emailCheckData = await emailCheckResponse.json();

      if (emailCheckResponse.ok && emailCheckData.isSuccess) {
        const user = emailCheckData.data.find((user) => user.email === email);
        console.log("", user.email);

        if (user) {
          const userId = user.userId;

          // Verify old password
          const verifyOldPasswordResponse = await fetch("https://copartners.in:5130/Authentication/authenticate", {
            method: "POST",
            headers: {
              "Accept": "*/*",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, passwordHash: oldPassword, isLoginUsingOtpRequest: false, userIpAddress: "string" }),
          });

          const verifyOldPasswordData = await verifyOldPasswordResponse.json();

          if (verifyOldPasswordResponse.ok && verifyOldPasswordData.isSuccess) {
            // Reset the password
            const resetPasswordResponse = await fetch("https://copartners.in:5130/api/Users/ResetPassword", {
              method: "POST",
              headers: {
                "Accept": "*/*",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ id: userId, oldPassword, newPassword, lastPasswordUpdateDate: new Date().toISOString() }),
            });

            const resetPasswordData = await resetPasswordResponse.json();

            if (resetPasswordResponse.ok && resetPasswordData.isSuccess) {
              // Update the user data to clear the first-time login flag
              await fetch(`https://copartners.in:5130/api/Users/${userId}/ClearFirstTimeLoginFlag`, {
                method: "POST",
                headers: {
                  "Accept": "*/*",
                  "Content-Type": "application/json",
                },
              });

              navigate("/login");
            } else {
              setError("Failed to reset password. Please try again.");
            }
          } else {
            setError("Old password is incorrect.");
          }
        } else {
          setError("Email not found.");
        }
      } else {
        setError("Failed to check email. Please try again.");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setError("An error occurred during password reset. Please try again.");
    }

    setLoading(false);
  };

  const isFormEmpty = () => !newPassword || !confirmPassword;

  const handleClose = () => {
    navigate("/login"); // Navigate to the login page
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const toggleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
      <div
        className="h-screen"
        style={{
          backgroundImage: `url(${signupBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-50 w-screen h-screen">
        <div className="bg-gradient border-[1px] border-[#ffffff2a] m-4 p-6 rounded-lg w-96 relative text-center">
          <div className="absolute top-3 right-0 text-right">
            <button
              onClick={() => {
                handleClose();
                scrollToTop();
              }}
              className="text-gray-400 w-8 text-[20px] cursor-pointer hover:text-white"
            >
              <img src={close} alt="close" />
            </button>
          </div>
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-white">Reset Password</h2>
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form className="flex flex-col gap-4 text-white" onSubmit={handleSubmit}>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="text-left px-4 py-3 border border-[#ffffff34] rounded-xl focus:outline-none focus:border-white-500 bg-transparent w-full"
              />
              {newPassword.length > 0 && (
                <button
                  type="button"
                  onClick={toggleShowNewPassword}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
                >
                  <img src={showNewPassword ? hidePassword : showPassword} className="w-5" alt="Toggle Password Visibility" />
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="text-left px-4 py-3 border border-[#ffffff34] rounded-xl focus:outline-none focus:border-white-500 bg-transparent w-full"
              />
              {confirmPassword.length > 0 && (
                <button
                  type="button"
                  onClick={toggleShowConfirmPassword}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
                >
                  <img src={showConfirmPassword ? hidePassword : showPassword} className="w-5" alt="Toggle Password Visibility" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className={`bg-white hover:bg-black hover:text-white text-black transition duration-300 font-semibold text-[20px] py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isFormEmpty() || loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isFormEmpty() || loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
