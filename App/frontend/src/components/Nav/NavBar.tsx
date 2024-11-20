import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import { useAuthState } from "../auth/AuthStateContext";

const NavBar: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { isVerified, profileCompleted } = useAuthState();

  const handleLogout = () => {
    logout
    navigate("/login");
  };

  return (
    <nav>
    <ul>
      {user && isVerified ? (
        <>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          
          <li>
            <button onClick={handleLogout}>Logout</button>
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
function logout() {
    throw new Error("Function not implemented.");
}

