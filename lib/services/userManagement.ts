import axios from "axios";

const API_BASE = "https://cy-backend.onrender.com/api/v1/admin/users";

// ---- GET ALL USERS ----
export const getAllUsers = async () => {
  try {
    const res = await axios.get(API_BASE, {
      withCredentials: true,
    });
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
    const res = await axios.patch(`${API_BASE}/${userId}/suspend`, null, {
      withCredentials: true,
    });
    return res.data;
  } catch (error: any) {
    console.error("Error suspending user:", error);
    throw error.response?.data || { message: "Failed to suspend user" };
  }
};




// ---- REACTIVATE USER ----
export const reactivateUser = async (userId: string) => {
  try {
    const res = await axios.patch(`${API_BASE}/${userId}/reactivate`, null, {
      withCredentials: true,
    });
    return res.data;
  } catch (error: any) {
    console.error("Error reactivating user:", error);
    throw error.response?.data || { message: "Failed to reactivate user" };
  }
};





// ---- DELETE USER ----
export const deleteUser = async (userId: string) => {
  try {
    const res = await axios.delete(`${API_BASE}/${userId}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error: any) {
    console.error("Error deleting user:", error);
    throw error.response?.data || { message: "Failed to delete user" };
  }
};



// UPDATE USER ROLE
export const updateUserRole = async (userId: string, role: string) => {
  try {
    const res = await axios.patch(
      `${API_BASE}/${userId}/add-role`,
      { role },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
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
    const res = await axios.patch(
      `${API_BASE}/${userId}/remove-role`,
      { role },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return res.data;
  } catch (error: any) {
    console.error('Error removing user role:', error);
    throw error.response?.data || { message: 'Failed to remove user role' };
  }
};