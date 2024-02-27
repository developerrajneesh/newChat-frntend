import React, { useState } from "react";
import "./layout.css";
import { FaBarsStaggered } from "react-icons/fa6";
import SideBarItems from "./SideBarItems";
import { RiFullscreenExitFill } from "react-icons/ri";
import { RiFullscreenFill } from "react-icons/ri";
function Layout({ children }) {
  const [isLarge, setIslarge] = useState(true);

  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      // Enter full screen mode
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      }
    } else {
      // Exit full screen mode
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    setIsFullScreen(!isFullScreen);
  };

  return (
    <>
      <div className="main-layout">
        <div
          className={`sidebar-main ${
            isLarge ? "sidebar-large" : "sidebar-small"
          }`}
        >
          <div className="logo-main"> {isLarge ? "Admin Panel" : "Panel"} </div>
          <SideBarItems  isLarge={isLarge} />
        </div>
        <div className="right-main">
          <div className="navbar-main">
            <div>
              <FaBarsStaggered className="cursor"  onClick={() => setIslarge(!isLarge)} />
            </div>
            <div className="right-items">
              {isFullScreen ? (
                <RiFullscreenExitFill className="cursor" size={25} onClick={toggleFullScreen} />
              ) : (
                <RiFullscreenFill className="cursor" size={25}  onClick={toggleFullScreen} />
              )}
              Logout
            </div>
          </div>
          <div className="main-content">{children}</div>
        </div>
      </div>
    </>
  );
}

export default Layout;
