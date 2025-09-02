import React from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { userData } = useSelector((state) => state.user);
const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-xl w-full relative">
        <FaArrowLeft className="absolute top-[8%] left-[5%] w-[22px] cursor-pointer"  onClick={()=>navigate("/")}/>
        <div className="flex flex-col items-center text-center space-y-4">
          {userData?.photoUrl ? (
            <img
              src={userData.photoUrl}
              alt={`${userData?.name}'s profile`}
              className="w-24 h-24 rounded-full object-cover border-4 border-black"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-black text-white flex items-center justify-center text-2xl border-2 border-white">
              {userData?.name.slice(0 , 1 ).toUpperCase()}
            </div>
          )}
          <h2 className="text-2xl font-bold mt-4 text-gray-800">{userData?.name}</h2>
          <p className="text-sm text-gray-500">{userData?.role}</p>
        </div>

     <div className="mt-6 space-y-4">
  <div className="text-sm flex items-center justify-start gap-1">
    <span className="font semi-bold text-gray-700">Email: </span>
    <span>{userData.email}</span>
  </div>

  <div className="text-sm flex items-center justify-start gap-1">
   <span className="font semi-bold text-gray-700">Description: </span>
    <span>{userData.description}</span>
  </div>
  
  <div className="text-sm flex items-center justify-start gap-1">
   <span className="font semi-bold text-gray-700">Enrolled Courses: </span>
  <span>{userData?.enrolledCourses?.length || 0}</span>
</div>

<div className="mt-6 flex justify-center gap-4">
  <button className="px-5 py-2 rounded bg-[black] text-white active:bg-[#4b4b4b] cursor-pointer transition" onClick={()=>navigate('/editprofile')}>
    Edit Profile

  </button>
</div>

</div>

      </div>
    </div>
  );
};

export default Profile;
