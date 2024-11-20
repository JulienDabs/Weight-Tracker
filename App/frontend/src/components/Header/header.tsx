import React from "react";
import "../../Style/header.css";

import betterMeLogo from "../../assets/bettermeLogoSvg.svg";

const Header = () => {
  return (
    <>
      <div className="logo">
        <img src={betterMeLogo} alt="betterme logo"  />
      </div>
    </>
  );
};

export default Header;
