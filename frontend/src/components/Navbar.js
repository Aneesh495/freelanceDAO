import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "./UserContext";
import {
  Zap,
  Home,
  User,
  LogOut,
  Menu,
  X,
  Wallet,
  Settings,
  Bell,
} from "lucide-react";
import { cn } from "../utils/cn";

const Navbar = () => {
  const { account, setAccount } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const disconnectWallet = () => {
    setAccount(null);
    navigate("/");
  };

  const shortenAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="bg-white border-b border-secondary-200 shadow-soft sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-secondary-900">
                FreelanceDAO
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive(item.path)
                      ? "bg-primary-100 text-primary-700"
                      : "text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side - Wallet info and actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Wallet Address */}
            <div className="flex items-center space-x-2 px-3 py-2 bg-secondary-100 rounded-lg">
              <Wallet className="w-4 h-4 text-secondary-600" />
              <span className="text-sm font-mono text-secondary-700">
                {shortenAddress(account)}
              </span>
            </div>

            {/* Notifications */}
            <button className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
            </button>

            {/* Settings */}
            <button className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>

            {/* Disconnect Button */}
            <button onClick={disconnectWallet} className="btn-outline text-sm">
              <LogOut className="w-4 h-4 mr-2" />
              Disconnect
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-secondary-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium transition-colors",
                    isActive(item.path)
                      ? "bg-primary-100 text-primary-700"
                      : "text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Mobile Wallet Info */}
            <div className="px-3 py-3 border-t border-secondary-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Wallet className="w-4 h-4 text-secondary-600" />
                  <span className="text-sm font-mono text-secondary-700">
                    {shortenAddress(account)}
                  </span>
                </div>
                <button
                  onClick={() => {
                    disconnectWallet();
                    setIsMobileMenuOpen(false);
                  }}
                  className="btn-outline text-sm"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
