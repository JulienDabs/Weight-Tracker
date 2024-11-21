import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import { useAuthState } from "../auth/AuthStateContext";
import "../../Style/navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/bettermeLogoSvg.svg";

const NavBar: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { isVerified, profileCompleted } = useAuthState();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    // Redirect to /login if the current path is "/"
    if (location.pathname === "/") {
      navigate("/login");
    }
  }, [location, navigate]);

  const userIcon = <FontAwesomeIcon icon={faUser} />;

  return (
    <nav>
      <div className="logo_navbar">
        <Link to="/">
          <img src={logo} alt="Logo Better Me" />
        </Link>
      </div>

      
        <ul>
          {user && isVerified && profileCompleted ? (
            <>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>

              <li>
                <a onClick={handleLogout}>Logout</a>
              </li>
              <li>
                <Link to="/displayprofile">{userIcon}</Link>
              </li>
              {!profileCompleted && (
                <li>
                  <Link to="/createprofile">Complete Profile</Link>
                </li>
              )}
              {/* Vous pouvez ajouter d'autres liens pour les utilisateurs connectés ici */}
            </>
          ) : (
            <>
              <li>
                <Link to="/register">Inscription</Link>
              </li>
              <li>
                <Link to="/login">Connexion</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    
  );
};

export default NavBar;
