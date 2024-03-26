
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

export default function Auth() {

  return Cookies.get("A_AccessToken") ? (
    <>
      <Outlet />
    </>
  ) : (
    <Navigate to="/signin" />
  );
}
