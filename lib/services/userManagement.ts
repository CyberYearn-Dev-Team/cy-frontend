import { apiClient } from "@/lib/api/client";

const API_BASE = "/admin/users";

// ---- GET ALL USERS ----
export const getAllUsers = async () => {
  try {
    const res = await apiClient.get(API_BASE);
    // Return the data array or empty array if not found
    return res.data?.data || [];
  } catch (error: any) {
    console.error("Error fetching users:", error);
    throw error.response?.data || { message: "Failed to fetch users" };
  }
};




// ---- SUSPEND USER ----
export const suspendUser = async (userId: string) => {
  try {
    const res = await apiClient.patch(`${API_BASE}/${userId}/suspend`);
    return res.data;
  } catch (error: any) {
    console.error("Error suspending user:", error);
    throw error.response?.data || { message: "Failed to suspend user" };
  }
};




// ---- REACTIVATE USER ----
export const reactivateUser = async (userId: string) => {
  try {
    const res = await apiClient.patch(`${API_BASE}/${userId}/reactivate`);
    return res.data;
  } catch (error: any) {
    console.error("Error reactivating user:", error);
    throw error.response?.data || { message: "Failed to reactivate user" };
  }
};




// ---- DELETE USER ----
export const deleteUser = async (userId: string) => {
  try {
    const res = await apiClient.delete(`${API_BASE}/${userId}`);
    return res.data;
  } catch (error: any) {
    console.error("Error deleting user:", error);
    throw error.response?.data || { message: "Failed to delete user" };
  }
};


// UPDATE USER ROLE
export const updateUserRole = async (userId: string, role: string) => {
  try {
    const res = await apiClient.patch(
      `${API_BASE}/${userId}/add-role`,
      { role }
    );
    return res.data;
  } catch (error: any) {
    console.error('Error updating user role:', error);
    throw error.response?.data || { message: 'Failed to update user role' };
  }
};



// ---- REMOVE USER ROLE ----
export const removeUserRole = async (userId: string, role: string) => {
  try {
    const res = await apiClient.patch(
      `${API_BASE}/${userId}/remove-role`,
      { role }
    );
    return res.data;
  } catch (error: any) {
    console.error('Error removing user role:', error);
    throw error.response?.data || { message: 'Failed to remove user role' };
  }
};