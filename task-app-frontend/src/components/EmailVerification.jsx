import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const EmailVerification = () => {
  const { verificationEmail, resendVerificationEmail, clearVerificationState, isLoading, error } = useAuth();
  const [resendSuccess, setResendSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (resendSuccess) {
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setResendSuccess(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendSuccess]);

  const handleResendEmail = async () => {
    if (countdown > 0) return;
    const success = await resendVerificationEmail();
    if (success) {
      setResendSuccess(true);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(verificationEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "#1a1a1a" }}
    >
      <div className="bg-[#2d2d2d] p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-envelope text-yellow-500 text-3xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Verify Your Email</h2>
          <div className="flex items-center justify-center space-x-2 text-gray-400">
            <span>We sent a verification link to</span>
            <div className="relative group">
              <button
                onClick={copyToClipboard}
                className="text-white font-medium hover:text-[#caff17] transition-colors flex items-center"
              >
                {verificationEmail}
                <i className="fas fa-copy ml-2 text-sm"></i>
              </button>
              {copied && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs py-1 px-2 rounded">
                  Copied!
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-[#3d3d3d] p-4 rounded-lg mb-6 space-y-3">
          <h3 className="font-medium text-white mb-2">Next steps:</h3>
          <ol className="list-decimal list-inside text-sm text-gray-300 space-y-2">
            <li>Check your email inbox for the verification link</li>
            <li>Click the link to verify your email address</li>
            <li>Return to the app to complete your registration</li>
          </ol>
          <p className="text-sm text-yellow-400/80 flex items-center">
            <i className="fas fa-info-circle mr-2"></i>
            Can't find the email? Check your spam folder
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 text-red-400 p-4 rounded-lg mb-6 text-sm">
            <i className="fas fa-exclamation-circle mr-2"></i>
            {error}
          </div>
        )}

        <div className="space-y-4">
          {resendSuccess ? (
            <div className="bg-green-600/20 text-green-400 p-4 rounded-lg text-center">
              <i className="fas fa-check-circle mr-2"></i>
              Verification email has been resent!
              {countdown > 0 && (
                <div className="text-sm mt-2">
                  You can request another email in {countdown} seconds
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleResendEmail}
              disabled={isLoading || countdown > 0}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                isLoading || countdown > 0
                  ? "bg-gray-600 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              style={isLoading || countdown > 0 ? {} : { backgroundColor: "#caff17", color: "#0d0d0d" }}
              onMouseOver={(e) => {
                if (!(isLoading || countdown > 0)) {
                  e.currentTarget.style.backgroundColor = "#ffffff";
                  e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(202, 255, 23, 0.4), 0 2px 4px -1px rgba(202, 255, 23, 0.2)";
                }
              }}
              onMouseOut={(e) => {
                if (!(isLoading || countdown > 0)) {
                  e.currentTarget.style.backgroundColor = "#caff17";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-circle-notch fa-spin mr-2"></i>
                  Sending...
                </>
              ) : countdown > 0 ? (
                `Resend available in ${countdown}s`
              ) : (
                <>
                  <i className="fas fa-paper-plane mr-2"></i>
                  Resend Verification Email
                </>
              )}
            </button>
          )}

          <button
            onClick={clearVerificationState}
            className="w-full py-3 px-4 rounded-lg font-medium bg-transparent border border-gray-600 text-gray-300 hover:bg-[#3d3d3d] transition-colors flex items-center justify-center"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;