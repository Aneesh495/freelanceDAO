import React, { useState } from "react";
import { ethers } from "ethers";
import {
  Plus,
  FileText,
  DollarSign,
  Calendar,
  Upload,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import { cn } from "../utils/cn";

const CreateProject = ({ contract, account }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    amount: "",
    deadline: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();

    if (!contract) {
      setMessage({ type: "error", text: "Smart contract not loaded." });
      return;
    }

    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.amount
    ) {
      setMessage({
        type: "error",
        text: "Please fill in all required fields.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage({ type: "", text: "" });

      // Convert amount from ETH to Wei
      const amountInWei = ethers.parseEther(formData.amount);

      // Call the createProject function
      const tx = await contract.createProject(
        formData.name,
        formData.description,
        amountInWei
      );

      await tx.wait();

      setShowSuccess(true);
      setMessage({ type: "success", text: "Project created successfully!" });

      // Reset form
      setFormData({
        name: "",
        description: "",
        amount: "",
        deadline: "",
      });

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
        setMessage({ type: "", text: "" });
      }, 3000);
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: "Error creating project. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearMessage = () => {
    setMessage({ type: "", text: "" });
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <Plus className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-secondary-900">
              Create New Project
            </h2>
            <p className="text-secondary-600">
              List your freelance services and start earning
            </p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 p-4 bg-success-50 border border-success-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-success-600 mr-3" />
            <p className="text-success-700 font-medium">
              Project created successfully! Your project is now live in the
              marketplace.
            </p>
          </div>
        </div>
      )}

      {/* Error/Success Message */}
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
                message.type === "error" ? "text-error-700" : "text-success-700"
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

      {/* Form Card */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Project Details</h3>
          <p className="card-description">
            Provide comprehensive information about your freelance service
          </p>
        </div>

        <div className="card-content">
          <form onSubmit={handleCreateProject} className="space-y-6">
            {/* Project Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-secondary-700 mb-2"
              >
                Project Name *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Web Development, Logo Design, Content Writing"
                  className="input pl-10"
                  required
                />
              </div>
            </div>

            {/* Project Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-secondary-700 mb-2"
              >
                Project Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your service, skills, experience, and what clients can expect..."
                rows={6}
                className="textarea"
                required
              />
            </div>

            {/* Amount */}
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-secondary-700 mb-2"
              >
                Price (ETH) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="0.1"
                  min="0"
                  step="0.01"
                  className="input pl-10"
                  required
                />
              </div>
              <p className="text-xs text-secondary-500 mt-1">
                Enter the price in ETH for your service
              </p>
            </div>

            {/* Deadline (Optional) */}
            <div>
              <label
                htmlFor="deadline"
                className="block text-sm font-medium text-secondary-700 mb-2"
              >
                Estimated Delivery Time (Optional)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
                <input
                  type="text"
                  id="deadline"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  placeholder="e.g., 3-5 business days, 1 week"
                  className="input pl-10"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full btn-primary h-12 text-base font-semibold",
                  isSubmitting && "opacity-75 cursor-not-allowed"
                )}
              >
                {isSubmitting ? (
                  <>
                    <div className="loading-spinner mr-3"></div>
                    Creating Project...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 mr-3" />
                    Create Project
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Tips Card */}
      <div className="mt-8 card">
        <div className="card-header">
          <h3 className="card-title">Tips for Success</h3>
          <p className="card-description">
            Make your project stand out to potential clients
          </p>
        </div>
        <div className="card-content">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-bold text-primary-600">1</span>
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-900">
                  Be Specific
                </p>
                <p className="text-sm text-secondary-600">
                  Clearly describe what you'll deliver and your expertise
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-bold text-primary-600">2</span>
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-900">
                  Set Fair Pricing
                </p>
                <p className="text-sm text-secondary-600">
                  Research market rates and price competitively
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-bold text-primary-600">3</span>
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-900">
                  Include Timeline
                </p>
                <p className="text-sm text-secondary-600">
                  Give clients a clear expectation of delivery time
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
