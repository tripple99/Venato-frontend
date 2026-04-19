import Navbar from "../client/Navbar";
import { Outlet } from "react-router-dom";

export default function ClientLayout() {
  return (
    <div className="w-full relative">
      <Navbar />
      <div>
        <Outlet /> {/* 👈 renders homepage OR other client pages */}
      </div>
    </div>
  );
}
