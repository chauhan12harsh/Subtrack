import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import { isAuthenticated } from "../Utils/Auth";

const DashboardLayout = () => {

  if (!isAuthenticated()) {
      return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6 bg-slate-100 scrollbar-hide">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
