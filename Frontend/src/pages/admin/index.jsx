import SideBare from "./component/sideBare";
import { useEffect, useState } from "react";
import { Outlet, Route, Routes, useNavigate } from "react-router-dom";
import TopBar from "./component/topBar";
import Dashboard from "./component/dashboard";
import AdminFooter from "./component/AdminFooter";

export default function IndexAdmin() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      // Auto-collapse on medium screens, but keep state as is for manual toggle
      if (window.innerWidth < 1024 && window.innerWidth >= 761) {
        setCollapsed(true);
      } else if (window.innerWidth >= 1024) {
        setCollapsed(false);
      }
      // On mobile (< 761), we keep it collapsed by default unless toggled
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!user) {
      navigate("/login?redirect=/index");
      return;
    }

    if (user.role !== "admin") {
      navigate("/");
      return;
    }
  }, [navigate]);

  return (
    <div className="flex h-screen overflow-hidden ">
      <SideBare collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex flex-col flex-1 bg-[#F4F6FA] dark:bg-[#0a0a0a] min-w-0 transition-colors duration-300">
        <TopBar collapsed={collapsed} setCollapsed={setCollapsed} user={user} />

      {/* هنا نضيف scroll */}
        <div className="flex-1 overflow-y-auto ">
          <Outlet />
        </div>
        <AdminFooter />
      </div>
    </div>
  );
}
