import { createContext, useState } from "react";
import axios from "axios";
import { useEffect } from "react";

//create context object
export const loginContextObj = createContext();

function LoginContext({ children }) {
  //state
  const [loginStatus, setLoginStatus] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginErrMessage, setLoginErrorMessage] = useState("");

  //user login
  const userLogin = async (userCredObj) => {
    try {
      let res = await axios.post("http://localhost:8000/user-api/login", userCredObj,{
        withCredentials:true
      });
      //if login success
      if (res.status === 200) {
        //update the user
        setCurrentUser(res.data.payload);
        setLoginStatus(true);
        setLoginErrorMessage("");
      }
    } catch (err) {
      console.log("err is ", err.response.data.message);
      setLoginErrorMessage(err.response.data.message)
    }
  };
  //user logout
  const userLogout = async () => {
    let res = await axios.get("http://localhost:8000/user-api/logout",{withCredentials:true});
    if (res.status === 200) {
        setLoginStatus(false);
    }
  };

  console.log("Current user is ", currentUser);
  console.log("login err is ",loginErrMessage);

  //refresh
  const pageRefresh = async () => {
    try {
      let res = await axios.get("http://localhost:8000/refresh",{
        withCredentials:true,
      });

      setCurrentUser(res.data.payload);
      setLoginStatus(true);
      setLoginErrorMessage("");
    } catch (err) {
      // when no token exists
      if (err.response?.status === 401) {
        setLoginStatus(false);
        setCurrentUser(null);
        return
      }
      console.error("Unexprected erroe:",err);
    }
  }

  useEffect(()=>{
    pageRefresh();
  },[]);

  return (
    <loginContextObj.Provider value={{ loginStatus, currentUser, loginErrMessage,setLoginErrorMessage, setCurrentUser, userLogin, userLogout,setLoginStatus }}>
      {children}
    </loginContextObj.Provider>
  );
}

export default LoginContext;