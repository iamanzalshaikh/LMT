import axios from "axios";
import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { toast } from "react-toastify";

const EditProfile = () => {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  const [name, setName] = useState(userData.name || "");
  const [description, setDescription] = useState(userData.description || "");
  const [photoUrl, setPhotoUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleEditProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (photoUrl) formData.append("photoUrl", photoUrl);

    try {
      const result = await axios.post(serverUrl + "/api/user/profile", formData, {
        withCredentials: true,
      });

      dispatch(setUserData(result.data));
      setLoading(false);
      navigate("/");
      toast.success("Profile Updated");
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative">
        {/* Back Arrow */}
        <FaArrowLeft
          className="absolute top-5 left-5 w-6 h-6 cursor-pointer text-gray-500 hover:text-gray-800 transition-colors"
          onClick={() => navigate(-1)}
        />

        {/* Heading */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Edit Profile
        </h2>

        <form className="space-y-6" onSubmit={handleEditProfile}>
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Profile Image */}
            {userData?.photoUrl ? (
              <img
                src={userData.photoUrl}
                alt={`${userData?.name}'s profile`}
                className="w-28 h-28 rounded-full object-cover border-2 border-gray-300"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gray-300 text-white flex items-center justify-center text-3xl border-2 border-gray-300">
                {userData?.name?.slice(0, 1).toUpperCase()}
              </div>
            )}

            {/* Avatar Input */}
            <div className="w-full">
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Select Avatar
              </label>
              <input
                id="image"
                type="file"
                name="photoUrl"
                accept="image/*"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                onChange={(e) => setPhotoUrl(e.target.files[0])}
              />
            </div>

            {/* Full Name */}
            <div className="w-full">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                UserName
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>

            {/* Email */}
            <div className="w-full">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="text"
                readOnly
                value={userData?.email}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Description */}
            <div className="w-full">
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="bio"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us about yourself"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none h-24"
              />
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className={`w-full bg-black text-white py-3 rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
