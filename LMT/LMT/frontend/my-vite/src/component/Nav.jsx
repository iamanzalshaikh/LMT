import React, { useState } from "react";
import { IoPersonCircle } from "react-icons/io5";
import logo from "../assets/logo.jpg";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { toast } from "react-toastify";
import { RxHamburgerMenu } from "react-icons/rx";
import { GiSplitCross } from "react-icons/gi";

const Nav = () => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [showHam, setShowHam] = useState(false);

  const handleLogout = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/auth/logout", {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      toast.success(result.data.message);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      {/* ✅ Wrap everything in a fragment so we can return two parts */}
      <div className="w-[100%] h-[70px] fixed top-0 px-[20px] py-[10px] items-center justify-between bg-[#00000047] z-10 flex">
        {/* Logo */}
        <div className="lg:w-[20%] w-[40%] lg:pl-[50px]">
          <img
            src={logo}
            alt="logo"
            className="w-[60px] rounded-[5px] border-white"
          />
        </div>

        {/* Desktop Menu */}
        <div className="w-[30%] lg:flex items-center justify-center gap-4 hidden lg:flex">
          {!userData && (
            <IoPersonCircle
              className="w-[50px] h-[50px] fill-black cursor-pointer"
              onClick={() => setShow((prev) => !prev)}
            />
          )}

          {userData && (
            <div
              className="w-[50px] h-[50px] rounded-full overflow-hidden border-2 border-white cursor-pointer flex items-center justify-center bg-black"
              onClick={() => setShow((prev) => !prev)}
            >
              {userData?.photoUrl ? (
                <img
                  src={userData.photoUrl}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-white text-[12px]">
                  <span>+</span>
                  <span className="text-[10px]">Edit</span>
                </div>
              )}
            </div>
          )}

          {userData?.role === "educator" && (
            <div className="px-[20px] py-[10px] border-2 lg:border-white border-black text-white bg-black rounded-[10px] text-[18px] font-light flex gap-2 cursor-pointer" onClick={() => navigate("/dashboard")}>
              Dashboard
            </div>
          )}

          {!userData ? (
            <span
              className="px-[20px] py-[10px] border-2 border-white text-white rounded-[10px] text-[18px] font-light cursor-pointer bg-[#000000d5]"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          ) : (
            <span
              className="px-[20px] py-[10px] bg-white text-black rounded-[10px] shadow-sm shadow-black text-[18px] cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </span>
          )}

          {show && (
            <div className="absolute top-[110%] right-[15%] flex items-center flex-col justify-center gap-2 text-[16px] rounded-md bg-[white] px-[15px] py-[10px] border-[2px] border-black hover:border-white hover:text-white cursor-pointer hover:bg-black">
              <span
                className="bg-black text-white px-[30px] py-[10px] rounded-2xl hover:bg-gray-600"
                onClick={() => navigate("/profile")}
              >
                My Profile
              </span>
              <span className="bg-black text-white px-[30px] py-[10px] rounded-2xl hover:bg-gray-600">
                My Courses
              </span>
            </div>
          )}
        </div>

        {/* Hamburger for Mobile */}
        <RxHamburgerMenu
          className="w-[40px] h-[40px] lg:hidden fill-white cursor-pointer"
          onClick={() => setShowHam(true)}
        />
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed top-0 left-0 w-[100vw] h-[100vh] bg-[#000000d6] flex items-center justify-center flex-col gap-5 z-20 lg:hidden transform transition-transform duration-300 ${
          showHam ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <GiSplitCross
          className="w-[35px] h-[35px] fill-white absolute top-5 right-[4%] cursor-pointer"
          onClick={() => setShowHam(false)}
        />

        {!userData && (
          <IoPersonCircle
            className="w-[50px] h-[50px] fill-white cursor-pointer"
            onClick={() => setShow((prev) => !prev)}
          />
        )}

        {userData && (
          <div
            className="w-[50px] h-[50px] rounded-full overflow-hidden border-2 border-white cursor-pointer flex items-center justify-center bg-gray-200"
            onClick={() => setShow((prev) => !prev)}
          >
            {userData?.photoUrl ? (
              <img
                src={userData.photoUrl}
                alt="User"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-black text-[12px]">
                <span>+</span>
                <span className="text-[10px]">Edit</span>
              </div>
            )}
          </div>
        )}

        {userData?.role === "educator" && (
          <div className="px-[20px] py-[10px] border-2 border-white text-white bg-black rounded-[10px] text-[18px] font-light flex gap-2 cursor-pointer" onClick={() => navigate("/dashboard")}>
            Dashboard
          </div>
        )}

        {!userData ? (
          <span
            className="px-[20px] py-[10px] border-2 border-white text-white rounded-[10px] text-[18px] font-light cursor-pointer bg-[#000000d5]"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        ) : (
          <span
            className="px-[20px] py-[10px] bg-white text-black rounded-[10px] shadow-sm shadow-black text-[18px] cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </span>
        )}

        {show && (
          <div className="flex flex-col items-center justify-center gap-2 w-full mt-4">
            <span
              className="bg-white text-black px-[30px] py-[10px] rounded-2xl hover:bg-gray-600 w-full text-center cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              My Profile
            </span>
            <span className="bg-white text-black px-[30px] py-[10px] rounded-2xl hover:bg-gray-600 w-full text-center cursor-pointer">
              My Courses
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default Nav;
