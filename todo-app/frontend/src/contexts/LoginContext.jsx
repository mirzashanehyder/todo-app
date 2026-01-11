import { createContext, useState, useEffect } from "react";
import axios from "axios";

// create context
export const loginContextObj = createContext();

const API_URL = import.meta.env.VITE_API_URL;

function LoginContext({ children }) {
  const [loginStatus, setLoginStatus] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginErrMessage, setLoginErrorMessage] = useState("");

  // user login
  const userLogin = async (userCredObj) => {
    try {
      let res = await axios.post(
        `${API_URL}/user-api/login`,
        userCredObj,
        { withCredentials: true }
      );

      if (res.status === 200) {
        setCurrentUser(res.data.payload);
        setLoginStatus(true);
        setLoginErrorMessage("");
      }
    } catch (err) {
      console.log("err is", err.response?.data?.message);
      setLoginErrorMessage(err.response?.data?.message || "Login failed");
    }
  };

  // user logout
  const userLogout = async () => {
    let res = await axios.get(
      `${API_URL}/user-api/logout`,
      { withCredentials: true }
    );
    if (res.status === 200) {
      setLoginStatus(false);
      setCurrentUser(null);
    }
  };

  // page refresh
  const pageRefresh = async () => {
    try {
      let res = await axios.get(
        `${API_URL}/refresh`,
        { withCredentials: true }
      );

      setCurrentUser(res.data.payload);
      setLoginStatus(true);
      setLoginErrorMessage("");
    } catch (err) {
      if (err.response?.status === 401) {
        setLoginStatus(false);
        setCurrentUser(null);
        return;
      }
      console.error("Unexpected error:", err);
    }
  };

  useEffect(() => {
    pageRefresh();
  }, []);

  return (
    <loginContextObj.Provider
      value={{
        loginStatus,
        currentUser,
        loginErrMessage,
        setLoginErrorMessage,
        setCurrentUser,
        userLogin,
        userLogout,
        setLoginStatus,
      }}
    >
      {children}
    </loginContextObj.Provider>
  );
}

export default LoginContext;
