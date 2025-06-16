import React, { useContext } from "react";
import "./Sidebar.css";
import { assets } from "../assets/assets";

const SideBar = () => {
  return (
    <div className="sidebar">
      <div className="top">
        <img className="menu" src={assets.menu_icon} alt="" />
      </div>
      <div>
        <div className="bottom">
          <img src={assets.question_icon} alt="" />
          <p>Ajuda</p>
        </div>
        <div className="bottom">
          <img src={assets.setting_icon} alt="" />
          <p>Configurações</p>
        </div>
      </div>
    </div>
  );
};
export default SideBar;
