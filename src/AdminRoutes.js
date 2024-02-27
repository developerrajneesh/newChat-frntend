import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Pages/Dashboard/Dashboard";
import StockChart from "./Pages/Charts/StockChart";
import PieChart from "./Pages/Charts/PieChart";
import BarChart from "./Pages/Charts/BarChart";
import StockChartComponent from "./Components/Charts/StockChartComponent";
import FlowChart from "./Pages/Charts/FlowChart";
import MapChart from "./Pages/Charts/MapChart";
import VideoChat from "./Pages/Chats/VideoChat";
import TextChat from "./Pages/Chats/TextChat";
import Layout from './Components/Layout/Layout';

function AdminRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/charts/stock" element={<StockChartComponent />} />
        <Route path="/charts/flowChart" element={<FlowChart />} />
        <Route path="/charts/mapChart" element={<MapChart />} />
        <Route path="/charts/pie" element={<PieChart />} />
        <Route path="/charts/bar" element={<BarChart />} />
        <Route path="/chat/video" element={<VideoChat />} />
        <Route path="/chat/text" element={<TextChat />} />
      </Routes>
    </Layout>
  );
}

export default AdminRoutes;
