import React from 'react';
import {
  FaTh,
  FaUserAlt,
  FaRegChartBar,
  FaThList,
  FaChartArea
} from "react-icons/fa";
import { NavLink } from 'react-router-dom';

import './Sidebar.css';

const Sidebar = ({ children }) => {
  const menuItem = [
    {
      path: "/",
      name: "Dashboard",
      icon: <FaTh />,
    },
    {
      path: "/Linked_dev",
      name: "Link Devices",
      icon: <FaThList />,
    },
    {
      path: "/status",
      name: "Status Devices",
      icon: <FaChartArea />,
    },
    {
      path: "/visualization",
      name: "Data Visualization",
      icon: <FaRegChartBar />,
    },
    {
      path: "/profile",
      name: "Profile",
      icon: <FaUserAlt />,
    },
  ];

  const regularMenuItems = menuItem.slice(0, menuItem.length - 1);
  const lastMenuItem = menuItem[menuItem.length - 1];

  return (
    <div className="container" style={{ caretColor: "transparent" }}>
      <div className="sidebar">
        <div className="top_section">
          <div className="bars"></div>
        </div>
        <div className="menu_items">
          {regularMenuItems.map((item, index) => (
            <NavLink
              to={item.path}
              key={index}
              className="link"
              activeClassName="active"
            >
              <div className="icon">{item.icon}</div>
              <div className="link_text">{item.name}</div>
            </NavLink>
          ))}
        </div>
        <div className="last_menu_item">
          <NavLink
            to={lastMenuItem.path}
            className="link"
            activeClassName="active"
          >
            <div className="icon">{lastMenuItem.icon}</div>
            <div className="link_text">{lastMenuItem.name}</div>
          </NavLink>
        </div>
      </div>
      <main>{children}</main>
    </div>
  );
};

export default Sidebar;