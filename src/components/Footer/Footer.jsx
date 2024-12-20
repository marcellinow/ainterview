import React from "react";
import Logo from "../../assets/img/logo-inv.png";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <img src={Logo} alt="Ai-nterview Logo" className="footer-logo" />
        </div>
        <div className="footer-right">
          <h2 className="footer-title">Contact Me</h2>
          <a
            href="https://instagram.com/marcellinojjj"
            className="footer-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            instagram.com/marcellinojjj
          </a>
          <a
            href="https://linkedin.com/in/gabriel-marcellino"
            className="footer-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            linkedin.com/in/gabriel-marcellino
          </a>
          <a
            href="https://github.com/marcellinow"
            className="footer-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://github.com/marcellinow
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
