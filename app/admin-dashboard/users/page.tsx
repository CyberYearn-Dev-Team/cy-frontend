"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  getAllUsers,
  suspendUser,
  reactivateUser,
  deleteUser,
} from "@/lib/services/userManagement";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Search,
  MoreVertical,
  Shield,
  User,
  Users,
  UserX,
  Clock,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import AdminSidebar from "@/components/admin-sidebar";
import AdminHeader from "@/components/admin-header";
import Nav from "@/components/admin-nav";
import { UsersSkeleton } from "@/components/ui/users-skeleton";


interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "instructor" | "learner";
  status: "active" | "suspended" | "deleted";
  dateJoined: string;
  // lastSeen: string;
  coursesEnrolled?: number;
  coursesCreated?: number;
  completionRate?: number;
  totalXp?: number;
}

// 🎨 Theme Colors
const primary = "#72a210";
const secondary = "#507800";
const hover = "#5a850d";
const bgLight = "bg-gray-50 dark:bg-gray-950";
const bgCard = "bg-white dark:bg-gray-900";
const textDark = "text-gray-900 dark:text-gray-100";
const textMedium = "text-gray-600 dark:text-gray-400";
const textLight = "text-gray-500 dark:text-gray-300";

type RoleFilter = "all" | "admin" | "instructor" | "learner";
type StatusFilter = "all" | "active" | "suspended" | "deleted";

