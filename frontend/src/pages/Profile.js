import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../components/UserContext";
import { ethers } from "ethers";
import freelanceDAOAbi from "../contractABI_FreelanceDAO.json";
import { freelanceDAOAddress } from "../contractAddresses";
import {
  User,
  Edit3,
  Save,
  X,
  Camera,
  Shield,
  Star,
  Briefcase,
  DollarSign,
  Calendar,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { cn } from "../utils/cn";

const Profile = () => {
  const { account } = useContext(UserContext);
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    avatar: "",
  });
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    completedProjects: 0,
    totalEarnings: 0,
    reputation: 0,
  });

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, [account]);

  const fetchProfile = async () => {
    if (!window.ethereum || !account) return;

    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const freelanceDAO = new ethers.Contract(
        freelanceDAOAddress,
        freelanceDAOAbi,
        signer
      );
      const userProfile = await freelanceDAO.getProfile(account);
      setProfile({
        name: userProfile.name || "",
        bio: userProfile.bio || "",
        avatar: userProfile.avatar || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      setMessage({ type: "error", text: "Error loading profile" });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!window.ethereum || !account) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const freelanceDAO = new ethers.Contract(
        freelanceDAOAddress,
        freelanceDAOAbi,
        signer
      );

      const projectCount = await freelanceDAO.nextProjectId();
      let completedCount = 0;
      let totalEarnings = 0;

      for (let i = 0; i < projectCount; i++) {
        const project = await freelanceDAO.projects(i);
        if (project.freelancer === account) {
          if (project.isCompleted) {
            completedCount++;
            totalEarnings += Number(ethers.formatEther(project.amount));
          }
        }
      }

      setStats({
        totalProjects: Number(projectCount),
        completedProjects: completedCount,
        totalEarnings: totalEarnings,
        reputation: completedCount * 10, // Simple reputation calculation
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!window.ethereum) {
      setMessage({ type: "error", text: "MetaMask is not installed." });
      return;
    }

    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const freelanceDAO = new ethers.Contract(
        freelanceDAOAddress,
        freelanceDAOAbi,
        signer
      );

      const tx = await freelanceDAO.createOrUpdateProfile(
        profile.name,
        profile.bio,
        profile.avatar
      );
      await tx.wait();

      setMessage({ type: "success", text: "Profile updated successfully!" });
      setEditing(false);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: "Error updating profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearMessage = () => {
    setMessage({ type: "", text: "" });
  };

  const shortenAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            Profile
          </h1>
          <p className="text-secondary-600">
            Manage your account information and view your statistics
          </p>
        </div>

        {/* Message */}
        {message.text && (
          <div
            className={cn(
              "mb-6 p-4 rounded-lg flex items-center justify-between",
              message.type === "error"
                ? "bg-error-50 border border-error-200"
                : "bg-success-50 border border-success-200"
            )}
          >
            <div className="flex items-center">
              {message.type === "error" ? (
                <AlertCircle className="w-5 h-5 text-error-600 mr-3" />
              ) : (
                <CheckCircle className="w-5 h-5 text-success-600 mr-3" />
              )}
              <p
                className={cn(
                  "font-medium",
                  message.type === "error"
                    ? "text-error-700"
                    : "text-success-700"
                )}
              >
                {message.text}
              </p>
            </div>
            <button
              onClick={clearMessage}
              className="text-secondary-400 hover:text-secondary-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <h2 className="card-title">Profile Information</h2>
                  {!editing && (
                    <button
                      onClick={() => setEditing(true)}
                      className="btn-outline"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </button>
                  )}
                </div>
                <p className="card-description">
                  Update your personal information and bio
                </p>
              </div>

              <div className="card-content">
                {editing ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    {/* Avatar */}
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Profile Picture
                      </label>
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center">
                          {profile.avatar ? (
                            <img
                              src={profile.avatar}
                              alt="Avatar"
                              className="w-20 h-20 rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-8 h-8 text-secondary-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            name="avatar"
                            value={profile.avatar}
                            onChange={handleInputChange}
                            placeholder="Enter image URL"
                            className="input"
                          />
                          <p className="text-xs text-secondary-500 mt-1">
                            Provide a URL to your profile picture
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-secondary-700 mb-2"
                      >
                        Display Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={profile.name}
                        onChange={handleInputChange}
                        placeholder="Enter your display name"
                        className="input"
                        required
                      />
                    </div>

                    {/* Bio */}
                    <div>
                      <label
                        htmlFor="bio"
                        className="block text-sm font-medium text-secondary-700 mb-2"
                      >
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={profile.bio}
                        onChange={handleInputChange}
                        placeholder="Tell us about yourself, your skills, and experience..."
                        rows={4}
                        className="textarea"
                        required
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className={cn(
                          "btn-primary",
                          loading && "opacity-75 cursor-not-allowed"
                        )}
                      >
                        {loading ? (
                          <>
                            <div className="loading-spinner mr-3"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditing(false)}
                        className="btn-outline"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    {/* Avatar Display */}
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center">
                        {profile.avatar ? (
                          <img
                            src={profile.avatar}
                            alt="Avatar"
                            className="w-20 h-20 rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-8 h-8 text-secondary-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-secondary-900">
                          {profile.name || "No name set"}
                        </h3>
                        <p className="text-secondary-600">
                          {shortenAddress(account)}
                        </p>
                      </div>
                    </div>

                    {/* Bio Display */}
                    <div>
                      <h4 className="text-sm font-medium text-secondary-700 mb-2">
                        Bio
                      </h4>
                      <p className="text-secondary-900">
                        {profile.bio || "No bio provided"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Wallet Info */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Wallet Information</h3>
              </div>
              <div className="card-content">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-600">Address</span>
                    <span className="text-sm font-mono text-secondary-900">
                      {shortenAddress(account)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-600">Network</span>
                    <span className="text-sm text-secondary-900">Ethereum</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Statistics</h3>
              </div>
              <div className="card-content">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                    <div className="flex items-center">
                      <Briefcase className="w-5 h-5 text-primary-600 mr-3" />
                      <span className="text-sm text-secondary-600">
                        Total Projects
                      </span>
                    </div>
                    <span className="font-semibold text-secondary-900">
                      {stats.totalProjects}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-success-600 mr-3" />
                      <span className="text-sm text-secondary-600">
                        Completed
                      </span>
                    </div>
                    <span className="font-semibold text-secondary-900">
                      {stats.completedProjects}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                    <div className="flex items-center">
                      <DollarSign className="w-5 h-5 text-success-600 mr-3" />
                      <span className="text-sm text-secondary-600">
                        Total Earnings
                      </span>
                    </div>
                    <span className="font-semibold text-secondary-900">
                      {stats.totalEarnings.toFixed(2)} ETH
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-warning-600 mr-3" />
                      <span className="text-sm text-secondary-600">
                        Reputation
                      </span>
                    </div>
                    <span className="font-semibold text-secondary-900">
                      {stats.reputation}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Quick Actions</h3>
              </div>
              <div className="card-content">
                <div className="space-y-3">
                  <button className="w-full btn-outline text-left">
                    <Shield className="w-4 h-4 mr-2" />
                    Security Settings
                  </button>
                  <button className="w-full btn-outline text-left">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Export Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
