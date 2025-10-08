// Route through same-origin Next.js API to avoid CORS issues in the browser
const BASE_URL = "/api/v1";

// ===========================
// REGISTER
// ===========================
export async function registerUser(email, password) {
  console.log("🟢 [registerUser] Sending registration data:", { email, password });

  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // important: enables cookie auth
    body: JSON.stringify({ email, password }),
  });

  console.log("🟣 [registerUser] Raw response:", res);

  const data = await res.json().catch(() => ({}));
  console.log("🟣 [registerUser] Parsed response JSON:", data);

  if (!res.ok) {
    console.error("❌ [registerUser] Registration failed:", data);
    throw new Error(data.error || data.message || "Registration failed");
  }

  console.log("✅ [registerUser] Success:", data);
  return data;
}

// ===========================
// LOGIN
// ===========================
export async function loginUser(email, password) {
  console.log("🟢 [loginUser] Sending login data:", { email, password });

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  console.log("🟣 [loginUser] Raw response:", res);

  const data = await res.json().catch(() => ({}));
  console.log("🟣 [loginUser] Parsed response JSON:", data);

  if (!res.ok) {
    console.error("❌ [loginUser] Login failed:", data);
    throw new Error(data.error || data.message || "Login failed");
  }

  console.log("✅ [loginUser] Success:", data);
  return data;
}

// ===========================
// GET CURRENT USER
// ===========================
export async function getCurrentUser() {
  console.log("🟢 [getCurrentUser] Fetching current user...");

  const res = await fetch(`${BASE_URL}/auth/me`, {
    method: "GET",
    credentials: "include",
  });

  console.log("🟣 [getCurrentUser] Raw response:", res);

  const data = await res.json().catch(() => ({}));
  console.log("🟣 [getCurrentUser] Parsed response JSON:", data);

  if (!res.ok) {
    console.error("❌ [getCurrentUser] Failed to get user:", data);
    throw new Error(data.error || data.message || "Failed to get user");
  }

  console.log("✅ [getCurrentUser] Success:", data);
  return data;
}

// ===========================
// LOGOUT
// ===========================
export async function logoutUser() {
  console.log("🟢 [logoutUser] Logging out...");

  const res = await fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  console.log("🟣 [logoutUser] Raw response:", res);

  if (!res.ok) {
    console.error("❌ [logoutUser] Logout failed");
    throw new Error("Logout failed");
  }

  console.log("✅ [logoutUser] Logged out successfully.");
}
