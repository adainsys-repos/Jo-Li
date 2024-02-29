import { useEffect } from "react";
import { storeTypes, useStore } from "../../context/store";
import { Navigate, Outlet } from "react-router-dom";

export default function Auth() {
  const { authToken } = useStore() as storeTypes;
  useEffect(() => {}, [authToken]);
  return document.cookie.includes("token") ? (
    <>
      <Outlet />
    </>
  ) : (
    <Navigate to="/signin" />
  );
}
