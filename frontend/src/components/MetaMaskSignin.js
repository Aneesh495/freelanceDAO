import React, { useState, useContext } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import {
  Wallet,
  Shield,
  Zap,
  ArrowRight,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { cn } from "../utils/cn";

const MetaMaskSignin = () => {
  const [error, setError] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { setAccount } = useContext(UserContext);
  const navigate = useNavigate();

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      if (window.ethereum) {
        // Request account access from MetaMask
        await window.ethereum.request({ method: "eth_requestAccounts" });

        // Create a new provider
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        // Get the connected account
        const userAccount = await signer.getAddress();
        setAccount(userAccount);
        setIsSuccess(true);

        // Redirect to Dashboard after a brief success animation
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        setError(
          "MetaMask is not installed. Please install it to use this feature."
        );
      }
    } catch (error) {
      console.error(error);
      setError("Error connecting to MetaMask. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4 shadow-large">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            FreelanceDAO
          </h1>
          <p className="text-secondary-600">
            Decentralized freelance marketplace powered by blockchain
          </p>
        </div>

        {/* Main Card */}
        <div className="card hover-glow">
          <div className="card-header text-center">
            <div className="mx-auto w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <Wallet className="w-6 h-6 text-primary-600" />
            </div>
            <h2 className="card-title">Connect Your Wallet</h2>
            <p className="card-description">
              Connect your MetaMask wallet to access the decentralized freelance
              marketplace
            </p>
          </div>

          <div className="card-content">
            {/* Success State */}
            {isSuccess && (
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-success-600" />
                </div>
                <h3 className="text-lg font-semibold text-success-800 mb-2">
                  Wallet Connected Successfully!
                </h3>
                <p className="text-success-600">Redirecting to dashboard...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-error-600 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-sm text-error-700">{error}</p>
                </div>
              </div>
            )}

            {/* Connect Button */}
            {!isSuccess && (
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className={cn(
                  "w-full btn-primary h-12 text-base font-semibold",
                  isConnecting && "opacity-75 cursor-not-allowed"
                )}
              >
                {isConnecting ? (
                  <>
                    <div className="loading-spinner mr-3"></div>
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="w-5 h-5 mr-3" />
                    Connect MetaMask
                    <ArrowRight className="w-5 h-5 ml-3" />
                  </>
                )}
              </button>
            )}

            {/* Features List */}
            {!isSuccess && (
              <div className="mt-8 space-y-4">
                <h3 className="text-sm font-semibold text-secondary-700 mb-3">
                  What you can do:
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center mr-3">
                      <CheckCircle className="w-4 h-4 text-success-600" />
                    </div>
                    <span className="text-sm text-secondary-700">
                      Create and manage freelance projects
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                      <Shield className="w-4 h-4 text-primary-600" />
                    </div>
                    <span className="text-sm text-secondary-700">
                      Secure escrow payments
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-warning-100 rounded-full flex items-center justify-center mr-3">
                      <Zap className="w-4 h-4 text-warning-600" />
                    </div>
                    <span className="text-sm text-secondary-700">
                      Decentralized dispute resolution
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-secondary-500">
            By connecting your wallet, you agree to our{" "}
            <a
              href="#"
              className="text-primary-600 hover:text-primary-700 underline"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-primary-600 hover:text-primary-700 underline"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MetaMaskSignin;
