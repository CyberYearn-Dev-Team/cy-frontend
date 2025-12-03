/**
 * Service for handling authentication-related API calls
 */

export const changePassword = async (currentPassword: string, newPassword: string): Promise<any> => {
  try {
    // Get token from localStorage
    const token = typeof window !== "undefined" ? localStorage.getItem("cy_token") : null;

    if (!token) {
      throw new Error("Authentication required. Please log in again.");
    }

    console.log('Sending password change request...');
    const response = await fetch(
      "https://cy-backend.onrender.com/api/v1/auth/change-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
        body: JSON.stringify({
          currentpassword: currentPassword,
          newpassword: newPassword,
        }),
      }
    );

    // Log response status and headers for debugging
    console.log('Password change response status:', response.status);
    
    // Handle response safely
    const responseText = await response.text();
    let data;
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      console.error("Failed to parse response as JSON:", responseText);
      throw new Error("Invalid response from server. Please try again.");
    }

    if (!response.ok) {
      const errorMessage = data.message || data.error || data.errorMessage || "Failed to update password";
      console.error('Password change failed:', errorMessage);
      
      // Handle specific error cases
      if (response.status === 401) {
        throw new Error("Invalid current password. Please try again.");
      } else if (response.status === 400) {
        throw new Error(errorMessage || "Invalid request. Please check your input.");
      } else if (response.status >= 500) {
        throw new Error("Server error. Please try again later.");
      }
      throw new Error(errorMessage);
    }

    // If we get here, the password change was successful
    console.log('Password changed successfully');
    return data;
    
  } catch (err: any) {
    console.error("Password change error:", err);
    // If it's already an Error object with a message, just rethrow it
    if (err instanceof Error) {
      throw err;
    }
    // If it's a string or something else, convert to Error
    throw new Error(
      typeof err === "string" ? err : "Failed to update password. Please try again."
    );
  }
};
