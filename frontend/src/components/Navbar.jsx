import React, { useState } from "react";
import { NavLink as RouterNavLink, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const Navbar = ({ user, userType, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { to: "/", label: "HOME" },
    { to: "/about", label: "ABOUT" },
    ...(user && userType !== "renter" ? [{ to: "/search", label: "SEARCH" }] : []),
    ...(userType === "user" ? [{ to: "/dashboard", label: "DASHBOARD" }] : []),
    ...(userType === "renter"
      ? [
          { to: "/renter", label: "RENTER" },
          { to: "/rdashboard", label: "DASHBOARD" },
        ]
      : []),
  ];

  const handleLogout = () => {
    onLogout();
    setMenuOpen(false);
    navigate("/home", { replace: true });
  };

  return (
    <>
      <nav className="bg-[#0b1120] fixed top-0 left-0 right-0 z-50 text-white shadow-lg font-sans tracking-widest uppercase">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center px-6 py-5 md:py-6 h-20">
          {/* Logo */}
          <RouterNavLink to="/" className="flex items-center space-x-3">
            <img src="/home.png" className="h-10 rounded-xl" alt="Abhi Homes Logo" />
            <span className="text-2xl font-extrabold text-white">ABHI HOMES</span>
          </RouterNavLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-bold">
            {navLinks.map((link) => (
              <NavItem key={link.to} {...link} />
            ))}
            {user ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                LOGOUT
              </button>
            ) : (
              <NavItem
                to="/login"
                label="LOGIN"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              />
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white text-3xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden flex flex-col items-center bg-[#0b1120] py-4 space-y-3 border-t border-gray-700 z-50">
            {navLinks.map((link) => (
              <NavItem
                key={link.to}
                {...link}
                onClick={() => setMenuOpen(false)}
                className="w-full text-center"
              />
            ))}
            {user ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white w-11/12 py-2 rounded hover:bg-red-600 transition"
              >
                LOGOUT
              </button>
            ) : (
              <NavItem
                to="/login"
                label="LOGIN"
                onClick={() => setMenuOpen(false)}
                className="bg-blue-500 text-white w-11/12 py-2 rounded hover:bg-blue-600 transition text-center"
              />
            )}
          </div>
        )}
      </nav>
      {/* Spacer */}
      <div className="h-20" />
    </>
  );
};

// NavItem component
const NavItem = ({ to, label, className = "", onClick }) => {
  return (
    <RouterNavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `transition duration-200 px-4 py-2 rounded-md ${
          isActive
            ? "text-white font-extrabold underline underline-offset-8 decoration-blue-500"
            : "text-white hover:text-blue-300"
        } ${className}`
      }
    >
      {label}
    </RouterNavLink>
  );
};

NavItem.propTypes = {
  to: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

Navbar.propTypes = {
  user: PropTypes.bool.isRequired,
  userType: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Navbar;
