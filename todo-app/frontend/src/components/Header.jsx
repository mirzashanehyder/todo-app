import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { loginContextObj } from "../contexts/LoginContext";

function Header() {
  const { loginStatus, userLogout } = useContext(loginContextObj);

  return (
    <div>
      <ul className="nav justify-content-center bg-dark">

        {!loginStatus ? (
          <>
            <li className="nav-item">
              <NavLink className="nav-link text-light" to="/login">Login</NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link text-light" to="/register">Register</NavLink>
            </li>
          </>
        ) : (
          <>
            <li className="nav-item">
              <NavLink to="register"
                className="nav-link text-light"
                onClick={userLogout}
              >
                Logout
              </NavLink>
            </li>
          </>
        )}

      </ul>
    </div>
  );
}

export default Header;
