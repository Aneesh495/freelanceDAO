import React, { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import { UserContext } from "../components/UserContext";
import freelanceDAOAbi from "../contractABI_FreelanceDAO.json";
import { freelanceDAOAddress } from "../contractAddresses";
import CreateProject from "../components/CreateProject";
import ViewProjects from "../components/ViewProjects";
import ProjectsCreated from "../components/ProjectsCreated";
import ProjectsBought from "../components/ProjectsBought";
import {
  Plus,
  Briefcase,
  Users,
  TrendingUp,
  Clock,
  DollarSign,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "../utils/cn";

const Dashboard = () => {
  const { account } = useContext(UserContext);
  const [contract, setContract] = useState(null);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalEarnings: 0,
  });
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const freelanceDAO = new ethers.Contract(
          freelanceDAOAddress,
          freelanceDAOAbi,
          signer
        );
        setContract(freelanceDAO);
        await fetchStats(freelanceDAO);
      }
    };
    init();
  }, []);

  const fetchStats = async (contractInstance) => {
    try {
      const projectCount = await contractInstance.nextProjectId();
      let activeCount = 0;
      let completedCount = 0;
      let totalEarnings = 0;

      for (let i = 0; i < projectCount; i++) {
        const project = await contractInstance.projects(i);
        if (project.freelancer === account) {
          if (project.isCompleted) {
            completedCount++;
            totalEarnings += Number(ethers.formatEther(project.amount));
          } else if (project.isAccepted) {
            activeCount++;
          }
        }
      }

      setStats({
        totalProjects: Number(projectCount),
        activeProjects: activeCount,
        completedProjects: completedCount,
        totalEarnings: totalEarnings,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "create", label: "Create Project", icon: Plus },
    { id: "browse", label: "Browse Projects", icon: Briefcase },
    { id: "my-projects", label: "My Projects", icon: Users },
    { id: "purchased", label: "Purchased", icon: CheckCircle },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab stats={stats} />;
      case "create":
        return <CreateProject contract={contract} account={account} />;
      case "browse":
        return <ViewProjects contract={contract} account={account} />;
      case "my-projects":
        return <ProjectsCreated contract={contract} account={account} />;
      case "purchased":
        return <ProjectsBought contract={contract} account={account} />;
      default:
        return <OverviewTab stats={stats} />;
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            Dashboard
          </h1>
          <p className="text-secondary-600">
            Manage your freelance projects and discover new opportunities
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-secondary-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors",
                      activeTab === tab.id
                        ? "border-primary-500 text-primary-600"
                        : "border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">{renderTabContent()}</div>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ stats }) => {
  const statCards = [
    {
      title: "Total Projects",
      value: stats.totalProjects,
      icon: Briefcase,
      color: "primary",
      description: "Projects in the marketplace",
    },
    {
      title: "Active Projects",
      value: stats.activeProjects,
      icon: Clock,
      color: "warning",
      description: "Currently in progress",
    },
    {
      title: "Completed",
      value: stats.completedProjects,
      icon: CheckCircle,
      color: "success",
      description: "Successfully delivered",
    },
    {
      title: "Total Earnings",
      value: `${stats.totalEarnings.toFixed(2)} ETH`,
      icon: DollarSign,
      color: "success",
      description: "From completed projects",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            primary: "bg-primary-100 text-primary-600",
            success: "bg-success-100 text-success-600",
            warning: "bg-warning-100 text-warning-600",
            error: "bg-error-100 text-error-600",
          };

          return (
            <div key={index} className="card hover-lift">
              <div className="card-content">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-secondary-900">
                      {stat.value}
                    </p>
                    <p className="text-xs text-secondary-500 mt-1">
                      {stat.description}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center",
                      colorClasses[stat.color]
                    )}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
            <p className="card-description">Get started with common tasks</p>
          </div>
          <div className="card-content space-y-4">
            <button className="w-full btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Create New Project
            </button>
            <button className="w-full btn-outline">
              <Briefcase className="w-4 h-4 mr-2" />
              Browse Available Projects
            </button>
            <button className="w-full btn-outline">
              <Users className="w-4 h-4 mr-2" />
              View My Projects
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Activity</h3>
            <p className="card-description">Your latest project updates</p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-success-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-secondary-900">
                    Project completed
                  </p>
                  <p className="text-xs text-secondary-500">
                    Web development project marked as complete
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                <div className="w-8 h-8 bg-warning-100 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-warning-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-secondary-900">
                    New project created
                  </p>
                  <p className="text-xs text-secondary-500">
                    Mobile app development project listed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
