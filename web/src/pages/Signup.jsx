import { useState } from "react";
import axiosInstance from "../axios/axiosInstance";
import { useDispatch } from "react-redux";
import { setToken } from "../redux/auth.slice";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!formData.termsAccepted) {
      setError("You must accept the terms and conditions");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post("/auth/register", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        termsAccepted: formData.termsAccepted,
      });
      dispatch(setToken(response.data.token));
      localStorage.setItem("access_token", response.data.token);
      navigate("/");
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-full bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm">
        {/* Heading */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="text-gray-600">Start your journey with us</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-500 text-center mb-4">{error}</div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-0 focus:border-orange-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-0 focus:border-orange-500 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-0 focus:border-orange-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-0 focus:border-orange-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-0 focus:border-orange-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="flex items-center text-sm text-gray-600">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                className="mr-2"
              />
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>

          <button
            type="submit"
            className={`w-full text-white py-2 rounded-md font-bold transition ${
              loading ? "bg-gray-400" : "bg-orange-500 hover:bg-orange-600"
            }`}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Sign In Link */}
        <div className="text-center mt-4 text-sm">
          <p className="text-gray-600">
            Already have an account?
            <Link to="/signin" className="text-orange-500 hover:underline ml-1">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
