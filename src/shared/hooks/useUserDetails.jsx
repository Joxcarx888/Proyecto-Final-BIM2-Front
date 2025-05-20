import { useState } from "react";
import { logout as logoutHandler } from "./useLogout";

const getUserDetails = () => {
  const userDetails = localStorage.getItem("user");
  return userDetails ? JSON.parse(userDetails) : null;
};

export const useUserDetails = () => {
  const [userDetails, setUserDetails] = useState(getUserDetails());

  const logout = () => {
    logoutHandler();
    setUserDetails(null);
  };

  return {
    isLogged: Boolean(userDetails?.token),
    username: userDetails?.username ?? "Guest",
    role: userDetails?.role ?? "",
    token: userDetails?.token ?? null,
    logout,
    setUserDetails,
    user: userDetails,
  };
};
