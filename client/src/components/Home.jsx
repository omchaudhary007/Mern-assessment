import React, { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUser } from "../App";
import { toast } from "react-toastify";
import { get } from "../api/api";

const Home = () => {
  const navigate = useNavigate();
  const { username,setUsername } = useUser();
  const [isLoading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      const result = await get("/admin/logout", { credentials: "include" });
      if (!result.success) {
        toast.error(result.message);
      } else {
        setUsername("");
        toast.success("Logout sucessful!");
        navigate("/");
      }
    } catch (error) {
      toast.error("Failed to logout!");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <main className={`w-full ${isLoading && 'opacity-60'}`}>
      <nav className="px-8 py-3 font-medium flex items-center justify-between">
        <img className="w-10" src="./vite.svg" alt="logo" />
        <ul className="flex items-center gap-6">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "py-2 rounded-sm border-b-4 border-b-cyan-700" : ""
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="employees"
              className={({ isActive }) =>
                isActive ? "py-2 rounded-sm border-b-4 border-b-cyan-700" : ""
              }
            >
              Employees
            </NavLink>
          </li>
        </ul>
        <div className="flex items-center gap-10">
          <p>{username}</p>
          <button className="text-violet-700 underline" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
      <Outlet />
    </main>
  );
};

export default Home;
