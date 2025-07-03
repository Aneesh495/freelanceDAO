import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Modal from "react-modal";
import {
  Briefcase,
  User,
  DollarSign,
  Calendar,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Search,
  Filter,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { cn } from "../utils/cn";

Modal.setAppElement("#root");

const ViewProjects = ({ contract, account }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [buying, setBuying] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");

  useEffect(() => {
    fetchProjects();
  }, [contract]);

  const fetchProjects = async () => {
    if (!contract) return;

    try {
      setLoading(true);
      const projectCount = await contract.nextProjectId();
      const allProjects = [];

      for (let i = 0; i < projectCount; i++) {
        const project = await contract.projects(i);
        // Only show projects that are not yet accepted
        if (project.client === ethers.ZeroAddress) {
          allProjects.push({
            ...project,
            id: i,
            formattedAmount: ethers.formatEther(project.amount),
            deadlineDate: new Date(project.deadline * 1000),
            timeAgo: getTimeAgo(project.deadline * 1000),
          });
        }
      }

      setProjects(allProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setMessage({ type: "error", text: "Error loading projects" });
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return "Just now";
  };

  const openModal = (project) => {
    setSelectedProject(project);
    setIsOpen(true);
    setMessage({ type: "", text: "" });
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedProject(null);
  };

  const handleBuy = async () => {
    if (!contract || !selectedProject) return;

    try {
      setBuying(true);
      const tx = await contract.acceptTerms(selectedProject.id, {
        value: selectedProject.amount,
      });
      await tx.wait();
      setMessage({ type: "success", text: "Project accepted successfully!" });
      setBuying(false);
      closeModal();
      // Refresh the project list
      await fetchProjects();
    } catch (error) {
      console.error("Error accepting project:", error);
      setMessage({
        type: "error",
        text: "Error accepting project. Please try again.",
      });
      setBuying(false);
    }
  };

  const filteredAndSortedProjects = projects
    .filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterBy === "all" ||
        (filterBy === "recent" && project.timeAgo.includes("hour")) ||
        (filterBy === "today" && project.timeAgo.includes("day"));
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.deadlineDate - a.deadlineDate;
        case "oldest":
          return a.deadlineDate - b.deadlineDate;
        case "price-high":
          return parseFloat(b.formattedAmount) - parseFloat(a.formattedAmount);
        case "price-low":
          return parseFloat(a.formattedAmount) - parseFloat(b.formattedAmount);
        default:
          return 0;
      }
    });

  const ProjectCard = ({ project }) => (
    <div
      className="card hover-lift cursor-pointer"
      onClick={() => openModal(project)}
    >
      <div className="card-content">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              {project.name}
            </h3>
            <p className="text-secondary-600 text-sm line-clamp-2 mb-3">
              {project.description}
            </p>
          </div>
          <div className="ml-4 text-right">
            <div className="text-xl font-bold text-primary-600">
              {project.formattedAmount} ETH
            </div>
            <div className="text-xs text-secondary-500">{project.timeAgo}</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-secondary-500">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            <span className="font-mono">
              {`${project.freelancer.slice(0, 6)}...${project.freelancer.slice(
                -4
              )}`}
            </span>
          </div>
          <div className="flex items-center">
            <Eye className="w-4 h-4 mr-1" />
            <span>View Details</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-secondary-900">
            Available Projects
          </h2>
          <p className="text-secondary-600">
            Browse and purchase freelance services
          </p>
        </div>
        <div className="text-sm text-secondary-500">
          {filteredAndSortedProjects.length} project
          {filteredAndSortedProjects.length !== 1 ? "s" : ""} available
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="input"
          >
            <option value="all">All Projects</option>
            <option value="recent">Recent (Last Hour)</option>
            <option value="today">Today</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-high">Price: High to Low</option>
            <option value="price-low">Price: Low to High</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading projects...</p>
        </div>
      )}

      {/* Error State */}
      {message.type === "error" && (
        <div className="p-4 bg-error-50 border border-error-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-error-600 mr-3" />
            <p className="text-error-700">{message.text}</p>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      {!loading && (
        <>
          {filteredAndSortedProjects.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">
                No projects found
              </h3>
              <p className="text-secondary-600">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Check back later for new projects"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Project Details Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Project Details"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-large max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      >
        {selectedProject && (
          <div className="p-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-secondary-900">
                Project Details
              </h2>
              <button
                onClick={closeModal}
                className="p-2 text-secondary-400 hover:text-secondary-600 rounded-lg hover:bg-secondary-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Project Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                  {selectedProject.name}
                </h3>
                <p className="text-secondary-600">
                  {selectedProject.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                  <DollarSign className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="text-sm text-secondary-600">Price</p>
                    <p className="font-semibold text-secondary-900">
                      {selectedProject.formattedAmount} ETH
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                  <User className="w-5 h-5 text-secondary-600" />
                  <div>
                    <p className="text-sm text-secondary-600">Freelancer</p>
                    <p className="font-mono text-sm text-secondary-900">
                      {selectedProject.freelancer}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-warning-600" />
                  <div>
                    <p className="text-sm text-secondary-600">Created</p>
                    <p className="text-sm text-secondary-900">
                      {selectedProject.timeAgo}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                  <Clock className="w-5 h-5 text-success-600" />
                  <div>
                    <p className="text-sm text-secondary-600">Status</p>
                    <p className="text-sm font-medium text-success-600">
                      Available
                    </p>
                  </div>
                </div>
              </div>

              {/* Message */}
              {message.text && (
                <div
                  className={cn(
                    "p-4 rounded-lg flex items-center",
                    message.type === "error"
                      ? "bg-error-50 border border-error-200"
                      : "bg-success-50 border border-success-200"
                  )}
                >
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
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleBuy}
                  disabled={buying}
                  className={cn(
                    "flex-1 btn-primary h-12",
                    buying && "opacity-75 cursor-not-allowed"
                  )}
                >
                  {buying ? (
                    <>
                      <div className="loading-spinner mr-3"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-3" />
                      Accept Project
                    </>
                  )}
                </button>
                <button onClick={closeModal} className="btn-outline h-12 px-6">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ViewProjects;
