"use client";

import { useState } from "react";
import {
  Search,
  MoreVertical,
  Shield,
  User,
  Users,
  UserX,
  Clock,
  TrendingUp,
  ChevronDown,
} from "lucide-react";
import AdminSidebar from "@/components/ui/admin-sidebar";
import AdminHeader from "@/components/ui/admin-header";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "instructor" | "learner" | "guest";
  status: "active" | "suspended" | "deleted";
  dateJoined: string;
  lastSeen: string;
  coursesEnrolled?: number;
  coursesCreated?: number;
  completionRate?: number;
}

type RoleFilter = "all" | "admin" | "instructor" | "learner" | "guest";
type StatusFilter = "all" | "active" | "suspended" | "deleted";

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "admin",
      status: "active",
      dateJoined: "2024-01-15",
      lastSeen: "2025-10-01",
      coursesEnrolled: 5,
      completionRate: 80,
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      role: "instructor",
      status: "active",
      dateJoined: "2024-02-20",
      lastSeen: "2025-09-30",
      coursesCreated: 8,
      coursesEnrolled: 3,
      completionRate: 95,
    },
    {
      id: "3",
      name: "Michael Chen",
      email: "m.chen@example.com",
      role: "learner",
      status: "active",
      dateJoined: "2024-03-10",
      lastSeen: "2025-09-28",
      coursesEnrolled: 12,
      completionRate: 65,
    },
    {
      id: "4",
      name: "Emily Rodriguez",
      email: "emily.r@example.com",
      role: "learner",
      status: "suspended",
      dateJoined: "2024-04-05",
      lastSeen: "2025-09-15",
      coursesEnrolled: 4,
      completionRate: 30,
    },
    {
      id: "5",
      name: "David Park",
      email: "david.park@example.com",
      role: "instructor",
      status: "active",
      dateJoined: "2024-01-25",
      lastSeen: "2025-10-01",
      coursesCreated: 12,
      coursesEnrolled: 2,
      completionRate: 100,
    },
    {
      id: "6",
      name: "Lisa Anderson",
      email: "lisa.a@example.com",
      role: "guest",
      status: "active",
      dateJoined: "2025-09-20",
      lastSeen: "2025-09-30",
      coursesEnrolled: 0,
      completionRate: 0,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [showRoleModal, setShowRoleModal] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "instructor":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "learner":
        return "bg-green-100 text-green-700 border-green-200";
      case "guest":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "suspended":
        return "bg-yellow-100 text-yellow-700";
      case "deleted":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleRoleChange = (userId: string, newRole: User["role"]) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    setShowRoleModal(null);
  };

  const handleStatusChange = (userId: string, newStatus: User["status"]) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)));
    setShowActionMenu(null);
  };

  const stats = [
    {
      label: "Total Users",
      value: users.length.toString(),
      icon: Users,
      color: "text-blue-600",
    },
    {
      label: "Active Users",
      value: users.filter((u) => u.status === "active").length.toString(),
      icon: User,
      color: "text-green-600",
    },
    {
      label: "Instructors",
      value: users.filter((u) => u.role === "instructor").length.toString(),
      icon: Shield,
      color: "text-purple-600",
    },
    {
      label: "Suspended",
      value: users.filter((u) => u.status === "suspended").length.toString(),
      icon: UserX,
      color: "text-yellow-600",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* ✅ Shared Sidebar */}
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ✅ Shared Header */}
        <AdminHeader setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600 mt-1">
                Manage users, roles, and permissions
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {stats.map((s, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{s.label}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {s.value}
                      </p>
                    </div>
                    <s.icon className={`w-8 h-8 ${s.color}`} />
                  </div>
                </div>
              ))}
            </div>

            {/* Search + Filters */}
            <div className="mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3">
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="instructor">Instructor</option>
                    <option value="learner">Learner</option>
                    <option value="guest">Guest</option>
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="deleted">Deleted</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Activity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Progress
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setShowRoleModal(user)}
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                              user.role
                            )}`}
                          >
                            {user.role}
                            <ChevronDown className="w-3 h-3 ml-1" />
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                              user.status
                            )}`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1 text-gray-400" />
                              Joined:{" "}
                              {new Date(user.dateJoined).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-400">
                              Last seen:{" "}
                              {new Date(user.lastSeen).toLocaleDateString()}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {user.role === "instructor" && (
                            <div>Courses Created: {user.coursesCreated || 0}</div>
                          )}
                          <div>Courses Enrolled: {user.coursesEnrolled || 0}</div>
                          <div className="flex items-center">
                            <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                            Completion: {user.completionRate || 0}%
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="relative">
                            <button
                              onClick={() =>
                                setShowActionMenu(
                                  showActionMenu === user.id ? null : user.id
                                )
                              }
                              className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                              <MoreVertical className="w-5 h-5 text-gray-600" />
                            </button>

                            {showActionMenu === user.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                <button
                                  onClick={() => handleStatusChange(user.id, "active")}
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                                >
                                  Activate
                                </button>
                                <button
                                  onClick={() =>
                                    handleStatusChange(user.id, "suspended")
                                  }
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-yellow-50"
                                >
                                  Suspend
                                </button>
                                <button
                                  onClick={() =>
                                    handleStatusChange(user.id, "deleted")
                                  }
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-red-50"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No users found</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Role Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Change User Role</h3>
            <p className="text-sm text-gray-600 mb-4">
              Select a new role for {showRoleModal.name}
            </p>

            <div className="space-y-2">
              {(["admin", "instructor", "learner", "guest"] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleChange(showRoleModal.id, role)}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 ${
                    showRoleModal.role === role
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="capitalize">{role}</span>
                    {showRoleModal.role === role && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRoleModal(null)}
                className="flex-1 px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
