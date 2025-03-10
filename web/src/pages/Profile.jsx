import { useState, useEffect } from "react";
import axiosInstance from "../axios/axiosInstance";

export default function Profile() {
  const [data, setData] = useState(null);

  const fetchProfileDetails = async () => {
    try {
      const response = await axiosInstance.get("/users/about");
      setData(response.data);
    } catch (err) {
      alert("Problem while fetching user data");
      console.error(err);
    }
  };

  const updateProfile = async () => {
    try {
      await axiosInstance.patch("/users/about", data);
      alert("Profile updated successfully");
    } catch (err) {
      alert("Problem while updating user data");
      console.error(err);
    }
  };

  const handleEmailChange = (e) => {
    setData({
      ...data,
      email: e.target.value,
    });
  };

  const handleFirstNameChange = (e) => {
    setData({
      ...data,
      firstName: e.target.value,
    });
  };

  const handleLastNameChange = (e) => {
    setData({
      ...data,
      lastName: e.target.value,
    });
  };

  useEffect(() => {
    fetchProfileDetails();
  }, []);
  return (
    <div className="flex bg-white">
      <div className="flex-1 p-6">
        <h2 className="text-xl font-semibold mb-4">Profile</h2>

        {data ? (
          <div className="w-100">
            {/* Email */}
            <input
              type="email"
              placeholder="Email address"
              value={data.email}
              onChange={handleEmailChange}
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
            />

            {/* first name */}
            <input
              type="text"
              placeholder="First name"
              value={data.firstName}
              onChange={handleFirstNameChange}
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
            />

            {/* last name */}
            <input
              type="text"
              placeholder="Last name"
              value={data.lastName}
              onChange={handleLastNameChange}
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
            />

            <button
              className="bg-[#FF6C37] text-white px-4 py-2 rounded mt-4"
              onClick={updateProfile}
            >
              Save Changes
            </button>
          </div>
        ) : (
          <p>Data not found</p>
        )}
      </div>
    </div>
  );
}
