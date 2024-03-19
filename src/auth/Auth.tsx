
import { storeTypes, useStore } from "../../context/store";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

export default function Auth() {

  const { authToken } = useStore() as storeTypes;


  return Cookies.get("A_AccessToken") ? (
    <>
      <Outlet />
    </>
  ) : (
    <Navigate to="/signin" />
  );
}
