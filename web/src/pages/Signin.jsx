import { useState } from "react";
import axiosInstance from "../axios/axiosInstance";
import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router";
import { setToken } from "../redux/auth.slice";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    setLoading(true);
    setError(null); // Reset error state before making a new request

    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
        rememberMe,
      });
      dispatch(setToken(response.data.token));
      // navigate to home page
    } catch (err) {
      setError("Invalid email or password.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
        {/* Heading */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Welcome back!</h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {error && (
            <div className="text-sm text-red-500 text-center mb-4">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-0 focus:border-orange-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-0 focus:border-orange-500 outline-none"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-gray-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="mr-2"
              />
              Remember me
            </label>
          </div>

          <button
            onClick={handleLogin}
            className={`w-full text-white py-2 rounded-md font-bold transition ${loading ? "bg-gray-400" : "bg-orange-500 hover:bg-orange-600"}`}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-4 text-sm">
          <p className="text-gray-600">
            Don&apos;t have an account?
            <a href="#" className="text-orange-500 hover:underline ml-1">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