export default function UserManagement() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeUsers, setActiveUsers] = useState(0);
  
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    action: 'delete' | 'suspend' | 'activate' | null;
    userId: string | null;
  }>({
    isOpen: false,
    title: '',
    description: '',
    action: null,
    userId: null,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showRoleModal, setShowRoleModal] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const usersData = await getAllUsers();

        const formattedUsers = usersData.map((user: {
          id: string;
          username?: string;
          email?: string;
          role?: string;
          suspended?: boolean;
          createdAt?: string;
          totalXp?: number;
        }) => ({
          id: user.id,
          name: user.username || user.email?.split("@")[0] || "Unknown User",
          email: user.email || "No email provided",
          role: user.role?.includes('ADMIN') ? 'admin' : 
                user.role?.includes('INSTRUCTOR') ? 'instructor' : 'learner',
          status: user.suspended ? "suspended" : "active",
          dateJoined: user.createdAt
            ? new Date(user.createdAt).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          coursesEnrolled: 0, // These fields might need to be updated based on your data
          coursesCreated: 0,  // These fields might need to be updated based on your data
          totalXp: user.totalXp || 0, // Add totalXp to track user activity
        }));

        // Calculate active users (totalXp >= 500)
        const activeCount = formattedUsers.filter((user: User) => (user.totalXp || 0) >= 500).length;
        setActiveUsers(activeCount);
        
        setUsers(formattedUsers);
        setError(null);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users. Please try again later.");
        toast.error("Failed to load users. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user: User) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // ✅ Fix for admin text color (inline color styles)
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return {
          backgroundColor: `${primary}1a`,
          color: primary,
          border: `1px solid ${primary}40`,
        };
      case "instructor":
        return {
          backgroundColor: "#dbeafe",
          color: "#1d4ed8",
          border: "1px solid #bfdbfe",
        };
      case "learner":
        return {
          backgroundColor: "#dcfce7",
          color: "#15803d",
          border: "1px solid #bbf7d0",
        };
      default:
        return {
          backgroundColor: "#f3f4f6",
          color: "#374151",
          border: "1px solid #e5e7eb",
        };
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300";
      case "suspended":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300";
      case "deleted":
        return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const handleRoleChange = (userId: string, newRole: User["role"]) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    setShowRoleModal(null);
  };

  const handleStatusChange = (userId: string, newStatus: User["status"]) => {
    setUsers(
      users.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );
  };

  // Show confirmation dialog for suspend action
  const handleSuspendUser = (userId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Suspend User",
      description: "Are you sure you want to suspend this user?",
      action: "suspend",
      userId,
    });
  };

  // Show confirmation dialog for activate action
  const handleReactivateUser = (userId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Activate User",
      description: "Are you sure you want to activate this user?",
      action: "activate",
      userId,
    });
  };

  // Show confirmation dialog for delete action
  const handleDeleteUser = (userId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete User",
      description: "Are you sure you want to delete this user? This action cannot be undone.",
      action: "delete",
      userId,
    });
  };

  // Handle the confirmed action
  const confirmAction = async () => {
    if (!confirmDialog.userId || !confirmDialog.action) return;

    try {
      switch (confirmDialog.action) {
        case 'delete':
          await deleteUser(confirmDialog.userId);
          setUsers(users.filter(user => user.id !== confirmDialog.userId));
          toast.success("User deleted successfully");
          break;
        case 'suspend':
          await suspendUser(confirmDialog.userId);
          setUsers(users.map(user => 
            user.id === confirmDialog.userId ? { ...user, status: "suspended" } : user
          ));
          toast.success("User suspended successfully");
          break;
        case 'activate':
          await reactivateUser(confirmDialog.userId);
          setUsers(users.map(user => 
            user.id === confirmDialog.userId ? { ...user, status: "active" } : user
          ));
          toast.success("User activated successfully");
          break;
      }
    } catch (error) {
      console.error(`Error in ${confirmDialog.action} user:`, error);
      toast.error(`Failed to ${confirmDialog.action} user. Please try again.`);
    } finally {
      setConfirmDialog({
        isOpen: false,
        title: "",
        description: "",
        action: null,
        userId: null,
      });
    }
  };

  // ✅ Updated stats — Deleted Users replaces Instructors
  const stats = [
    {
      label: "Total Users",
      value: users.length.toString(),
      icon: Users,
      color: `text-[${primary}]`,
    },
    {
      label: "Active Users",
      value: activeUsers.toString(),
      icon: User,
      color: "text-green-600",
    },
    {
      label: "Deleted",
      value: users.filter((u) => u.status === "deleted").length.toString(),
      icon: Shield,
      color: "text-red-600",
    },
    {
      label: "Suspended",
      value: users.filter((u) => u.status === "suspended").length.toString(),
      icon: UserX,
      color: "text-yellow-600",
    },
  ];


  // Import the skeleton component at the top with other imports

  if (isLoading) {
    return (
      <div className={`flex h-screen overflow-hidden ${bgLight}`}>
        <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-30">
            <div className="max-w-7xl mx-auto">
              <UsersSkeleton />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center p-4">
          <p className="text-lg font-medium">Error loading users</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen overflow-hidden ${bgLight}`}>
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-30">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                User Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage users, roles, and permissions
              </p>
              
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {s.label}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                        {s.value}
                      </p>
                    </div>
                    <s.icon className={`w-8 h-8 ${s.color}`} />
                  </div>
                </div>
              ))}
            </div>

            {/* Search + Filters */}
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center flex-wrap">
              {/* Search */}
              <div className="relative w-full lg:flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                  style={{ outline: "none", boxShadow: "none" }}
                />
              </div>

              {/* Filters Container */}
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <div className="flex w-full gap-3 sm:w-auto">
                  {/* Role Filter */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center justify-between w-1/2 sm:w-auto px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 cusor-pointer">
                        {roleFilter === "all"
                          ? "All Roles"
                          : roleFilter[0].toUpperCase() + roleFilter.slice(1)}
                        <ChevronDown className="ml-2 w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {(["all", "admin", "instructor", "learner"] as const).map(
                        (role) => (
                          <DropdownMenuItem
                            key={role}
                            onClick={() => setRoleFilter(role as RoleFilter)}
                          >
                            {role === "all"
                              ? "All Roles"
                              : role[0].toUpperCase() + role.slice(1)}
                          </DropdownMenuItem>
                        )
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Status Filter */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center justify-between w-1/2 sm:w-auto px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 cusor-pointer">
                        {statusFilter === "all"
                          ? "All Status"
                          : statusFilter[0].toUpperCase() +
                            statusFilter.slice(1)}
                        <ChevronDown className="ml-2 w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {(["all", "active", "suspended", "deleted"] as const).map(
                        (status) => (
                          <DropdownMenuItem
                            key={status}
                            onClick={() =>
                              setStatusFilter(status as StatusFilter)
                            }
                          >
                            {status === "all"
                              ? "All Status"
                              : status[0].toUpperCase() + status.slice(1)}
                          </DropdownMenuItem>
                        )
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase">
                    <tr>
                      <th className="px-6 py-3 text-left font-medium">User</th>
                      <th className="px-6 py-3 text-left font-medium">Role</th>
                      <th className="px-6 py-3 text-left font-medium">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left font-medium">
                        Activity
                      </th>
                      <th className="px-6 py-3 text-left font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/40"
                      >
                        <td className="px-6 py-4 flex items-center">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                            style={{ backgroundColor: primary }}
                          >
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              {user.name}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400">
                              {user.email}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setShowRoleModal(user)}
                            className="inline-flex items-center px-3 py-1 rounded-full border text-xs font-medium"
                            style={getRoleBadgeColor(user.role)}
                          >
                            {user.role}
                            <ChevronDown className="ml-1 w-3 h-3" />
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
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                          <div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1 text-gray-400" />
                              Joined:{" "}
                              {new Date(user.dateJoined).toLocaleDateString()}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {user.status === "suspended" ? (
                                <DropdownMenuItem
                                  onClick={() => handleReactivateUser(user.id)}
                                  className="text-green-600"
                                >
                                  Activate
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => handleSuspendUser(user.id)}
                                  className="text-yellow-600"
                                >
                                  Suspend
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600"
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No users found
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <Nav />

      {/* Role Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Change User Role
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Select a new role for {showRoleModal.name}
            </p>

            <div className="space-y-2">
              {(["admin", "instructor", "learner"] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleChange(showRoleModal.id, role)}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition`}
                  style={
                    showRoleModal.role === role
                      ? {
                          borderColor: primary,
                          color: primary,
                          backgroundColor: `${primary}1a`,
                        }
                      : { borderColor: "#d1d5db" }
                  }
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRoleModal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-center"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.isOpen}
        onOpenChange={(isOpen) => setConfirmDialog(prev => ({ ...prev, isOpen }))}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{confirmDialog.title}</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              {confirmDialog.description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
              className="px-4"
            >
              Cancel
            </Button>
            <Button
              variant={confirmDialog.action === 'delete' ? 'destructive' : 'default'}
              onClick={confirmAction}
              className="px-4"
            >
              {confirmDialog.action === 'delete' ? 'Delete' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
