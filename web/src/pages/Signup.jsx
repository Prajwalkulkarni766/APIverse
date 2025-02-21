import { useState } from "react";
import axiosInstance from "../axios/axiosInstance";
import { useDispatch } from "react-redux";
import { setToken } from "../redux/auth.slice";

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
  // const navigate = useNavigate();

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
    setError(null); // Reset error state before making a new request

    try {
      const response = await axiosInstance.post("/auth/register", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        termsAccepted: formData.termsAccepted,
      });
      dispatch(setToken(response.data.token));
      // navigate to login page
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Create your account</h2>
        <p className="text-center text-gray-600 mb-6">Start your journey with us</p>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-0 focus:border-orange-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-0 focus:border-orange-500 outline-none"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-0 focus:border-orange-500 outline-none"
              required
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-0 focus:border-orange-500 outline-none"
              required
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-700">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-0 focus:border-orange-500 outline-none"
              required
            />
          </div>
          <div className="mt-4">
            <label className="flex items-center">
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
          {error && <div className="text-sm text-red-500 text-center mb-4">{error}</div>}
          <button
            type="submit"
            className={`w-full mt-6 text-white py-2 rounded-md font-bold transition ${loading ? "bg-gray-400" : "bg-orange-500 hover:bg-orange-600"}`}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-700">
          Already have an account?{" "}
          <a href="#" className="text-orange-500 hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
