import React from "react";

import bettermelogo from "../../assets/bettermeLogoSvg.svg"
import "../../Style/footer.css";

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="footer">
        <img src={bettermelogo} alt="betterme logo" className="logoFooter" />
        <p>Developpé par <a href="https://www.jmdwebdev.com">JMD WEB DEV</a></p>
      </div>
    </footer>
  );
};

export default Footer;