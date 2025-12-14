// Route through same-origin Next.js API to avoid CORS issues in the browser
const BASE_URL = "https://cy-backend.onrender.com/api/v1";

// Helper function to safely parse JSON
async function parseJSON(res) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}



// REGISTER
export async function registerUser(email, password) {
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // enables cookie auth
      body: JSON.stringify({ email, password }),
    });

    const data = await parseJSON(res);

    if (!res.ok) {
      throw new Error(data.error || data.message || "Registration failed");
    }

    console.log("User registered successfully");
    return data;
  } catch (error) {
    console.error("Registration Error:", error.message);
    throw error;
  }
}



// LOGIN
export async function loginUser(email, password) {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await parseJSON(res);

    if (!res.ok) {
      if (data.message === "Your account has been suspended") {
        const error = new Error(data.message);
        error.isSuspended = true;
        throw error;
      }
      throw new Error(data.error || data.message || "Login failed");
    }

    // Store token in localStorage for client-side use
    if (typeof window !== 'undefined') {
      console.log('Login token:', data.token);
      localStorage.setItem('cy_token', data.token);
      
      // Store token in cookie as 'auth-token'
      document.cookie = `auth-token=${data.token}; Path=/; Secure; SameSite=Strict;`;
    }

    console.log("User logged in, token stored.");
    return data;
  } catch (error) {
    console.error("Login Error:", error.message);
    throw error;
  }
}




// Helper function to get cookie by name
function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

// GET CURRENT USER
export async function getCurrentUser() {
  try {
    const res = await fetch(`${BASE_URL}/me`, {
      method: "GET",
      credentials: "include",
      headers: {
        'Authorization': `Bearer ${getCookie('auth-token') || ''}`
      }
    });

    const data = await parseJSON(res);

    if (!res.ok) {
      throw new Error(data.error || data.message || "Failed to get user");
    }

    // The API returns: { message, data: { email, username, roles: ["ADMIN"], ... } }
    const user = data?.data || {};

    // Get token from auth-token cookie
    const token = getCookie('auth-token');

    const normalizedUser = {
      ...user,
      role: Array.isArray(user.roles) ? user.roles[0] : user.role || "Learner",
      token,
    };

    console.log("Normalized current user:", normalizedUser);

    return normalizedUser;
  } catch (error) {
    console.error("Get Current User Error:", error.message);
    throw error;
  }
}



// FORGOT PASSWORD
export async function forgotPassword(email) {
  try {
    const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await parseJSON(res);

    if (!res.ok) {
      throw new Error(data.message || 'Failed to send reset link');
    }

    return data;
  } catch (error) {
    console.error('Forgot Password Error:', error.message);
    throw error;
  }
}



// LOGOUT
export async function logoutUser() {
  try {
    const res = await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Logout failed");
    }

    // Clear the auth-token cookie
    document.cookie = 'auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Secure; SameSite=Strict;';
    
    // Clear any domain-specific auth-token
    document.cookie = 'auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Domain=cy-backend.onrender.com; Secure; SameSite=None;';
    
    // Also clear the token from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cy_token');
    }
    
    console.log("Logged out successfully - cleared all auth tokens");
  } catch (error) {
    console.error("Logout Error:", error.message);
    throw error;
  }
}
