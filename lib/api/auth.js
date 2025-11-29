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
      throw new Error(data.error || data.message || "Login failed");
    }

    // SAVE TOKEN (VERY IMPORTANT)
    if (typeof window !== "undefined") {
      localStorage.setItem("cy_token", data.token);
    }

    console.log("User logged in successfully");
    return data;
  } catch (error) {
    console.error("Login Error:", error.message);
    throw error;
  }
}



// GET CURRENT USER
export async function getCurrentUser() {
  try {
    const res = await fetch(`${BASE_URL}/me`, {
      method: "GET",
      credentials: "include",
    });

    const data = await parseJSON(res);

    if (!res.ok) {
      throw new Error(data.error || data.message || "Failed to get user");
    }

    // The API returns: { message, data: { email, username, roles: ["ADMIN"], ... } }
    const user = data?.data || {};

    // Normalize so frontend always receives a single string for role
    const token =
  (typeof window !== "undefined" && localStorage.getItem("cy_token")) ||
  null;

const normalizedUser = {
  ...user,
  role: Array.isArray(user.roles) ? user.roles[0] : user.role || "Learner",
  token, // <-- ADD TOKEN HERE
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

    console.log("Logged out successfully");
  } catch (error) {
    console.error("Logout Error:", error.message);
    throw error;
  }
}
