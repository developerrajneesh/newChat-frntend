import React from "react";
import { AiOutlineStock } from "react-icons/ai";
import { FaChartPie } from "react-icons/fa";
import { MdBarChart } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { FcFlowChart } from "react-icons/fc";
import { BsGlobeCentralSouthAsia } from "react-icons/bs";
import { IoMdChatbubbles } from "react-icons/io";
import { MdVideoChat } from "react-icons/md";
function SideBarItems({ isLarge }) {
  const loaction = useLocation();
  const sideItems = [
    {
      submenus: [
        { icon: <MdDashboard size={25} />, title: "Dashboard", url: "/" },
      ],
    },
    {
      categories: "Charts",
      submenus: [
        {
          icon: <AiOutlineStock size={25} />,
          title: "Stock Chart",
          url: "/admin/charts/stock",
        },
        
        {
          icon: <BsGlobeCentralSouthAsia size={25} />,
          title: "Map Chart",
          url: "/admin/charts/mapChart",
        },
        {
          icon: <FcFlowChart size={25} />,
          title: "Flow Chart",
          url: "/admin/charts/flowChart",
        },
        {
          icon: <FaChartPie size={25} />,
          title: "Pie Chart",
          url: "/admin/charts/pie",
        },
        {
          icon: <MdBarChart size={25} />,
          title: "Bar Chart",
          url: "/admin/charts/bar",
        },
      ],
    },
    {
      categories: "Chats",
      submenus: [
        {
          icon: <IoMdChatbubbles size={25} />,
          title: "Text Chat",
          url: "/admin/chat/text",
        },
        {
          icon: <MdVideoChat size={25} />,
          title: "Video Chat",
          url: "/admin/chat/video",
        },
      ],
    },
  ];

  return (
    <>
      <div className="sidebar-items">
        {sideItems?.map((elm, ind) => {
          return (
            <>
              <div className="sidebar-categories">{elm.categories}</div>
              {elm.submenus.map((item, i) => {
                return (
                  <>
                    <Link className="linknone" to={item.url}>
                      <div
                        className={`sidebar-submenus  ${
                          loaction.pathname == item.url &&
                          "sidebar-submenus-active"
                        }`}
                      >
                        {item.icon}{" "}
                        <span
                          className={`er ${!isLarge && "visibility-hidden"}`}
                        >
                          {item.title}
                        </span>
                      </div>
                    </Link>
                  </>
                );
              })}
            </>
          );
        })}
      </div>
    </>
  );
}

export default SideBarItems;
