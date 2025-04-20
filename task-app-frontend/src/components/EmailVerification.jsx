import React, { useState } from "react";
import { useAuth } from "./AuthContext";

const EmailVerification = () => {
  const { verificationEmail, resendVerificationEmail, clearVerificationState, isLoading } = useAuth();
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleResendEmail = async () => {
    const success = await resendVerificationEmail();
    if (success) {
      setResendSuccess(true);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#1a1a1a" }}
    >
      <div className="bg-[#2d2d2d] p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-envelope text-yellow-500 text-3xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Verify Your Email</h2>
          <p className="text-gray-400">
            We sent a verification link to <span className="text-white font-medium">{verificationEmail}</span>
          </p>
        </div>

        <div className="bg-[#3d3d3d] p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-300">
            Please check your inbox and click the verification link to complete your registration. 
            If you don't see the email, check your spam folder.
          </p>
        </div>

        <div className="space-y-4">
          {resendSuccess ? (
            <div className="bg-green-600/20 text-green-400 p-3 rounded-lg text-center">
              Verification email has been resent!
            </div>
          ) : (
            <button
              onClick={handleResendEmail}
              disabled={isLoading}
              className="w-full py-2 px-4 rounded-lg font-medium transition-colors hover:bg-[#deff72]"
              style={{ backgroundColor: "#caff17", color: "#0d0d0d" }}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-circle-notch fa-spin mr-2"></i>
                  Sending...
                </>
              ) : (
                "Resend Verification Email"
              )}
            </button>
          )}

          <button
            onClick={clearVerificationState}
            className="w-full py-2 px-4 rounded-lg font-medium bg-transparent border border-gray-600 text-gray-300 hover:bg-[#3d3d3d] transition-colors"
          >
            Go back to login
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;