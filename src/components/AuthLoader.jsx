import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";

const AuthLoader = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(
        login({
          id: localStorage.getItem("id"),
          email: localStorage.getItem("email"),
          name: localStorage.getItem("name"),
          role: localStorage.getItem("role"),
          token: token
        })
      );
    }
  }, [dispatch]);

  return children;
};

export default AuthLoader;
