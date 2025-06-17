import Image from "next/image";
import {
  PlusCircleIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  ChartBarIcon,
  CubeIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  CogIcon,
} from "@heroicons/react/24/outline";

export default function WelcomePage() {
  const quickActions = [
    {
      title: "New Prescription",
      description: "Process a new prescription",
      icon: PlusCircleIcon,
      color: "bg-blue-500 hover:bg-blue-600",
      href: "/prescriptions/new",
    },
    {
      title: "Inventory Check",
      description: "View current stock levels",
      icon: CubeIcon,
      color: "bg-green-500 hover:bg-green-600",
      href: "/inventory",
    },
    {
      title: "Patient Records",
      description: "Access patient information",
      icon: UserGroupIcon,
      color: "bg-purple-500 hover:bg-purple-600",
      href: "/patients",
    },
    {
      title: "Daily Reports",
      description: "View sales and activity reports",
      icon: ChartBarIcon,
      color: "bg-orange-500 hover:bg-orange-600",
      href: "/reports",
    },
  ];

  const alerts = [
    {
      type: "warning",
      message: "5 medications are running low in stock",
      action: "View Inventory",
    },
    {
      type: "info",
      message: "12 prescriptions pending review",
      action: "Review Queue",
    },
  ];

  const recentActivity = [
    {
      time: "10:30 AM",
      action: "Prescription filled for John Doe",
      type: "prescription",
    },
    {
      time: "10:15 AM",
      action: "Inventory updated - Aspirin restocked",
      type: "inventory",
    },
    {
      time: "09:45 AM",
      action: "New patient registered - Jane Smith",
      type: "patient",
    },
    { time: "09:30 AM", action: "Daily backup completed", type: "system" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, John!
          </h2>
          <p className="text-gray-600">
            Here's what's happening at your pharmacy today.
          </p>
        </div>

        {/* Alerts Section */}
        {alerts.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Important Alerts
            </h3>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    alert.type === "warning"
                      ? "bg-yellow-50 border-yellow-400"
                      : "bg-blue-50 border-blue-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <ExclamationTriangleIcon
                        className={`w-5 h-5 ${
                          alert.type === "warning"
                            ? "text-yellow-600"
                            : "text-blue-600"
                        }`}
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {alert.message}
                      </span>
                    </div>
                    <button
                      className={`text-sm font-medium px-3 py-1 rounded-md transition-colors ${
                        alert.type === "warning"
                          ? "text-yellow-700 hover:bg-yellow-100"
                          : "text-blue-700 hover:bg-blue-100"
                      }`}
                    >
                      {alert.action}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions Grid */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="group bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 text-left"
              >
                <div
                  className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 transition-colors`}
                >
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-700">
                  {action.title}
                </h4>
                <p className="text-sm text-gray-600">{action.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Today's Sales
                </p>
                <p className="text-2xl font-bold text-gray-900">$2,847</p>
                <p className="text-sm text-green-600">+12% from yesterday</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Prescriptions Filled
                </p>
                <p className="text-2xl font-bold text-gray-900">47</p>
                <p className="text-sm text-blue-600">8 pending review</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ClipboardDocumentListIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Low Stock Items
                </p>
                <p className="text-2xl font-bold text-gray-900">5</p>
                <p className="text-sm text-orange-600">Requires attention</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <ExclamationTriangleIcon className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.type === "prescription"
                          ? "bg-blue-500"
                          : activity.type === "inventory"
                          ? "bg-green-500"
                          : activity.type === "patient"
                          ? "bg-purple-500"
                          : "bg-gray-500"
                      }`}
                    ></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.action}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-sm text-gray-500">
                      {activity.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
