import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "./AuthContext";

const EmailConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { confirmEmail } = useAuth();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setError("No verification token found");
      return;
    }

    const verifyEmail = async () => {
      try {
        await confirmEmail(token);
        setStatus("success");
        // Start countdown for auto-redirect
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              navigate("/login");
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        return () => clearInterval(timer);
      } catch (err) {
        setStatus("error");
        setError(err.message || "Failed to verify email");
      }
    };

    verifyEmail();
  }, [searchParams, confirmEmail, navigate]);

  const getContent = () => {
    switch (status) {
      case "verifying":
        return {
          icon: "circle-notch fa-spin",
          title: "Verifying your email...",
          message: "Please wait while we confirm your email address",
          color: "text-yellow-400",
          bgColor: "bg-yellow-400/20",
        };
      case "success":
        return {
          icon: "check-circle",
          title: "Email verified successfully!",
          message: `You'll be redirected to login in ${countdown} seconds`,
          color: "text-green-400",
          bgColor: "bg-green-600/20",
        };
      case "error":
        return {
          icon: "exclamation-circle",
          title: "Verification failed",
          message: error,
          color: "text-red-400",
          bgColor: "bg-red-500/20",
        };
      default:
        return {};
    }
  };

  const content = getContent();

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "#1a1a1a" }}
    >
      <div className="bg-[#2d2d2d] p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${content.bgColor}`}>
          <i className={`fas fa-${content.icon} ${content.color} text-3xl`}></i>
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">{content.title}</h2>
        <p className="text-gray-400 mb-6">{content.message}</p>

        {status === "error" && (
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 px-4 rounded-lg font-medium bg-[#caff17] hover:bg-[#deff72] transition-colors"
            style={{ color: "#0d0d0d" }}
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Return to Login
          </button>
        )}
      </div>
    </div>
  );
};

export default EmailConfirmation; 